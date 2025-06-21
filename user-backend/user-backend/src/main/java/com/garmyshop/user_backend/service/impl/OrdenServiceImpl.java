package com.garmyshop.user_backend.service.impl;

import com.garmyshop.user_backend.dto.*;
import com.garmyshop.user_backend.entity.*;
import com.garmyshop.user_backend.exception.RecursoNoEncontradoException; // Necesitaremos crear esta excepción personalizada
import com.garmyshop.user_backend.exception.StockInsuficienteException; // Y esta también
import com.garmyshop.user_backend.model.enums.EstadoOrden;
import com.garmyshop.user_backend.model.enums.EstadoPagoOrden;
import com.garmyshop.user_backend.repository.*;
import com.garmyshop.user_backend.service.OrdenService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // MUY IMPORTANTE AQUÍ

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
    private final ProductoRepository productoRepository; // Podría ser útil para obtener info del producto base

    public OrdenServiceImpl(OrdenRepository ordenRepository,
                            AuthUserRepository authUserRepository,
                            DireccionRepository direccionRepository,
                            CombinacionProductoRepository combinacionProductoRepository,
                            ProductoRepository productoRepository) {
        this.ordenRepository = ordenRepository;
        this.authUserRepository = authUserRepository;
        this.direccionRepository = direccionRepository;
        this.combinacionProductoRepository = combinacionProductoRepository;
        this.productoRepository = productoRepository;
    }

    // --- (Métodos de mapeo convertirAOrdenListDTO y convertirAOrdenDetailDTO que ya tienes) ---
    // ... (Asegúrate de que estos métodos de mapeo estén aquí y funcionen bien) ...
    private OrdenListDTO convertirAOrdenListDTO(Orden orden) {
        if (orden == null) return null;
        int cantidadTotalItems = orden.getItems() != null ? orden.getItems().stream().mapToInt(OrdenItem::getCantidad).sum() : 0;
        return new OrdenListDTO(
                orden.getId(),
                orden.getFechaCreacion(),
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
                orden.getFechaCreacion(),
                orden.getFechaActualizacion(),
                orden.getTotal(),
                orden.getMetodoPago().getValorEnDb(), // O getDescripcion() si tienes ese método y quieres la descripción
                orden.getEstadoPago(),
                orden.getEstado(),
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

    // --- Implementación de Crear Nueva Orden ---
    @Override
    @Transactional // Esta operación modifica múltiples tablas, debe ser transaccional
    public OrdenDetailDTO crearNuevaOrden(String username, CrearOrdenRequestDTO requestDTO) {
        // 1. Obtener el usuario
        AuthUser usuario = authUserRepository.findByUsername(username)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado: " + username));

        // 2. Obtener la dirección de envío y validar que pertenece al usuario
        Direccion direccionEnvio = direccionRepository.findById(requestDTO.getDireccionEnvioId())
                .orElseThrow(() -> new RecursoNoEncontradoException("Dirección de envío no encontrada con ID: " + requestDTO.getDireccionEnvioId()));

        if (!direccionEnvio.getUsuario().getId().equals(usuario.getId())) {
            throw new SecurityException("La dirección de envío no pertenece al usuario autenticado.");
            // O una excepción personalizada más específica
        }

        // 3. Procesar los ítems de la orden, validar stock y calcular totales
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

            Producto producto = combinacion.getProducto(); // Asume que se carga LAZY o ya está

            // Validar stock
            if (combinacion.getStock() < itemRequest.getCantidad()) {
                throw new StockInsuficienteException("Stock insuficiente para el producto: " + producto.getNombre() +
                        " (Color: " + combinacion.getColor().getNombre() + ", Talla: " + combinacion.getTalla().getNombre() +
                        "). Solicitado: " + itemRequest.getCantidad() + ", Disponible: " + combinacion.getStock());
            }

            // Determinar el precio unitario (oferta o precio normal)
            BigDecimal precioUnitario = (producto.getPrecioOferta() != null && producto.getPrecioOferta().compareTo(BigDecimal.ZERO) > 0)
                                        ? producto.getPrecioOferta()
                                        : producto.getPrecio();

            BigDecimal subtotalItem = precioUnitario.multiply(BigDecimal.valueOf(itemRequest.getCantidad()));

            OrdenItem ordenItem = new OrdenItem();
            // ordenItem.setOrden(orden); // Se establecerá después de guardar la orden
            ordenItem.setCombinacion(combinacion);
            ordenItem.setCantidad(itemRequest.getCantidad());
            ordenItem.setPrecioUnitario(precioUnitario);
            ordenItem.setSubtotal(subtotalItem);
            // Los campos 'creado' y 'actualizado' se gestionan con @CreationTimestamp/@UpdateTimestamp

            ordenItems.add(ordenItem);
            totalOrden = totalOrden.add(subtotalItem);
            cantidadTotalItemsEnOrden += itemRequest.getCantidad();

            // Descontar stock (IMPORTANTE)
            combinacion.setStock(combinacion.getStock() - itemRequest.getCantidad());
            combinacionProductoRepository.save(combinacion); // Guardar la combinación actualizada
        }

        // 4. Crear y guardar la entidad Orden
        Orden nuevaOrden = new Orden();
        nuevaOrden.setUsuario(usuario);
        nuevaOrden.setDireccionEnvio(direccionEnvio);
        nuevaOrden.setTotal(totalOrden);
        nuevaOrden.setMetodoPago(requestDTO.getMetodoPago()); // Usando el Enum
        nuevaOrden.setEstadoPago(EstadoPagoOrden.PENDIENTE); // Estado de pago inicial
        nuevaOrden.setEstado(EstadoOrden.PENDIENTE);       // Estado de la orden inicial
        nuevaOrden.setCantidadCompra(cantidadTotalItemsEnOrden); // El campo que ya tenías
        // fechaCreacion y fechaActualizacion se gestionan con @CreationTimestamp/@UpdateTimestamp
        
        // Guardar la orden primero para obtener su ID
        Orden ordenGuardada = ordenRepository.save(nuevaOrden);

        // 5. Asociar los OrdenItem a la Orden guardada y guardarlos
        for (OrdenItem item : ordenItems) {
            item.setOrden(ordenGuardada); // Ahora la orden tiene un ID
            // Nota: si la relación Orden -> OrdenItem tiene cascade = CascadeType.ALL o PERSIST,
            // y los items se añaden a ordenGuardada.getItems().add(item), entonces
            // un solo save(ordenGuardada) podría persistir los items.
            // Pero guardarlos explícitamente después de asignar la orden es más claro.
            // En este caso, como ya estamos guardando combinacionProducto, y vamos a guardar orden,
            // y OrdenItem depende de Orden, es mejor asegurarnos.
            // Si `Orden.items` tiene `cascade = CascadeType.ALL` y `orphanRemoval = true`,
            // y hacemos `ordenGuardada.setItems(ordenItems);` ANTES de `ordenRepository.save(nuevaOrden)`,
            // podría funcionar con un solo save de Orden.
            // Por ahora, para claridad y control, guardaremos después de establecer la Orden.
        }
        // Establecer los items en la orden y volver a guardar podría ser necesario si no hay cascade en la lista
        // O si los items no se guardan automáticamente.
        // Una forma común es:
        nuevaOrden.setItems(ordenItems); // Asegurar que la entidad Orden tenga la lista
        // El cascade = CascadeType.ALL en Orden.items debería encargarse de persistir los OrdenItem
        // cuando la Orden se guarda, siempre que la relación bidireccional esté bien configurada.
        // Con el save anterior de `ordenGuardada`, ya debería tener el ID.

        // Si los items no se guardaron por cascade, necesitarías guardarlos explícitamente:
        // ordenItemRepository.saveAll(ordenItems); // Necesitarías inyectar OrdenItemRepository

        // 6. Devolver el DTO de la orden creada
        // Es importante recargar la orden o asegurarse de que el objeto 'ordenGuardada'
        // tiene todos sus campos actualizados, especialmente si hay triggers o valores por defecto de BD.
        // Para los DTOs, es mejor usar la entidad que ya tenemos.
        return convertirAOrdenDetailDTO(ordenGuardada);
    }
}