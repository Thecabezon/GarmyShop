package com.garmyshop.user_backend.controller;

import com.garmyshop.user_backend.dto.CategoriaDTO;
import com.garmyshop.user_backend.service.CategoriaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController 
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    /**
     * Endpoint para obtener todas las categorías activas.
     * @return       
     */
    @GetMapping
    public ResponseEntity<List<CategoriaDTO>> obtenerTodasLasCategoriasActivas() {
        List<CategoriaDTO> categorias = categoriaService.obtenerTodasLasCategoriasActivas();
        if (categorias.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(categorias); 
    }

    /**
     * Endpoint para obtener una categoría activa por su slug.
     * @param slug
     * @return       
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<CategoriaDTO> obtenerCategoriaActivaPorSlug(@PathVariable String slug) {
        return categoriaService.obtenerCategoriaActivaPorSlug(slug)
                .map(categoriaDTO -> ResponseEntity.ok(categoriaDTO))
                .orElseGet(() -> ResponseEntity.notFound().build());   
    }

    /**
     * Endpoint para obtener una categoría por su ID.
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDTO> obtenerCategoriaPorId(@PathVariable Integer id) {
        return categoriaService.obtenerCategoriaPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}