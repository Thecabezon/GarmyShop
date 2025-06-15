package com.garmyshop.user_backend.service;

import com.garmyshop.user_backend.dto.MarcaDTO;
import java.util.List;
import java.util.Optional;

public interface MarcaService {

    /**
     * Obtiene una lista de todas las marcas que están activas.
     *
     * @return una lista de MarcaDTO.
     */
    List<MarcaDTO> obtenerTodasLasMarcasActivas();

    /**
     * Obtiene una marca específica por su slug, solo si está activa.
     * (Opcional por ahora, pero podría ser útil si las marcas tuvieran páginas dedicadas)
     *
     * @param slug el slug de la marca a buscar.
     * @return un Optional conteniendo el MarcaDTO si se encuentra y está activa, o un Optional vacío si no.
     */
    Optional<MarcaDTO> obtenerMarcaActivaPorSlug(String slug);

     /**
     * Obtiene una marca específica por su ID.
     * (Opcional por ahora, podría ser útil internamente)
     *
     * @param id el ID de la marca a buscar.
     * @return un Optional conteniendo el MarcaDTO si se encuentra, o un Optional vacío si no.
     */
    Optional<MarcaDTO> obtenerMarcaPorId(Integer id);
}