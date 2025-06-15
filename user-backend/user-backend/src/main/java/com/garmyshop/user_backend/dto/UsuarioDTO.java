package com.garmyshop.user_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
    private Integer id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDateTime dateJoined;
    private LocalDateTime lastLogin;
    // No incluimos password, isSuperuser, isStaff, isActive (a menos que el frontend necesite isActive)
}