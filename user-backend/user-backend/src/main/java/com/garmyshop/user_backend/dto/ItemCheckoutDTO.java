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
    private String descripcionProducto; // Opcional, pero Stripe lo puede mostrar
    private String imagenProductoUrl;   // Opcional, Stripe lo puede mostrar
    private BigDecimal precioUnitario;    // Precio en la unidad mayor (ej. 29.99 para S/29.99)
    private Integer cantidad;
    private String moneda; // ej. "PEN", "USD"
}