package com.garmyshop.user_backend.service;

import com.garmyshop.user_backend.dto.DireccionDTO;
import java.util.List;

public interface DireccionService {

    /**
     * @param direccionDTO
     * @param username
     * @return
     */
    DireccionDTO crearDireccion(DireccionDTO direccionDTO, String username);

    /**
     * @param username
     * @return
     */
    List<DireccionDTO> obtenerDireccionesPorUsuario(String username);
}