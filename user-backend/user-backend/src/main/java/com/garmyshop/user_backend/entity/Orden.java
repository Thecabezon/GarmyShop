package com.garmyshop.user_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orden")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private AuthUser usuario;
    
    @ManyToOne
    @JoinColumn(name = "direccion_envio_id", nullable = false)
    private Direccion direccionEnvio;
    
    @Column(name = "total", precision = 10, scale = 2, nullable = false)
    private BigDecimal total;
    
    @Column(name = "metodo_pago", length = 50, nullable = false)
    private String metodoPago;
    
    @Column(name = "estado_pago", length = 30, nullable = false)
    private String estadoPago = "pendiente";
    
    @Column(name = "estado", length = 20, nullable = false)
    private String estado = "pendiente";
    
    @Column(name = "cantidad_compra", nullable = false)
    private Integer cantidadCompra = 0;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
    
}
