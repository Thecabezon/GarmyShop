package com.garmyshop.user_backend.controller;

import com.garmyshop.user_backend.dto.ProductoDetailDTO;
import com.garmyshop.user_backend.dto.ProductoListDTO;
import com.garmyshop.user_backend.service.ProductoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault; // Para valores por defecto de Pageable
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// import java.util.Optional; // No es necesario si el servicio ya devuelve Optional y lo manejamos

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    /**
     * Endpoint para obtener todos los productos activos con paginación.
     * GET /api/productos?page=0&size=10&sort=nombre,asc
     *
     * @param pageable Objeto Pageable inyectado por Spring.
     *                 Se pueden pasar parámetros como page, size, sort en la URL.
     *                 @PageableDefault puede usarse para establecer valores por defecto.
     * @return ResponseEntity con una Page de ProductoListDTO.
     */
    @GetMapping
    public ResponseEntity<Page<ProductoListDTO>> obtenerTodosLosProductosActivos(
            @PageableDefault(size = 12, sort = "nombre") Pageable pageable) {
        Page<ProductoListDTO> productosPage = productoService.obtenerTodosLosProductosActivos(pageable);
        return ResponseEntity.ok(productosPage);
    }

    /**
     * Endpoint para obtener un producto activo por su slug.
     * GET /api/productos/slug/{slugDelProducto}
     *
     * @param slug El slug del producto.
     * @return ResponseEntity con ProductoDetailDTO si se encuentra, o 404 Not Found.
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ProductoDetailDTO> obtenerProductoActivoPorSlug(@PathVariable String slug) {
        return productoService.obtenerProductoActivoPorSlug(slug)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Endpoint para obtener un producto activo por su ID.
     * GET /api/productos/{idDelProducto}
     *
     * @param id El ID del producto.
     * @return ResponseEntity con ProductoDetailDTO si se encuentra, o 404 Not Found.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductoDetailDTO> obtenerProductoActivoPorId(@PathVariable Integer id) {
        return productoService.obtenerProductoActivoPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Endpoint para obtener productos activos de una categoría específica con paginación.
     * GET /api/productos/categoria/{categoriaId}?page=0&size=10
     *
     * @param categoriaId El ID de la categoría.
     * @param pageable    Información de paginación.
     * @return ResponseEntity con una Page de ProductoListDTO.
     */
    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<Page<ProductoListDTO>> obtenerProductosActivosPorCategoria(
            @PathVariable Integer categoriaId,
            @PageableDefault(size = 12, sort = "nombre") Pageable pageable) {
        Page<ProductoListDTO> productosPage = productoService.obtenerProductosActivosPorCategoria(categoriaId, pageable);
        return ResponseEntity.ok(productosPage);
    }

    /**
     * Endpoint para obtener productos activos de una marca específica con paginación.
     * GET /api/productos/marca/{marcaId}?page=0&size=10
     *
     * @param marcaId El ID de la marca.
     * @param pageable Información de paginación.
     * @return ResponseEntity con una Page de ProductoListDTO.
     */
    @GetMapping("/marca/{marcaId}")
    public ResponseEntity<Page<ProductoListDTO>> obtenerProductosActivosPorMarca(
            @PathVariable Integer marcaId,
            @PageableDefault(size = 12, sort = "nombre") Pageable pageable) {
        Page<ProductoListDTO> productosPage = productoService.obtenerProductosActivosPorMarca(marcaId, pageable);
        return ResponseEntity.ok(productosPage);
    }


    /**
     * Endpoint para la búsqueda de productos.
     * GET /api/productos/buscar?termino=polo%20rojo&page=0&size=10
     *
     * @param termino  El término de búsqueda ingresado por el usuario.
     * @param pageable Información de paginación.
     * @return ResponseEntity con una Page de ProductoListDTO.
     */
    @GetMapping("/buscar")
    public ResponseEntity<Page<ProductoListDTO>> buscarProductos(
            @RequestParam(name = "termino") String termino, // El término se pasa como ?termino=valor
            @PageableDefault(size = 12) Pageable pageable) { // No ordenamos por defecto en búsqueda, dejamos que la relevancia lo haga si la BD lo soporta
        Page<ProductoListDTO> productosPage = productoService.buscarProductos(termino, pageable);
        return ResponseEntity.ok(productosPage);
    }
}