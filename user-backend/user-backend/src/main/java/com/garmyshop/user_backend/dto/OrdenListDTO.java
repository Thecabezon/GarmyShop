package com.garmyshop.user_backend.dto;

import com.garmyshop.user_backend.model.enums.EstadoOrden;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdenListDTO {
    private Integer id;
    private LocalDateTime fechaCreacion;
    private BigDecimal total;
    private EstadoOrden estado;
    private Integer cantidadTotalItems;
}