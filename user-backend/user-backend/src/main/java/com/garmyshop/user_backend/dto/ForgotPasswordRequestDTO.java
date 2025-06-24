package com.garmyshop.user_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor; // Opcional si solo necesitas NoArgsConstructor y setters

// Podrías añadir anotaciones de validación de Jakarta Bean Validation aquí
// import jakarta.validation.constraints.Email;
// import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor // Añadido por si quieres construirlo con todos los args, aunque para requests solo se necesitan setters o que Jackson lo construya
public class ForgotPasswordRequestDTO {

    // @NotBlank(message = "El email no puede estar vacío")
    // @Email(message = "Debe ser una dirección de email válida")
    private String email;
}