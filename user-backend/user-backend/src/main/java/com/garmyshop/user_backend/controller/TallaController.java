package com.garmyshop.user_backend.controller;

import com.garmyshop.user_backend.entity.Talla;
import com.garmyshop.user_backend.repository.TallaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;

import java.util.*;



@RestController
@RequestMapping("/talla")
public class TallaController {

    @Autowired
    private TallaRepository tallaRepository;

    @GetMapping
    public List<Talla> getAllTallas() {
        return tallaRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Talla> getTallaById(@PathVariable Long id) {
        return tallaRepository.findById(id);
    }

    @PostMapping
    public ResponseEntity<Talla> createTalla(@RequestBody Talla talla) {
        Talla nuevaTalla = tallaRepository.save(talla);
        return new ResponseEntity<>(nuevaTalla, HttpStatus.CREATED);
    }


}
