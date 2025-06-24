package com.garmyshop.user_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor; // Opcional

// Podrías añadir anotaciones de validación
// import jakarta.validation.constraints.NotBlank;
// import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor // Añadido por si quieres construirlo con todos los args
public class ResetPasswordRequestDTO {

    // @NotBlank(message = "El token no puede estar vacío")
    private String token;

    // @NotBlank(message = "La nueva contraseña no puede estar vacía")
    // @Size(min = 8, message = "La nueva contraseña debe tener al menos 8 caracteres")
    // Podrías añadir más validaciones de complejidad de contraseña aquí
    private String nuevaPassword;

    // Opcionalmente, un campo para confirmar la nueva contraseña,
    // cuya validación se haría en el servicio.
    // private String confirmarNuevaPassword;
}