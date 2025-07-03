package com.garmyshop.user_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ContactoRequestDTO {
    private String nombre;
    private String email;
    private String asunto;
    private String mensaje;
}