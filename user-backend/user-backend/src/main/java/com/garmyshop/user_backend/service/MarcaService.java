package com.garmyshop.user_backend.service;

import com.garmyshop.user_backend.dto.MarcaDTO;
import java.util.List;
import java.util.Optional;

public interface MarcaService {

    /**
     * @return
     */
    List<MarcaDTO> obtenerTodasLasMarcasActivas();

    /**
     * @param slug
     * @return
     */
    Optional<MarcaDTO> obtenerMarcaActivaPorSlug(String slug);

     /**
     * Obtiene una marca específica por su ID.
     * @param id
     * @return
     */
    Optional<MarcaDTO> obtenerMarcaPorId(Integer id);
}