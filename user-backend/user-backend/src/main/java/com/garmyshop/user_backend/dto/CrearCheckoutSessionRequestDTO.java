package com.garmyshop.user_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearCheckoutSessionRequestDTO {
    private List<ItemCheckoutDTO> items;
    private String successUrl;
    private String cancelUrl;
    private Integer ordenIdLocal;
    private String emailCliente;
}