package com.garmyshop.user_backend.controller;

import com.garmyshop.user_backend.dto.ProductoDetailDTO;
import com.garmyshop.user_backend.dto.ProductoListDTO;
import com.garmyshop.user_backend.service.ProductoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;


@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    /**
     * Endpoint para obtener todos los productos activos con paginación.
     * @param pageable
     * @return
     */
    @GetMapping
    public ResponseEntity<Page<ProductoListDTO>> obtenerTodosLosProductosActivos(
            @PageableDefault(size = 12, sort = "nombre") Pageable pageable) {
        Page<ProductoListDTO> productosPage = productoService.obtenerTodosLosProductosActivos(pageable);
        return ResponseEntity.ok(productosPage);
    }

    /**
     * Endpoint para obtener un producto activo por su slug.
     * @param slug
     * @return
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ProductoDetailDTO> obtenerProductoActivoPorSlug(@PathVariable String slug) {
        return productoService.obtenerProductoActivoPorSlug(slug)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Endpoint para obtener un producto activo por su ID.
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductoDetailDTO> obtenerProductoActivoPorId(@PathVariable Integer id) {
        return productoService.obtenerProductoActivoPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Endpoint para obtener productos activos de una categoría específica con paginación.
     * @param categoriaId
     * @param pageable
     * @return
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
     * @param marcaId
     * @param pageable
     * @return
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
     * @param termino
     * @param pageable
     * @return
     */
    @GetMapping("/buscar")
    public ResponseEntity<Page<ProductoListDTO>> buscarProductos(
            @RequestParam(name = "termino") String termino,
            @PageableDefault(size = 12) Pageable pageable) {
        Page<ProductoListDTO> productosPage = productoService.buscarProductos(termino, pageable);
        return ResponseEntity.ok(productosPage);
    }




    /**
     * Endpoint para obtener los productos destacados.
     * @return
     */
    @GetMapping("/destacados")
    public ResponseEntity<List<ProductoListDTO>> obtenerProductosDestacados() {
        List<ProductoListDTO> productosDestacados = productoService.obtenerProductosDestacados();
        if (productosDestacados.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(productosDestacados);
    }
}