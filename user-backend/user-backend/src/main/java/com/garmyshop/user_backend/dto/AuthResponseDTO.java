package com.garmyshop.user_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
public class AuthResponseDTO {
    private String accessToken;
    private String tokenType = "Bearer";
    private Integer id;
    private String username;
    private String email;
    private List<String> roles;

    public AuthResponseDTO(String accessToken, Integer id, String username, String email) {
        this.accessToken = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
    }
}