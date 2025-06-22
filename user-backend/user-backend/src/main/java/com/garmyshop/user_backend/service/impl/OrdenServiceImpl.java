package com.garmyshop.user_backend.service.impl;

import com.garmyshop.user_backend.dto.*;
import com.garmyshop.user_backend.entity.*;
import com.garmyshop.user_backend.exception.RecursoNoEncontradoException;
import com.garmyshop.user_backend.exception.StockInsuficienteException;
import com.garmyshop.user_backend.model.enums.EstadoOrden;
import com.garmyshop.user_backend.model.enums.EstadoPagoOrden;
// El import de MetodoPago no se usa directamente aquí si solo se pasa el enum desde el requestDTO
// pero es bueno tenerlo por si acaso o si los mappers lo necesitaran explícitamente
// import com.garmyshop.user_backend.model.enums.MetodoPago;
import com.garmyshop.user_backend.repository.*;
import com.garmyshop.user_backend.service.OrdenService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrdenServiceImpl implements OrdenService {

    private final OrdenRepository ordenRepository;
    private final AuthUserRepository authUserRepository;
    private final DireccionRepository direccionRepository;
    private final CombinacionProductoRepository combinacionProductoRepository;
    // private final ProductoRepository productoRepository; // <<< ELIMINADO

    public OrdenServiceImpl(OrdenRepository ordenRepository,
                            AuthUserRepository authUserRepository,
                            DireccionRepository direccionRepository,
                            CombinacionProductoRepository combinacionProductoRepository
                            /*, ProductoRepository productoRepository */) { // <<< ELIMINADO DEL CONSTRUCTOR
        this.ordenRepository = ordenRepository;
        this.authUserRepository = authUserRepository;
        this.direccionRepository = direccionRepository;
        this.combinacionProductoRepository = combinacionProductoRepository;
        // this.productoRepository = productoRepository; // <<< ELIMINADO
    }

    private OrdenListDTO convertirAOrdenListDTO(Orden orden) {
        if (orden == null) return null;
        int cantidadTotalItems = orden.getItems() != null ? orden.getItems().stream().mapToInt(OrdenItem::getCantidad).sum() : 0;
        return new OrdenListDTO(
                orden.getId(),
                orden.getFechaCreacion(), // Usa LocalDateTime
                orden.getTotal(),
                orden.getEstado(),
                cantidadTotalItems
        );
    }

    private OrdenDetailDTO convertirAOrdenDetailDTO(Orden orden) {
        if (orden == null) return null;
        DireccionDTO direccionDTO = null;
        if (orden.getDireccionEnvio() != null) {
            Direccion dir = orden.getDireccionEnvio();
            direccionDTO = new DireccionDTO(
                    dir.getId(), dir.getNombre(), dir.getApellido(), dir.getDepartamento(),
                    dir.getProvincia(), dir.getDistrito(), dir.getCalle(),
                    dir.getCodigoPostal(), dir.getReferencia(), dir.getTelefono()
            );
        }
        List<OrdenItemDetalleDTO> itemsDTO = new ArrayList<>();
        if (orden.getItems() != null) {
            itemsDTO = orden.getItems().stream()
                .map(item -> {
                    CombinacionProducto cp = item.getCombinacion();
                    Producto prod = cp.getProducto();
                    String imagenPrincipalUrl = prod.getImagenes() != null ? prod.getImagenes().stream()
                                                .filter(ImagenProducto::getEsPrincipal)
                                                .map(ImagenProducto::getImagen)
                                                .findFirst()
                                                .orElse(prod.getImagenes().isEmpty() ? null : prod.getImagenes().get(0).getImagen())
                                                : null;
                    return new OrdenItemDetalleDTO(
                            item.getId(),
                            prod.getId(),
                            prod.getNombre(),
                            imagenPrincipalUrl,
                            cp.getTalla().getNombre(),
                            cp.getColor().getNombre(),
                            cp.getSku(),
                            item.getCantidad(),
                            item.getPrecioUnitario(),
                            item.getSubtotal()
                    );
                })
                .collect(Collectors.toList());
        }
        int cantidadTotalItems = itemsDTO.stream().mapToInt(OrdenItemDetalleDTO::getCantidad).sum();
        return new OrdenDetailDTO(
                orden.getId(),
                orden.getFechaCreacion(),      // Usa LocalDateTime
                orden.getFechaActualizacion(), // Usa LocalDateTime
                orden.getTotal(),
                orden.getMetodoPago(), // Devuelve String
                orden.getEstadoPago(),    // Pasa el Enum (Jackson usará @JsonValue)
                orden.getEstado(),        // Pasa el Enum (Jackson usará @JsonValue)
                cantidadTotalItems,
                direccionDTO,
                itemsDTO
        );
    }    

    @Override
    @Transactional(readOnly = true)
    public Page<OrdenListDTO> obtenerOrdenesPorUsuario(String username, Pageable pageable) {
        AuthUser usuario = authUserRepository.findByUsername(username)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado con username: " + username));
        return ordenRepository.findByUsuarioOrderByFechaCreacionDesc(usuario, pageable)
                .map(this::convertirAOrdenListDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<OrdenDetailDTO> obtenerDetalleOrdenPorIdYUsuario(Integer ordenId, String username) {
        AuthUser usuario = authUserRepository.findByUsername(username)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado con username: " + username));
        return ordenRepository.findById(ordenId)
                .filter(orden -> orden.getUsuario().getId().equals(usuario.getId()))
                .map(this::convertirAOrdenDetailDTO);
    }

    @Override
    @Transactional
    public OrdenDetailDTO crearNuevaOrden(String username, CrearOrdenRequestDTO requestDTO) {
        AuthUser usuario = authUserRepository.findByUsername(username)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado: " + username));

        Direccion direccionEnvio = direccionRepository.findById(requestDTO.getDireccionEnvioId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Dirección de envío no encontrada con ID: " + requestDTO.getDireccionEnvioId()));

        if (!direccionEnvio.getUsuario().getId().equals(usuario.getId())) {
            throw new SecurityException("La dirección de envío no pertenece al usuario autenticado.");
        }

        List<OrdenItem> ordenItems = new ArrayList<>();
        BigDecimal totalOrden = BigDecimal.ZERO;
        int cantidadTotalItemsEnOrden = 0;

        if (requestDTO.getItems() == null || requestDTO.getItems().isEmpty()) {
            throw new IllegalArgumentException("La lista de ítems no puede estar vacía.");
        }

        for (ItemOrdenRequestDTO itemRequest : requestDTO.getItems()) {
            if (itemRequest.getCantidad() <= 0) {
                throw new IllegalArgumentException("La cantidad para el item con combinacionProductoId " + itemRequest.getCombinacionProductoId() + " debe ser positiva.");
            }

            CombinacionProducto combinacion = combinacionProductoRepository.findById(itemRequest.getCombinacionProductoId())
                    .orElseThrow(() -> new RecursoNoEncontradoException("Combinación de producto no encontrada con ID: " + itemRequest.getCombinacionProductoId()));

            Producto producto = combinacion.getProducto();

            if (combinacion.getStock() < itemRequest.getCantidad()) {
                throw new StockInsuficienteException("Stock insuficiente para el producto: " + producto.getNombre() +
                        " (Color: " + combinacion.getColor().getNombre() + ", Talla: " + combinacion.getTalla().getNombre() +
                        "). Solicitado: " + itemRequest.getCantidad() + ", Disponible: " + combinacion.getStock());
            }

            BigDecimal precioUnitario = (producto.getPrecioOferta() != null && producto.getPrecioOferta().compareTo(BigDecimal.ZERO) > 0)
                                        ? producto.getPrecioOferta()
                                        : producto.getPrecio();

            BigDecimal subtotalItem = precioUnitario.multiply(BigDecimal.valueOf(itemRequest.getCantidad()));

            OrdenItem ordenItem = new OrdenItem();
            ordenItem.setCombinacion(combinacion);
            ordenItem.setCantidad(itemRequest.getCantidad());
            ordenItem.setPrecioUnitario(precioUnitario);
            ordenItem.setSubtotal(subtotalItem);

            ordenItems.add(ordenItem);
            totalOrden = totalOrden.add(subtotalItem);
            cantidadTotalItemsEnOrden += itemRequest.getCantidad();

            combinacion.setStock(combinacion.getStock() - itemRequest.getCantidad());
            combinacionProductoRepository.save(combinacion);
        }

        Orden nuevaOrden = new Orden();
        nuevaOrden.setUsuario(usuario);
        nuevaOrden.setDireccionEnvio(direccionEnvio);
        nuevaOrden.setTotal(totalOrden);
        nuevaOrden.setMetodoPago(requestDTO.getMetodoPago());
        nuevaOrden.setEstadoPago(EstadoPagoOrden.PENDIENTE);
        nuevaOrden.setEstado(EstadoOrden.PENDIENTE);
        nuevaOrden.setCantidadCompra(cantidadTotalItemsEnOrden);
        
        // Primero se guardan los items individuales si no hay cascade o para asegurar IDs
        // Esta parte podría cambiar dependiendo de la estrategia de cascade
        for (OrdenItem item : ordenItems) {
            item.setOrden(nuevaOrden); // Asocia el item a la orden ANTES de que la orden se guarde
                                       // si la orden va a hacer cascade a los items.
        }
        nuevaOrden.setItems(ordenItems); // Establece la colección en la Orden

        Orden ordenGuardada = ordenRepository.save(nuevaOrden); // Guarda la Orden (y los items por cascade)

        return convertirAOrdenDetailDTO(ordenGuardada);
    }



    @Override // <<< NUEVO MÉTODO
    @Transactional // Esta operación modifica la base de datos
    public Optional<OrdenDetailDTO> confirmarPagoOrden(Integer ordenId, String sessionId) {
        // Aquí podrías añadir lógica para guardar el sessionId de Stripe en tu Orden si quieres,
        // para futuras referencias o para evitar procesar el mismo pago dos veces.
        // Por ejemplo, añadiendo un campo `idTransaccionPasarela` a tu entidad Orden.

        Orden orden = ordenRepository.findById(ordenId)
                .orElseThrow(() -> new RecursoNoEncontradoException("Orden no encontrada con ID: " + ordenId));

        // Verificar si la orden ya fue pagada para evitar doble procesamiento (idempotencia básica)
        if (orden.getEstadoPago() == EstadoPagoOrden.PAGADO) {
            // La orden ya está pagada, simplemente devuelve sus detalles.
            // Podrías loguear esto como una confirmación repetida.
            // logger.info("Intento de confirmar pago para orden ya pagada: {}", ordenId);
            return Optional.of(convertirAOrdenDetailDTO(orden));
        }

        // Actualizar estados
        orden.setEstadoPago(EstadoPagoOrden.PAGADO);
        orden.setEstado(EstadoOrden.PENDIENTE); // O el estado que siga después de un pago exitoso
                                                 // (PENDIENTE -> PROCESANDO podría ser uno)
        // Nota: El campo `fechaActualizacion` de la Orden se actualizará automáticamente
        // gracias a la anotación @UpdateTimestamp en la entidad Orden.

        Orden ordenActualizada = ordenRepository.save(orden);

        // Aquí podrías disparar otras acciones:
        // - Enviar un email de confirmación de orden/pago al usuario.
        // - Notificar a un sistema de inventario/fulfillment.
        // Por ahora, solo actualizamos la orden.

        return Optional.of(convertirAOrdenDetailDTO(ordenActualizada));
    }
}