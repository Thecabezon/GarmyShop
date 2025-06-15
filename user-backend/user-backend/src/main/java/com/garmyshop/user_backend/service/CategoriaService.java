package com.garmyshop.user_backend.service;

import com.garmyshop.user_backend.dto.CategoriaDTO; // Importa tu DTO
import java.util.List;
import java.util.Optional;

public interface CategoriaService {

    /**
     * Obtiene una lista de todas las categorías que están activas.
     * Ideal para mostrar al usuario las categorías disponibles para navegar.
     *
     * @return una lista de CategoriaDTO.
     */
    List<CategoriaDTO> obtenerTodasLasCategoriasActivas();

    /**
     * Obtiene una categoría específica por su slug, solo si está activa.
     * Útil cuando el frontend navega a una categoría usando su slug en la URL.
     *
     * @param slug el slug de la categoría a buscar.
     * @return un Optional conteniendo el CategoriaDTO si se encuentra y está activa, o un Optional vacío si no.
     */
    Optional<CategoriaDTO> obtenerCategoriaActivaPorSlug(String slug);

    /**
     * Obtiene una categoría específica por su ID.
     * Este método podría devolver la categoría sin importar si está activa o no,
     * o también podrías tener una versión que solo devuelva activas.
     * Por ahora, la dejaremos que devuelva la categoría si existe, independientemente de su estado 'activo'.
     * Podría ser más útil para lógicas internas o si se requiere acceso a categorías inactivas por alguna razón.
     *
     * @param id el ID de la categoría a buscar.
     * @return un Optional conteniendo el CategoriaDTO si se encuentra, o un Optional vacío si no.
     */
    Optional<CategoriaDTO> obtenerCategoriaPorId(Integer id);

    // Más adelante podríamos añadir métodos para el backend de administración (si este backend también lo gestionara):
    // CategoriaDTO crearCategoria(CategoriaCreacionRequestDTO categoriaRequest);
    // CategoriaDTO actualizarCategoria(Integer id, CategoriaActualizacionRequestDTO categoriaRequest);
    // void eliminarCategoria(Integer id);
    // Pero por ahora nos enfocamos en los requisitos de "solo lectura/GET" para el backend de usuario.
}