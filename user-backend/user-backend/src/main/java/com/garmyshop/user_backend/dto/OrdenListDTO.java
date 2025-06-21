package com.garmyshop.user_backend.dto;

import com.garmyshop.user_backend.model.enums.EstadoOrden; // Asumiendo que tienes este enum
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdenListDTO {
    private Integer id; // ID de la Orden
    private LocalDateTime fechaCreacion;
    private BigDecimal total;
    private EstadoOrden estado; // Usando el Enum para el estado
    private Integer cantidadTotalItems; // Suma de las cantidades de todos los OrdenItem
}