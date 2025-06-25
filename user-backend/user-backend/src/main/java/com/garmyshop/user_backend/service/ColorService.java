package com.garmyshop.user_backend.service;

import com.garmyshop.user_backend.dto.ColorDTO;
import java.util.List;
import java.util.Optional;

public interface ColorService {

    /**
     * Obtiene una lista de todos los colores disponibles en el sistema.
     * @return
     */
    List<ColorDTO> obtenerTodosLosColores();

    /**
     * Obtiene un color específico por su ID.
     * @param id
     * @return
     */
    Optional<ColorDTO> obtenerColorPorId(Integer id);
}