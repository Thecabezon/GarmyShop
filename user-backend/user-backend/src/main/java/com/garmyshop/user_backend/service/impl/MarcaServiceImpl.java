package com.garmyshop.user_backend.service.impl; // o .service

import com.garmyshop.user_backend.dto.MarcaDTO;
import com.garmyshop.user_backend.entity.Marca;
import com.garmyshop.user_backend.repository.MarcaRepository;
import com.garmyshop.user_backend.service.MarcaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MarcaServiceImpl implements MarcaService {

    private final MarcaRepository marcaRepository;

    public MarcaServiceImpl(MarcaRepository marcaRepository) {
        this.marcaRepository = marcaRepository;
    }

    private MarcaDTO convertirAMarcaDTO(Marca marca) {
        if (marca == null) return null;
        return new MarcaDTO(
                marca.getId(),
                marca.getNombre(),
                marca.getSlug(),
                marca.getImagen()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<MarcaDTO> obtenerTodasLasMarcasActivas() {
        // Necesitaremos un método findByActivoTrue() en MarcaRepository
        // **ACCIÓN REQUERIDA: Añadir findByActivoTrue() a MarcaRepository**
        return marcaRepository.findByActivoTrue()
                .stream()
                .map(this::convertirAMarcaDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<MarcaDTO> obtenerMarcaActivaPorSlug(String slug) {
        return marcaRepository.findBySlug(slug)
                .filter(Marca::getActivo)
                .map(this::convertirAMarcaDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<MarcaDTO> obtenerMarcaPorId(Integer id) {
        return marcaRepository.findById(id)
                .map(this::convertirAMarcaDTO);
    }
}