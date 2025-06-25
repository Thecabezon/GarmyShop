package com.garmyshop.user_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemCheckoutDTO {
    private String nombreProducto;
    private String descripcionProducto; 
    private String imagenProductoUrl; 
    private BigDecimal precioUnitario;
    private Integer cantidad;
    private String moneda;
}