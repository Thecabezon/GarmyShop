package com.garmyshop.user_backend.controller;

import com.garmyshop.user_backend.dto.ColorDTO;
import com.garmyshop.user_backend.service.ColorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/colores") // Cambiado a "colores" para pluralizar
public class ColorController {

    private final ColorService colorService;

    public ColorController(ColorService colorService) {
        this.colorService = colorService;
    }

    @GetMapping
    public ResponseEntity<List<ColorDTO>> obtenerTodosLosColores() {
        List<ColorDTO> colores = colorService.obtenerTodosLosColores();
        if (colores.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(colores);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ColorDTO> obtenerColorPorId(@PathVariable Integer id) {
        return colorService.obtenerColorPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}