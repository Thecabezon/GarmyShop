package com.garmyshop.user_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemOrdenRequestDTO {
    private Integer combinacionProductoId;
    private Integer cantidad;
}