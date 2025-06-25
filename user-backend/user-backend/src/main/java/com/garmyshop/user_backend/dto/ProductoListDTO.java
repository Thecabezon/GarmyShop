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
    private String imagenPrincipalUrl; // Solo la URL de la imagen principal
    private BigDecimal precio;
    private BigDecimal precioOferta; // Podría ser null
    private String marcaNombre; // Nombre de la marca para mostrar
    private String categoriaNombre; // Nombre de la categoría para mostrar
}