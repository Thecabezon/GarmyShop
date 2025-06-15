package com.garmyshop.user_backend.service;

import com.garmyshop.user_backend.dto.ColorDTO;
import java.util.List;
import java.util.Optional;

public interface ColorService {

    /**
     * Obtiene una lista de todos los colores disponibles en el sistema.
     *
     * @return una lista de ColorDTO.
     */
    List<ColorDTO> obtenerTodosLosColores();

    /**
     * Obtiene un color específico por su ID.
     * (Opcional por ahora, podría ser útil internamente o para una gestión más detallada)
     *
     * @param id el ID del color a buscar.
     * @return un Optional conteniendo el ColorDTO si se encuentra, o un Optional vacío si no.
     */
    Optional<ColorDTO> obtenerColorPorId(Integer id);
}