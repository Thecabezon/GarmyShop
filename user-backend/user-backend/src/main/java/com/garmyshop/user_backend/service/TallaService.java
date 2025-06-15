package com.garmyshop.user_backend.service;

import com.garmyshop.user_backend.dto.TallaDTO;
import java.util.List;
import java.util.Optional;

public interface TallaService {

    /**
     * Obtiene una lista de todas las tallas disponibles en el sistema.
     *
     * @return una lista de TallaDTO.
     */
    List<TallaDTO> obtenerTodasLasTallas();

    /**
     * Obtiene una talla específica por su ID.
     * (Opcional por ahora)
     *
     * @param id el ID de la talla a buscar.
     * @return un Optional conteniendo el TallaDTO si se encuentra, o un Optional vacío si no.
     */
    Optional<TallaDTO> obtenerTallaPorId(Integer id);
}