package com.garmyshop.user_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemOrdenRequestDTO {
    // ID de la CombinacionProducto (SKU específico que el usuario quiere comprar)
    private Integer combinacionProductoId;

    // Cantidad de este ítem/combinación que el usuario quiere comprar
    private Integer cantidad;
}