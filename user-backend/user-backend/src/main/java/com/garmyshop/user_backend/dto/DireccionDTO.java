package com.garmyshop.user_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DireccionDTO {
    private Integer id;
    private String nombre;
    private String apellido;
    private String departamento;
    private String provincia;
    private String distrito;
    private String calle;
    private String codigoPostal;
    private String referencia;
    private String telefono;
}