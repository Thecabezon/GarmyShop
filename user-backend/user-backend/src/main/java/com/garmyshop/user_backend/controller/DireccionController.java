package com.garmyshop.user_backend.controller;

import com.garmyshop.user_backend.dto.DireccionDTO;
import com.garmyshop.user_backend.service.DireccionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/direcciones")
public class DireccionController {

    private final DireccionService direccionService;

    public DireccionController(DireccionService direccionService) {
        this.direccionService = direccionService;
    }

    @PostMapping
    public ResponseEntity<DireccionDTO> crearDireccion(@RequestBody DireccionDTO direccionDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        DireccionDTO direccionCreada = direccionService.crearDireccion(direccionDTO, currentUsername);
        return new ResponseEntity<>(direccionCreada, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<DireccionDTO>> obtenerMisDirecciones() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        List<DireccionDTO> direcciones = direccionService.obtenerDireccionesPorUsuario(currentUsername);
        return ResponseEntity.ok(direcciones);
    }
}