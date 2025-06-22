package com.garmyshop.user_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
// import java.math.BigDecimal; // Para el precio unitario

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearCheckoutSessionRequestDTO {
    private List<ItemCheckoutDTO> items; // Lista de ítems para el checkout
    private String successUrl; // URL a la que Stripe redirigirá en caso de pago exitoso
    private String cancelUrl;  // URL a la que Stripe redirigirá en caso de cancelación
    private Integer ordenIdLocal; // El ID de la orden en tu sistema (para asociarlo)
    private String emailCliente; // Email del cliente, útil para Stripe
    // Podrías añadir más info como customerId de Stripe si ya lo tienes, etc.
}