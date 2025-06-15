package com.garmyshop.user_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CombinacionProductoDTO {
    private Integer id; // ID de la combinación
    private TallaDTO talla;
    private ColorDTO color;
    private Integer stock;
    private String sku; // SKU de esta combinación específica
}