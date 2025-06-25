package com.garmyshop.user_backend.service;

import com.garmyshop.user_backend.dto.CategoriaDTO;
import java.util.List;
import java.util.Optional;

public interface CategoriaService {

    /**
     * Obtiene una lista de todas las categorías que están activas.
     * @return
     */
    List<CategoriaDTO> obtenerTodasLasCategoriasActivas();

    /**
     * Obtiene una categoría específica por su slug, solo si está activa.
     * @param slug
     * @return
     */
    Optional<CategoriaDTO> obtenerCategoriaActivaPorSlug(String slug);

    /**
     * Obtiene una categoría específica por su ID.
     * @param id
     * @return
     */
    Optional<CategoriaDTO> obtenerCategoriaPorId(Integer id);

}