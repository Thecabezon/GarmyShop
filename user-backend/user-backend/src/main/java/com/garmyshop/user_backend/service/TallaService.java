package com.garmyshop.user_backend.service;

import com.garmyshop.user_backend.dto.TallaDTO;
import java.util.List;
import java.util.Optional;

public interface TallaService {

    /**
     * Obtiene una lista de todas las tallas disponibles en el sistema.
     * @return
     */
    List<TallaDTO> obtenerTodasLasTallas();

    /**
     * Obtiene una talla específica por su ID.
     * @param id
     * @return
     */
    Optional<TallaDTO> obtenerTallaPorId(Integer id);
}