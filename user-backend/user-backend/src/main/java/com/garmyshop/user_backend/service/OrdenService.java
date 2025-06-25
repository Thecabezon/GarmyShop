package com.garmyshop.user_backend.service;

import com.garmyshop.user_backend.dto.CrearOrdenRequestDTO;
import com.garmyshop.user_backend.dto.OrdenDetailDTO;
import com.garmyshop.user_backend.dto.OrdenListDTO;
import com.garmyshop.user_backend.exception.RecursoNoEncontradoException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface OrdenService {

    /**
     * Obtiene una página del historial de órdenes para un usuario específico.
     * @param username
     * @param pageable
     * @return
     */
    Page<OrdenListDTO> obtenerOrdenesPorUsuario(String username, Pageable pageable);

    /**
     * Obtiene los detalles completos de una orden específica, verificando que pertenezca al usuario.
     * @param ordenId
     * @param username
     * @return
     */
    Optional<OrdenDetailDTO> obtenerDetalleOrdenPorIdYUsuario(Integer ordenId, String username);

    /**
     * Crea una nueva orden para el usuario especificado a partir de los ítems proporcionados.
     *
     * @param username
     * @param requestDTO
     * @return
     * @throws RuntimeException
     */
    OrdenDetailDTO crearNuevaOrden(String username, CrearOrdenRequestDTO requestDTO);

    /**
     * Actualiza el estado de una orden (ej. a 'ENVIADO', 'ENTREGADO', 'CANCELADO').
     * @param ordenId
     * @param nuevoEstado
     * @param nuevoEstadoPago 
     * @return
     * @throws RuntimeException
     */

    /**
     * Confirma un pago para una orden específica y actualiza sus estados.
     * @param ordenId
     * @param sessionId
     * @return
     * @throws RecursoNoEncontradoException
     * @throws IllegalStateException
     */
    Optional<OrdenDetailDTO> confirmarPagoOrden(Integer ordenId, String sessionId);

}