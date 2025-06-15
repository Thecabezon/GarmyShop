package com.garmyshop.user_backend.controller;

import com.garmyshop.user_backend.dto.CategoriaDTO;
import com.garmyshop.user_backend.service.CategoriaService;
import org.springframework.http.ResponseEntity; // Para construir respuestas HTTP
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
// import java.util.Optional; // No es necesario si manejamos el Optional en el controlador

@RestController // Marca esta clase como un controlador REST, combina @Controller y @ResponseBody
@RequestMapping("/api/categorias") // Ruta base para todos los endpoints en este controlador
public class CategoriaController {

    private final CategoriaService categoriaService;

    // Inyección de dependencias
    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    /**
     * Endpoint para obtener todas las categorías activas.
     * GET /api/categorias
     *
     * @return ResponseEntity con una lista de CategoriaDTO y estado HTTP 200 (OK),
     *         o estado HTTP 204 (No Content) si la lista está vacía (opcional, 200 con lista vacía también es común).
     */
    @GetMapping
    public ResponseEntity<List<CategoriaDTO>> obtenerTodasLasCategoriasActivas() {
        List<CategoriaDTO> categorias = categoriaService.obtenerTodasLasCategoriasActivas();
        if (categorias.isEmpty()) {
            return ResponseEntity.noContent().build(); // HTTP 204 si no hay categorías activas
        }
        return ResponseEntity.ok(categorias); // HTTP 200 con la lista de categorías
    }

    /**
     * Endpoint para obtener una categoría activa por su slug.
     * GET /api/categorias/slug/{slugDeLaCategoria}
     *
     * @param slug el slug de la categoría.
     * @return ResponseEntity con el CategoriaDTO y estado HTTP 200 (OK) si se encuentra y está activa,
     *         o estado HTTP 404 (Not Found) si no se encuentra o no está activa.
     */
    @GetMapping("/slug/{slug}") // La ruta es /api/categorias/slug/{slug}
    public ResponseEntity<CategoriaDTO> obtenerCategoriaActivaPorSlug(@PathVariable String slug) {
        return categoriaService.obtenerCategoriaActivaPorSlug(slug)
                .map(categoriaDTO -> ResponseEntity.ok(categoriaDTO)) // Si presente, HTTP 200 con el DTO
                .orElseGet(() -> ResponseEntity.notFound().build());   // Si no, HTTP 404
    }

    /**
     * Endpoint para obtener una categoría por su ID.
     * GET /api/categorias/{idDeLaCategoria}
     *
     * @param id el ID de la categoría.
     * @return ResponseEntity con el CategoriaDTO y estado HTTP 200 (OK) si se encuentra,
     *         o estado HTTP 404 (Not Found) si no.
     *         (Nota: Este endpoint no filtra por 'activo' según la definición del servicio)
     */
    @GetMapping("/{id}") // La ruta es /api/categorias/{id}
    public ResponseEntity<CategoriaDTO> obtenerCategoriaPorId(@PathVariable Integer id) {
        return categoriaService.obtenerCategoriaPorId(id)
                .map(ResponseEntity::ok) // Forma corta de .map(dto -> ResponseEntity.ok(dto))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}