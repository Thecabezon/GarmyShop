package com.garmyshop.user_backend.controller;

import com.garmyshop.user_backend.dto.MarcaDTO;
import com.garmyshop.user_backend.service.MarcaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/marcas")
public class MarcaController {

    private final MarcaService marcaService;

    public MarcaController(MarcaService marcaService) {
        this.marcaService = marcaService;
    }

    @GetMapping
    public ResponseEntity<List<MarcaDTO>> obtenerTodasLasMarcasActivas() {
        List<MarcaDTO> marcas = marcaService.obtenerTodasLasMarcasActivas();
        if (marcas.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(marcas);
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<MarcaDTO> obtenerMarcaActivaPorSlug(@PathVariable String slug) {
        return marcaService.obtenerMarcaActivaPorSlug(slug)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MarcaDTO> obtenerMarcaPorId(@PathVariable Integer id) {
        return marcaService.obtenerMarcaPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}