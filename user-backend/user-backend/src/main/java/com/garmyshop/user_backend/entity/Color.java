package com.garmyshop.user_backend.entity;


import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "color")
@Getter
@Setter
@NoArgsConstructor
public class Color {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 30, nullable = false)
    private String nombre;

    @Column(length = 7)
    private String codigoHex;
}
