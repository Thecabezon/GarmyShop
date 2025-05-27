package com.garmyshop.user_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orden_item")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrdenItem {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "orden_id", nullable = false)
    private Orden orden;
    
    @ManyToOne
    @JoinColumn(name = "combinacion_id", nullable = false)
    private CombinacionProducto combinacion;
    
    @Column(name = "cantidad", nullable = false)
    private Integer cantidad = 1;
    
    @Column(name = "precio_unitario", precision = 10, scale = 2, nullable = false)
    private BigDecimal precioUnitario;
    
    @Column(name = "subtotal", precision = 10, scale = 2, nullable = false)
    private BigDecimal subtotal;
    
    @Column(name = "creado")
    private LocalDateTime creado;
    
    @Column(name = "actualizado")
    private LocalDateTime actualizado;

}
