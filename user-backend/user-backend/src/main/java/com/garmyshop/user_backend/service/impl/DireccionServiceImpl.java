package com.garmyshop.user_backend.service.impl;

import com.garmyshop.user_backend.dto.DireccionDTO;
import com.garmyshop.user_backend.entity.AuthUser;
import com.garmyshop.user_backend.entity.Direccion;
import com.garmyshop.user_backend.exception.RecursoNoEncontradoException;
import com.garmyshop.user_backend.repository.AuthUserRepository;
import com.garmyshop.user_backend.repository.DireccionRepository;
import com.garmyshop.user_backend.service.DireccionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DireccionServiceImpl implements DireccionService {

    private final DireccionRepository direccionRepository;
    private final AuthUserRepository authUserRepository;

    public DireccionServiceImpl(DireccionRepository direccionRepository, AuthUserRepository authUserRepository) {
        this.direccionRepository = direccionRepository;
        this.authUserRepository = authUserRepository;
    }

    @Override
    @Transactional
    public DireccionDTO crearDireccion(DireccionDTO direccionDTO, String username) {
        AuthUser usuario = authUserRepository.findByUsername(username)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado: " + username));

        Direccion nuevaDireccion = new Direccion();
        nuevaDireccion.setUsuario(usuario);
        nuevaDireccion.setNombre(direccionDTO.getNombre());
        nuevaDireccion.setApellido(direccionDTO.getApellido());
        nuevaDireccion.setDepartamento(direccionDTO.getDepartamento());
        nuevaDireccion.setProvincia(direccionDTO.getProvincia());
        nuevaDireccion.setDistrito(direccionDTO.getDistrito());
        nuevaDireccion.setCalle(direccionDTO.getCalle());
        nuevaDireccion.setCodigoPostal(direccionDTO.getCodigoPostal());
        nuevaDireccion.setReferencia(direccionDTO.getReferencia());
        nuevaDireccion.setTelefono(direccionDTO.getTelefono());

        Direccion direccionGuardada = direccionRepository.save(nuevaDireccion);
        return convertirADireccionDTO(direccionGuardada);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DireccionDTO> obtenerDireccionesPorUsuario(String username) {
        AuthUser usuario = authUserRepository.findByUsername(username)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado: " + username));
        
        return direccionRepository.findByUsuario(usuario)
                .stream()
                .map(this::convertirADireccionDTO)
                .collect(Collectors.toList());
    }

    private DireccionDTO convertirADireccionDTO(Direccion direccion) {
        return new DireccionDTO(
            direccion.getId(),
            direccion.getNombre(),
            direccion.getApellido(),
            direccion.getDepartamento(),
            direccion.getProvincia(),
            direccion.getDistrito(),
            direccion.getCalle(),
            direccion.getCodigoPostal(),
            direccion.getReferencia(),
            direccion.getTelefono()
        );
    }
}