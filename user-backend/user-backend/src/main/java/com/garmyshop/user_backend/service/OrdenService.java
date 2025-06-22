package com.garmyshop.user_backend.service;

import com.garmyshop.user_backend.dto.CrearOrdenRequestDTO;
import com.garmyshop.user_backend.dto.OrdenDetailDTO;
import com.garmyshop.user_backend.dto.OrdenListDTO;
import com.garmyshop.user_backend.exception.RecursoNoEncontradoException;

// import com.garmyshop.user_backend.dto.CrearOrdenRequestDTO; // Para cuando implementemos la creación
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface OrdenService {

    /**
     * Obtiene una página del historial de órdenes para un usuario específico.
     * Las órdenes se devuelven ordenadas por fecha de creación descendente.
     *
     * @param username el nombre de usuario del cliente.
     * @param pageable información de paginación.
     * @return un Page<OrdenListDTO> con las órdenes del usuario.
     */
    Page<OrdenListDTO> obtenerOrdenesPorUsuario(String username, Pageable pageable);

    /**
     * Obtiene los detalles completos de una orden específica, verificando que pertenezca al usuario.
     *
     * @param ordenId el ID de la orden a buscar.
     * @param username el nombre de usuario del cliente que solicita la orden.
     * @return un Optional conteniendo el OrdenDetailDTO si se encuentra y pertenece al usuario,
     *         o un Optional vacío si no.
     */
    Optional<OrdenDetailDTO> obtenerDetalleOrdenPorIdYUsuario(Integer ordenId, String username);

    // --- Métodos para la creación de órdenes (los implementaremos después) ---
    /**
    /**
     * Crea una nueva orden para el usuario especificado a partir de los ítems proporcionados.
     *
     * @param username el nombre de usuario del cliente que crea la orden.
     * @param requestDTO DTO que contiene la lista de ítems del carrito, ID de dirección de envío, método de pago.
     * @return el OrdenDetailDTO de la orden recién creada.
     * @throws RuntimeException si hay problemas (ej. usuario no encontrado, dirección inválida, producto no encontrado, stock insuficiente).
     */
    OrdenDetailDTO crearNuevaOrden(String username, CrearOrdenRequestDTO requestDTO);


    // --- Métodos para actualización de estado (posiblemente más para admin o pasarela de pago) ---
    /**
     * Actualiza el estado de una orden (ej. a 'ENVIADO', 'ENTREGADO', 'CANCELADO').
     * También podría actualizar el estado del pago.
     *
     * @param ordenId el ID de la orden a actualizar.
     * @param nuevoEstado el nuevo estado de la orden.
     * @param nuevoEstadoPago (opcional) el nuevo estado del pago.
     * @return el OrdenDetailDTO de la orden actualizada.
     * @throws RuntimeException si la orden no se encuentra o la transición de estado no es válida.
     */
    // Optional<OrdenDetailDTO> actualizarEstadoOrden(Integer ordenId, EstadoOrden nuevoEstado, EstadoPagoOrden nuevoEstadoPago);


    /**
     * Confirma un pago para una orden específica y actualiza sus estados.
     * Este método sería llamado después de verificar un pago exitoso con la pasarela.
     *
     * @param ordenId El ID de la orden en tu sistema.
     * @param sessionId (Opcional) El ID de la sesión de la pasarela de pago, para referencia o logging.
     * @return El OrdenDetailDTO de la orden actualizada.
     * @throws RecursoNoEncontradoException si la orden no se encuentra.
     * @throws IllegalStateException si la orden ya fue pagada o está en un estado que no permite confirmar el pago.
     */
    Optional<OrdenDetailDTO> confirmarPagoOrden(Integer ordenId, String sessionId);

}