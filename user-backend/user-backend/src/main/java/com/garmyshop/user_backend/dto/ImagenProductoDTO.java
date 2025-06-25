package com.garmyshop.user_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImagenProductoDTO {
    private Integer id;
    private String imagen;
    private Boolean esPrincipal;
    private Integer orden;
}