package com.garmyshop.user_backend.controller;

import com.garmyshop.user_backend.dto.OrdenDetailDTO;
import com.garmyshop.user_backend.dto.CrearOrdenRequestDTO;
import com.garmyshop.user_backend.dto.OrdenListDTO;
import com.garmyshop.user_backend.service.OrdenService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.garmyshop.user_backend.exception.RecursoNoEncontradoException; // Importa tu excepción
import com.garmyshop.user_backend.exception.StockInsuficienteException;

@RestController
@RequestMapping("/api/ordenes") // Ruta base para las órdenes del usuario
public class OrdenController {

    private final OrdenService ordenService;

    public OrdenController(OrdenService ordenService) {
        this.ordenService = ordenService;
    }

    /**
     * Endpoint para obtener el historial de órdenes del usuario autenticado (paginado).
     * GET /api/ordenes
     *
     * @param pageable Información de paginación (ej. ?page=0&size=10&sort=fechaCreacion,desc)
     * @return ResponseEntity con una Page de OrdenListDTO.
     */
    @GetMapping
    public ResponseEntity<Page<OrdenListDTO>> obtenerMisOrdenes(
            @PageableDefault(
                    size = 10
                    //sort = "fechaCreacion", // <<< CAMBIADO AQUÍ: de "fecha_creacion" a "fechaCreacion"
                    //direction = PageableDefault.Sort.Direction.DESC
            ) Pageable pageable) {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal().toString())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String currentUsername = authentication.getName();

        Page<OrdenListDTO> ordenesPage = ordenService.obtenerOrdenesPorUsuario(currentUsername, pageable);
        return ResponseEntity.ok(ordenesPage);
    }

    /**
     * Endpoint para obtener el detalle de una orden específica del usuario autenticado.
     * GET /api/ordenes/{ordenId}
     *
     * @param ordenId El ID de la orden a consultar.
     * @return ResponseEntity con OrdenDetailDTO si se encuentra y pertenece al usuario, o 404/401.
     */
    @GetMapping("/{ordenId}")
    public ResponseEntity<OrdenDetailDTO> obtenerDetalleDeMiOrden(@PathVariable Integer ordenId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal().toString())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String currentUsername = authentication.getName();

        return ordenService.obtenerDetalleOrdenPorIdYUsuario(ordenId, currentUsername)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build()); // 404 si la orden no existe o no pertenece al usuario
    }

    // --- NUEVO Endpoint para Crear Orden ---
    /**
     * Endpoint para crear una nueva orden a partir del carrito/solicitud del usuario.
     * POST /api/ordenes
     *
     * @param crearOrdenRequestDTO Los detalles de la orden a crear.
     * @return ResponseEntity con el OrdenDetailDTO de la orden creada y estado HTTP 201 (Created),
     *         o un error HTTP 400/404/409 si algo falla.
     */
    @PostMapping
    public ResponseEntity<?> crearNuevaOrden(@RequestBody CrearOrdenRequestDTO crearOrdenRequestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Doble verificación, aunque Spring Security ya debería proteger este endpoint
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal().toString())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado.");
        }
        String currentUsername = authentication.getName();

        try {
            OrdenDetailDTO nuevaOrden = ordenService.crearNuevaOrden(currentUsername, crearOrdenRequestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaOrden);
        } catch (RecursoNoEncontradoException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (StockInsuficienteException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage()); // 409 Conflict es apropiado para stock
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage()); // Para validaciones de datos de entrada
        } catch (SecurityException ex) { // Si la dirección no pertenece al usuario
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        } catch (RuntimeException ex) { // Captura general para otros errores inesperados
            // Loguear este error en el servidor es importante
            // logger.error("Error inesperado al crear orden: ", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno al procesar la orden.");
        }
    }
}