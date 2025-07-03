package com.garmyshop.user_backend.service.impl;

import com.garmyshop.user_backend.dto.*;
import com.garmyshop.user_backend.entity.*;
import com.garmyshop.user_backend.repository.*;
import com.garmyshop.user_backend.service.ProductoService;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final MarcaRepository marcaRepository;
    private final ColorRepository colorRepository;


    public ProductoServiceImpl(ProductoRepository productoRepository,
                                CategoriaRepository categoriaRepository,
                                MarcaRepository marcaRepository,
                                ColorRepository colorRepository
                                ) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
        this.marcaRepository = marcaRepository;
        this.colorRepository = colorRepository;
    }

    private ProductoListDTO convertirAProductoListDTO(Producto producto) {
        if (producto == null) return null;

        String imagenPrincipalUrl = producto.getImagenes().stream()
                .filter(ImagenProducto::getEsPrincipal)
                .map(ImagenProducto::getImagen)
                .findFirst()
                .orElse(producto.getImagenes().isEmpty() ? null : producto.getImagenes().get(0).getImagen());

        return new ProductoListDTO(
                producto.getId(),
                producto.getNombre(),
                producto.getSlug(),
                imagenPrincipalUrl,
                producto.getPrecio(),
                producto.getPrecioOferta(),
                producto.getMarca() != null ? producto.getMarca().getNombre() : null,
                producto.getCategoria() != null ? producto.getCategoria().getNombre() : null,
                producto.getCategoria() != null ? producto.getCategoria().getId() : null
        );
    }

    private ProductoDetailDTO convertirAProductoDetailDTO(Producto producto) {
        if (producto == null) return null;

        MarcaDTO marcaDTO = null;
        if (producto.getMarca() != null) {
            Marca marca = producto.getMarca();
            marcaDTO = new MarcaDTO(marca.getId(), marca.getNombre(), marca.getSlug(), marca.getImagen());
        }

        CategoriaDTO categoriaDTO = null;
        if (producto.getCategoria() != null) {
            Categoria categoria = producto.getCategoria();
            categoriaDTO = new CategoriaDTO(categoria.getId(), categoria.getNombre(), categoria.getSlug(), categoria.getImagen());
        }

        List<ImagenProductoDTO> imagenesDTO = producto.getImagenes().stream()
                .map(img -> new ImagenProductoDTO(img.getId(), img.getImagen(), img.getEsPrincipal(), img.getOrden()))
                .collect(Collectors.toList());

        List<CombinacionProductoDTO> combinacionesDTO = producto.getCombinaciones().stream()
                .filter(cp -> cp.getStock() > 0)
                .map(cp -> new CombinacionProductoDTO(
                        cp.getId(),
                        new TallaDTO(cp.getTalla().getId(), cp.getTalla().getNombre()),
                        new ColorDTO(cp.getColor().getId(), cp.getColor().getNombre(), cp.getColor().getCodigoHex()),
                        cp.getStock(),
                        cp.getSku()
                ))
                .collect(Collectors.toList());

        return new ProductoDetailDTO(
                producto.getId(),
                producto.getNombre(),
                producto.getSlug(),
                producto.getDescripcion(),
                producto.getSku(),
                marcaDTO,
                categoriaDTO,
                producto.getPrecio(),
                producto.getPrecioOferta(),
                producto.getEsDestacado(),
                imagenesDTO,
                combinacionesDTO
        );
    }


    @Override
    @Transactional(readOnly = true)
    public Page<ProductoListDTO> obtenerTodosLosProductosActivos(Pageable pageable) {

        return productoRepository.findByActivoTrue(pageable)
                .map(this::convertirAProductoListDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProductoDetailDTO> obtenerProductoActivoPorSlug(String slug) {
        return productoRepository.findBySlug(slug)
                .filter(Producto::getActivo)
                .map(this::convertirAProductoDetailDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProductoDetailDTO> obtenerProductoActivoPorId(Integer id) {
        return productoRepository.findById(id)
                .filter(Producto::getActivo)
                .map(this::convertirAProductoDetailDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductoListDTO> obtenerProductosActivosPorCategoria(Integer categoriaId, Pageable pageable) {
        Optional<Categoria> categoriaOpt = categoriaRepository.findById(categoriaId);
        if (categoriaOpt.isEmpty() || !categoriaOpt.get().getActivo()) {
            return Page.empty(pageable);
        }

        return productoRepository.findByCategoriaAndActivoTrue(categoriaOpt.get(), pageable)
                .map(this::convertirAProductoListDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductoListDTO> obtenerProductosActivosPorMarca(Integer marcaId, Pageable pageable) {
        Optional<Marca> marcaOpt = marcaRepository.findById(marcaId);
        if (marcaOpt.isEmpty() || !marcaOpt.get().getActivo()) {
            return Page.empty(pageable);
        }

        // Luego usa:
        return productoRepository.findByMarcaAndActivoTrue(marcaOpt.get(), pageable)
                .map(this::convertirAProductoListDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductoListDTO> buscarProductos(String terminoBusqueda, Pageable pageable) {

        String terminoProducto = terminoBusqueda;
        String nombreColor = null;

        List<String> coloresConocidos = colorRepository.findAll().stream().map(Color::getNombre).collect(Collectors.toList());
        for (String colorConocido : coloresConocidos) {
            if (terminoBusqueda.toLowerCase().contains(colorConocido.toLowerCase())) {
                nombreColor = colorConocido;
                terminoProducto = terminoBusqueda.toLowerCase().replace(colorConocido.toLowerCase(), "").trim();
                break;
            }
        }
        if (terminoProducto.isEmpty() && nombreColor == null) {
             return Page.empty(pageable);
        }

        return productoRepository.buscarAvanzado(terminoProducto, nombreColor, pageable)
               .map(this::convertirAProductoListDTO);
    }
}