package com.garmyshop.user_backend.service;

import com.garmyshop.user_backend.dto.ProductoDetailDTO;
import com.garmyshop.user_backend.dto.ProductoListDTO;
import org.springframework.data.domain.Page; // Para paginación
import org.springframework.data.domain.Pageable; // Para paginación
import java.util.Optional;

public interface ProductoService {

    /**
     * Obtiene una página de productos activos para ser mostrados en una lista.
     * Utiliza el ProductoListDTO para enviar solo la información necesaria.
     *
     * @param pageable objeto Pageable que contiene la información de paginación (número de página, tamaño, ordenamiento).
     * @return un Page<ProductoListDTO> con los productos activos.
     */
    Page<ProductoListDTO> obtenerTodosLosProductosActivos(Pageable pageable);

    /**
     * Obtiene los detalles completos de un producto activo específico por su slug.
     * Utiliza ProductoDetailDTO para incluir imágenes, combinaciones, etc.
     *
     * @param slug el slug del producto a buscar.
     * @return un Optional conteniendo el ProductoDetailDTO si se encuentra y está activo, o un Optional vacío si no.
     */
    Optional<ProductoDetailDTO> obtenerProductoActivoPorSlug(String slug);

    /**
     * Obtiene los detalles completos de un producto específico por su ID.
     * Podría o no filtrar por activo, dependiendo de la necesidad. Para el usuario final, usualmente se filtra.
     * Por ahora, asumiremos que busca un producto activo por ID.
     *
     * @param id el ID del producto a buscar.
     * @return un Optional conteniendo el ProductoDetailDTO si se encuentra y está activo, o un Optional vacío si no.
     */
    Optional<ProductoDetailDTO> obtenerProductoActivoPorId(Integer id);

    /**
     * Obtiene una página de productos activos filtrados por el ID de una categoría.
     *
     * @param categoriaId el ID de la categoría por la cual filtrar.
     * @param pageable objeto Pageable para la paginación.
     * @return un Page<ProductoListDTO> con los productos activos de la categoría especificada.
     */
    Page<ProductoListDTO> obtenerProductosActivosPorCategoria(Integer categoriaId, Pageable pageable);

    /**
     * Obtiene una página de productos activos filtrados por el ID de una marca.
     *
     * @param marcaId el ID de la marca por la cual filtrar.
     * @param pageable objeto Pageable para la paginación.
     * @return un Page<ProductoListDTO> con los productos activos de la marca especificada.
     */
    Page<ProductoListDTO> obtenerProductosActivosPorMarca(Integer marcaId, Pageable pageable);


    /**
     * Realiza una búsqueda de productos activos basada en un término de búsqueda.
     * El término podría buscarse en el nombre, descripción, y opcionalmente por color.
     * (Esta es la funcionalidad que discutimos para la barra de búsqueda "polo rojo").
     *
     * @param terminoBusqueda el string ingresado por el usuario.
     * @param pageable objeto Pageable para la paginación.
     * @return un Page<ProductoListDTO> con los productos que coinciden con el término de búsqueda.
     */
    Page<ProductoListDTO> buscarProductos(String terminoBusqueda, Pageable pageable);

    // Podríamos añadir más métodos de búsqueda/filtrado en el futuro, como:
    // - obtenerProductosDestacados(Pageable pageable);
    // - obtenerProductosEnOferta(Pageable pageable);
    // - obtenerProductosConFiltrosCombinados(FiltrosDTO filtros, Pageable pageable);
}