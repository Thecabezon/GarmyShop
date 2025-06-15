package com.garmyshop.user_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

// Podríamos añadir anotaciones de validación de Jakarta Bean Validation aquí
// (ej. @NotBlank, @Email, @Size) para validar los datos de entrada.
// Por ahora, lo mantenemos simple.
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroRequestDTO {
    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    // No incluimos isSuperuser, isStaff, isActive, dateJoined ya que estos
    // se manejan internamente o por defecto.
}