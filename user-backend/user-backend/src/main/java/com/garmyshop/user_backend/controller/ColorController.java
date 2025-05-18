package com.garmyshop.user_backend.controller;

import com.garmyshop.user_backend.entity.Color;
import com.garmyshop.user_backend.repository.ColorRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;

import java.util.*;

@RestController
@RequestMapping("/colores")
public class ColorController {

    @Autowired
    private ColorRepository colorRepository;

    @GetMapping
    public List<Color> getAllColors() {
        return colorRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Color> getColorById(@PathVariable Long id) {
        return colorRepository.findById(id);
    }

    @PostMapping
    public ResponseEntity<Color> createColor(@RequestBody Color color) {
        Color newColor = colorRepository.save(color);
        return new ResponseEntity<>(newColor, HttpStatus.CREATED);
    }

}
