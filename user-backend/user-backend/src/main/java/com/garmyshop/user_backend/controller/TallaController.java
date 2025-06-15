package com.garmyshop.user_backend.controller;

import com.garmyshop.user_backend.dto.TallaDTO;
import com.garmyshop.user_backend.service.TallaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tallas") // Pluralizado
public class TallaController {

    private final TallaService tallaService;

    public TallaController(TallaService tallaService) {
        this.tallaService = tallaService;
    }

    @GetMapping
    public ResponseEntity<List<TallaDTO>> obtenerTodasLasTallas() {
        List<TallaDTO> tallas = tallaService.obtenerTodasLasTallas();
        if (tallas.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(tallas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TallaDTO> obtenerTallaPorId(@PathVariable Integer id) {
        return tallaService.obtenerTallaPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}