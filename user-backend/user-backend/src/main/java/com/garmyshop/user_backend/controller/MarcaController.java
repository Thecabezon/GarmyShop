package com.garmyshop.user_backend.controller;

import com.garmyshop.user_backend.entity.Marca;
import com.garmyshop.user_backend.repository.MarcaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/marca")
public class MarcaController {
    
    @Autowired
    private MarcaRepository marcaRepository;
    
    @GetMapping
    public List<Marca> getAllMarcas() {
        return marcaRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Marca> getMarcaById(@PathVariable Long id) {
        return marcaRepository.findById(id);
    }

    @PostMapping
    public ResponseEntity<Marca> createMarca(@RequestBody Marca marca) {
        Marca nuevaMarca = marcaRepository.save(marca);
        return new ResponseEntity<>(nuevaMarca, HttpStatus.CREATED);
    }

}
