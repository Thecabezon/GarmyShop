package com.garmyshop.user_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
// import lombok.AllArgsConstructor; // El constructor se definirá manualmente

@Data
@NoArgsConstructor
public class AuthResponseDTO {
    private String accessToken;
    private String tokenType = "Bearer"; // Tipo de token estándar
    private Integer id;
    private String username;
    private String email;
    private List<String> roles; // Si manejamos roles más adelante

    public AuthResponseDTO(String accessToken, Integer id, String username, String email /*, List<String> roles */) {
        this.accessToken = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        // this.roles = roles;
    }
}