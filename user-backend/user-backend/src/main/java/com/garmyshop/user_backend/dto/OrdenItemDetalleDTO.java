package com.garmyshop.user_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdenItemDetalleDTO {
    private Integer id;
    private Integer productoId;
    private String productoNombre;
    private String productoImagenUrl;
    private String tallaNombre;
    private String colorNombre;
    private String skuCombinacion;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
}