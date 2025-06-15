package com.garmyshop.user_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarcaDTO {
    private Integer id;
    private String nombre;
    private String slug;
    private String imagen;
}