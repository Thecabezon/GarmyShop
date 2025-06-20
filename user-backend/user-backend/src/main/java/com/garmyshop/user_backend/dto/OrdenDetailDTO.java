package com.garmyshop.user_backend.dto;

import com.garmyshop.user_backend.model.enums.EstadoOrden;
import com.garmyshop.user_backend.model.enums.EstadoPagoOrden; // Asumiendo que tienes este enum
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdenDetailDTO {
    private Integer id;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private BigDecimal total;
    private String metodoPago;
    private EstadoPagoOrden estadoPago;
    private EstadoOrden estado;
    private Integer cantidadTotalItems; // Suma de las cantidades de todos los OrdenItem

    // Información del usuario (podría ser opcional si el contexto ya lo da)
    // private String nombreUsuario;

    // Dirección de envío
    private DireccionDTO direccionEnvio; // Necesitarás un DireccionDTO

    private List<OrdenItemDetalleDTO> items;
}