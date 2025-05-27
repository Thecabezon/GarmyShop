package com.garmyshop.user_backend.entity;


import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "color")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Color {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nombre",length = 30, nullable = false)
    private String nombre;

    @Column(name = "codigo_hex",length = 7)
    private String codigoHex;
}
