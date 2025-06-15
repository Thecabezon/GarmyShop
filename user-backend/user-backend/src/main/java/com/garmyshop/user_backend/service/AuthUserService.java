package com.garmyshop.user_backend.service;

import com.garmyshop.user_backend.dto.RegistroRequestDTO;
import com.garmyshop.user_backend.dto.UsuarioDTO;
import com.garmyshop.user_backend.entity.AuthUser; // Podríamos necesitar devolver la entidad en algún caso interno

import java.util.Optional;

public interface AuthUserService {

    /**
     * Registra un nuevo usuario en el sistema.
     *
     * @param registroRequestDTO Datos del usuario para el registro.
     * @return El AuthUser creado y persistido.
     * @throws RuntimeException si el nombre de usuario o email ya existen.
     */
    AuthUser registrarUsuario(RegistroRequestDTO registroRequestDTO);

    /**
     * Busca un usuario por su nombre de usuario.
     * Utilizado internamente, por ejemplo, por Spring Security.
     *
     * @param username El nombre de usuario.
     * @return Un Optional conteniendo el AuthUser si se encuentra.
     */
    Optional<AuthUser> encontrarPorUsername(String username);

    /**
     * Busca un usuario por su email.
     *
     * @param email El email del usuario.
     * @return Un Optional conteniendo el AuthUser si se encuentra.
     */
    Optional<AuthUser> encontrarPorEmail(String email);


    /**
     * Obtiene los datos de perfil de un usuario (para ser expuestos en la API).
     *
     * @param username El nombre de usuario del cual obtener el perfil.
     * @return Un Optional conteniendo el UsuarioDTO si el usuario existe.
     */
    Optional<UsuarioDTO> obtenerPerfilUsuario(String username);

    // Más adelante podríamos añadir:
    // UsuarioDTO actualizarPerfilUsuario(String username, ActualizarPerfilRequestDTO request);
    // void solicitarReseteoPassword(String email);
    // void resetearPassword(String token, String nuevaPassword);
}