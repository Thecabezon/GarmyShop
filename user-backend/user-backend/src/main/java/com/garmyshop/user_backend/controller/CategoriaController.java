package com.garmyshop.user_backend.controller;

import com.garmyshop.user_backend.entity.Categoria;
import com.garmyshop.user_backend.repository.CategoriaRepository;
import com.garmyshop.user_backend.entity.Producto;
import com.garmyshop.user_backend.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @GetMapping
    public List<Categoria> getAllCategorias() {
        return categoriaRepository.findAll();
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Categoria> getCategoriaBySlug(@PathVariable String slug) {
        Optional<Categoria> categoriaOpt = categoriaRepository.findBySlug(slug);
        if (categoriaOpt.isPresent()) {
            return ResponseEntity.ok(categoriaOpt.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{slug}/productos")
    public ResponseEntity<List<Producto>> getProductosByCategoria(@PathVariable String slug) {
        Optional<Categoria> categoriaOpt = categoriaRepository.findBySlug(slug);
        if (categoriaOpt.isPresent()) {
            List<Producto> productos = productoRepository.findByCategoria(categoriaOpt.get());
            return ResponseEntity.ok(productos);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Categoria> createCategoria(@RequestBody Categoria categoria) {
        Categoria nuevaCategoria = categoriaRepository.save(categoria);
        return new ResponseEntity<>(nuevaCategoria, HttpStatus.CREATED);
    }

}
