package com.garmyshop.user_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdenItemDetalleDTO {
    private Integer id; // ID del OrdenItem
    // Información del producto/combinación comprada
    private Integer productoId;
    private String productoNombre;
    private String productoImagenUrl; // Podríamos obtener la imagen principal del producto
    private String tallaNombre;
    private String colorNombre;
    private String skuCombinacion; // SKU de la CombinacionProducto comprada
    // Detalles del item en la orden
    private Integer cantidad;
    private BigDecimal precioUnitario; // Precio al momento de la compra
    private BigDecimal subtotal;
}