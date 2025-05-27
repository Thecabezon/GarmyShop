package com.garmyshop.user_backend.entity;

import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;

@Entity
@Table(name = "direccion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Direccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    // Relación con auth_user
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private AuthUser usuario;

    @Column(name = "nombre", length = 100, nullable = false)
    private String nombre;

    @Column(name = "apellido", length = 100, nullable = false)
    private String apellido;

    @Column(name = "departamento", length = 100, nullable = false)
    private String departamento;

    @Column(name = "provincia", length = 100, nullable = false)
    private String provincia;

    @Column(name = "distrito", length = 100, nullable = false)
    private String distrito;

    @Column(name = "calle", length = 255, nullable = false)
    private String calle;

    @Column(name = "codigo_postal", length = 20, nullable = false)
    private String codigoPostal;

    @Column(name = "referencia", length = 255)
    private String referencia;

    @Column(name = "telefono", length = 20, nullable = false)
    private String telefono;

    @Column(name = "creado")
    private LocalDateTime creado;

    @Column(name = "actualizado")
    private LocalDateTime actualizado;
}