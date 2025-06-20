package com.garmyshop.user_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import com.garmyshop.user_backend.model.enums.MetodoPago;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearOrdenRequestDTO {

    // ID de la dirección de envío seleccionada por el usuario
    // (asumimos que el frontend ya obtuvo las direcciones del usuario y el usuario seleccionó una)
    private Integer direccionEnvioId;

    // Método de pago elegido por el usuario (ej. "TARJETA_CREDITO", "MERCADO_PAGO", "TRANSFERENCIA")
    // Podría ser un String o, idealmente, un Enum si los métodos son fijos.
    private MetodoPago metodoPago;

    // Lista de ítems que el usuario quiere comprar (el "carrito")
    private List<ItemOrdenRequestDTO> items;

    // Podrías añadir otros campos si son necesarios, como notas del cliente,
    // información de un cupón de descuento, etc.
}