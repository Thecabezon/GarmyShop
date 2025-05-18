package com.garmyshop.user_backend.controller;

import com.garmyshop.user_backend.entity.ImagenProducto;
import com.garmyshop.user_backend.repository.ImagenProductoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;


import java.util.*;

@RestController
@RequestMapping("/imagen-producto")
public class ImagenProductoController {

    @Autowired
    private ImagenProductoRepository imagenProductoRepository;
    
    @GetMapping
    public List<ImagenProducto> getAllImagenesProducto() {
        return imagenProductoRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public Optional<ImagenProducto> getImagenProductoById(@PathVariable Long id) {
        return imagenProductoRepository.findById(id);
    }

    @PostMapping
    public ResponseEntity<ImagenProducto> createImagenProducto(@RequestBody ImagenProducto imagenProducto) {
        ImagenProducto nuevaImagenProducto = imagenProductoRepository.save(imagenProducto);
        return new ResponseEntity<>(nuevaImagenProducto, HttpStatus.CREATED);
    }


}
