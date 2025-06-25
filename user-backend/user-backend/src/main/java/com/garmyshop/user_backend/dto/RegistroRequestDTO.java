package com.garmyshop.user_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroRequestDTO {
    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
}