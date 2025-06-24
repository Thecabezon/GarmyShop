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
import com.garmyshop.user_backend.exception.RecursoNoEncontradoException;
import com.garmyshop.user_backend.exception.StockInsuficienteException;

@RestController
@RequestMapping("/api/ordenes")
public class OrdenController {

    private final OrdenService ordenService;

    public OrdenController(OrdenService ordenService) {
        this.ordenService = ordenService;
    }

    /**
     * Endpoint para obtener el historial de órdenes del usuario autenticado (paginado).
     * 
     *
     * @param pageable
     * @return 
     */
    @GetMapping
    public ResponseEntity<Page<OrdenListDTO>> obtenerMisOrdenes(
            @PageableDefault(
                    size = 10
                    
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
     * 
     *
     * @param ordenId
     * @return 
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
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Endpoint para crear una nueva orden a partir del carrito/solicitud del usuario.
     * 
     *
     * @param crearOrdenRequestDTO
     * @return
     */
    @PostMapping
    public ResponseEntity<?> crearNuevaOrden(@RequestBody CrearOrdenRequestDTO crearOrdenRequestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
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
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (SecurityException ex) { 
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        } catch (RuntimeException ex) { 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno al procesar la orden.");
        }
    }
}