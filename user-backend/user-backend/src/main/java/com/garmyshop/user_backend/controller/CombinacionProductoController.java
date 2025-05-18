package com.garmyshop.user_backend.controller;


import com.garmyshop.user_backend.entity.CombinacionProducto;
import com.garmyshop.user_backend.repository.CombinacionProductoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;

import java.util.*;

@RestController
@RequestMapping("/combinacion-producto")
public class CombinacionProductoController {

    @Autowired
    private CombinacionProductoRepository combinacionProductoRepository;

    @GetMapping
    public List<CombinacionProducto> getAllCombinacionesProducto() {
        return combinacionProductoRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<CombinacionProducto> getCombinacionProductoById(@PathVariable Long id) {
        return combinacionProductoRepository.findById(id);
    }

    @PostMapping
    public ResponseEntity<CombinacionProducto> createCombinacionProducto(@RequestBody CombinacionProducto combinacionProducto) {
        CombinacionProducto nuevaCombinacion = combinacionProductoRepository.save(combinacionProducto);
        return new ResponseEntity<>(nuevaCombinacion, HttpStatus.CREATED);
    }


}
