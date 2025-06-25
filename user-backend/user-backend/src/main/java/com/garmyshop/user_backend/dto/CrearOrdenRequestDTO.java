package com.garmyshop.user_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import com.garmyshop.user_backend.model.enums.MetodoPago;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearOrdenRequestDTO {

    private Integer direccionEnvioId;

    private MetodoPago metodoPago;

    private List<ItemOrdenRequestDTO> items;

}