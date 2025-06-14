package com.garmyshop.user_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp; 
import org.hibernate.annotations.UpdateTimestamp;   

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
    private Integer id; 

    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "orden_id", nullable = false)
    private Orden orden;

    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "combinacion_id", nullable = false)
    private CombinacionProducto combinacion;

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad = 1; 

    @Column(name = "precio_unitario", precision = 10, scale = 2, nullable = false)
    private BigDecimal precioUnitario;

    @Column(name = "subtotal", precision = 10, scale = 2, nullable = false)
    private BigDecimal subtotal; 

    @CreationTimestamp 
    @Column(name = "creado", nullable = false, updatable = false) 
    private LocalDateTime creado;

    @UpdateTimestamp 
    @Column(name = "actualizado", nullable = false) 
    private LocalDateTime actualizado;
}