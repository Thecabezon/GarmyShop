package com.garmyshop.user_backend.dto;

import com.garmyshop.user_backend.model.enums.EstadoOrden;
import com.garmyshop.user_backend.model.enums.EstadoPagoOrden; // Asumiendo que tienes este enum
import com.garmyshop.user_backend.model.enums.MetodoPago; // Asumiendo que tienes este enum
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
    private MetodoPago metodoPago;
    private EstadoPagoOrden estadoPago;
    private EstadoOrden estado;
    private Integer cantidadTotalItems;

    private DireccionDTO direccionEnvio;

    private List<OrdenItemDetalleDTO> items;
}