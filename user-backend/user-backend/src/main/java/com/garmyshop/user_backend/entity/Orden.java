package com.garmyshop.user_backend.entity;

import com.garmyshop.user_backend.model.enums.EstadoOrden;
import com.garmyshop.user_backend.model.enums.EstadoPagoOrden;
import com.garmyshop.user_backend.model.enums.MetodoPago; // Asegúrate que este también tenga su converter y lógica similar
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private AuthUser usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "direccion_envio_id", nullable = false)
    private Direccion direccionEnvio;

    @Column(name = "total", precision = 10, scale = 2, nullable = false)
    private BigDecimal total;

    // ASUMIENDO que tienes un MetodoPagoConverter con @Converter(autoApply = true)
    // y que MetodoPago tiene el método getValorEnDb()
    @Column(name = "metodo_pago", length = 50, nullable = false)
    // @Enumerated(EnumType.STRING) // <--- Eliminar esta línea
    private MetodoPago metodoPago;

    // ASUMIENDO que tienes un EstadoPagoOrdenConverter con @Converter(autoApply = true)
    // y que EstadoPagoOrden tiene el método getValorEnDb()
    @Column(name = "estado_pago", length = 30, nullable = false)
    // @Enumerated(EnumType.STRING) // <--- Eliminar esta línea
    private EstadoPagoOrden estadoPago = EstadoPagoOrden.PENDIENTE;

    // ASUMIENDO que tienes un EstadoOrdenConverter con @Converter(autoApply = true)
    // y que EstadoOrden tiene el método getValorEnDb()
    @Column(name = "estado", length = 20, nullable = false)
    // @Enumerated(EnumType.STRING) // <--- Eliminar esta línea
    private EstadoOrden estado = EstadoOrden.PENDIENTE;

    @Column(name = "cantidad_compra", nullable = false)
    private Integer cantidadCompra = 0;

    @CreationTimestamp
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    @Column(name = "fecha_actualizacion", nullable = false)
    private LocalDateTime fechaActualizacion;

    @OneToMany(mappedBy = "orden", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<OrdenItem> items = new ArrayList<>();
}