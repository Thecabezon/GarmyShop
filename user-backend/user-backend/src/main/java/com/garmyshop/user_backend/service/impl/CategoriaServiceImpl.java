package com.garmyshop.user_backend.service.impl;

import com.garmyshop.user_backend.dto.CategoriaDTO;
import com.garmyshop.user_backend.entity.Categoria;
import com.garmyshop.user_backend.repository.CategoriaRepository;
import com.garmyshop.user_backend.service.CategoriaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaServiceImpl(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    private CategoriaDTO convertirACategoriaDTO(Categoria categoria) {
        if (categoria == null) {
            return null;
        }
        return new CategoriaDTO(
                categoria.getId(),
                categoria.getNombre(),
                categoria.getSlug(),
                categoria.getImagen()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoriaDTO> obtenerTodasLasCategoriasActivas() {
        return categoriaRepository.findByActivoTrue()
                .stream()
                .map(this::convertirACategoriaDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CategoriaDTO> obtenerCategoriaActivaPorSlug(String slug) {
        return categoriaRepository.findBySlug(slug)
                .filter(Categoria::getActivo)
                .map(this::convertirACategoriaDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CategoriaDTO> obtenerCategoriaPorId(Integer id) {
        return categoriaRepository.findById(id)
                .map(this::convertirACategoriaDTO);
    }
}