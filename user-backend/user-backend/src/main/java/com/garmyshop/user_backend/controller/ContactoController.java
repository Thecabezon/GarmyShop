package com.garmyshop.user_backend.controller;

import com.garmyshop.user_backend.dto.ContactoRequestDTO;
import com.garmyshop.user_backend.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/contacto")
public class ContactoController {

    private final EmailService emailService;

    public ContactoController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<?> recibirMensajeContacto(@RequestBody ContactoRequestDTO contactoRequestDTO) {
        // Validación simple
        if (contactoRequestDTO.getNombre() == null || contactoRequestDTO.getNombre().trim().isEmpty() ||
            contactoRequestDTO.getEmail() == null || contactoRequestDTO.getEmail().trim().isEmpty() ||
            contactoRequestDTO.getMensaje() == null || contactoRequestDTO.getMensaje().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Nombre, email y mensaje son campos requeridos."));
        }

        try {
            emailService.enviarEmailDeContacto(contactoRequestDTO);
            return ResponseEntity.ok(Map.of("message", "Mensaje enviado exitosamente."));
        } catch (Exception e) {
            // Manejo de errores genérico por si algo falla en el envío
            return ResponseEntity.internalServerError().body(Map.of("message", "Error al procesar la solicitud. Por favor, intente más tarde."));
        }
    }
}