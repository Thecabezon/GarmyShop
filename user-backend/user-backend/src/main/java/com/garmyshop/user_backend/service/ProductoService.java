package com.garmyshop.user_backend.service;

import com.garmyshop.user_backend.dto.ProductoDetailDTO;
import com.garmyshop.user_backend.dto.ProductoListDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;
import java.util.List;

public interface ProductoService {

    /**
     * Obtiene una página de productos activos para ser mostrados en una lista.
     * @param pageable
     * @return
     */
    Page<ProductoListDTO> obtenerTodosLosProductosActivos(Pageable pageable);

    /**
     * Obtiene los detalles completos de un producto activo específico por su slug.
     * @param slug
     * @return
     */
    Optional<ProductoDetailDTO> obtenerProductoActivoPorSlug(String slug);

    /**
     * Obtiene los detalles completos de un producto específico por su ID.
     * @param id
     * @return
     */
    Optional<ProductoDetailDTO> obtenerProductoActivoPorId(Integer id);

    /**
     * Obtiene una página de productos activos filtrados por el ID de una categoría.
     * @param categoriaId
     * @param pageable
     * @return
     */
    Page<ProductoListDTO> obtenerProductosActivosPorCategoria(Integer categoriaId, Pageable pageable);

    /**
     * Obtiene una página de productos activos filtrados por el ID de una marca.
     * @param marcaId
     * @param pageable
     * @return
     */
    Page<ProductoListDTO> obtenerProductosActivosPorMarca(Integer marcaId, Pageable pageable);


    /**
     * Realiza una búsqueda de productos activos basada en un término de búsqueda.
     * @param terminoBusqueda
     * @param pageable
     * @return
     */
    Page<ProductoListDTO> buscarProductos(String terminoBusqueda, Pageable pageable);

    /**
     * Obtiene una lista de todos los productos destacados activos.
     * @return Lista de DTOs de productos destacados.
     */
    List<ProductoListDTO> obtenerProductosDestacados();

}