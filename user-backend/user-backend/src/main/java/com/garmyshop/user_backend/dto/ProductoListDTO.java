package com.garmyshop.user_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoListDTO {
    private Integer id;
    private String nombre;
    private String slug;
    private String imagenPrincipalUrl;
    private BigDecimal precio;
    private BigDecimal precioOferta;
    private String marcaNombre;
    private String categoriaNombre;
    private Integer categoriaId;
}