package com.garmyshop.user_backend.service;

import com.garmyshop.user_backend.dto.RegistroRequestDTO;
import com.garmyshop.user_backend.dto.UsuarioDTO;
import com.garmyshop.user_backend.entity.AuthUser;

import java.util.Optional;

public interface AuthUserService {

    /**
     * Registra un nuevo usuario en el sistema.
     * @param registroRequestDTO
     * @return
     * @throws RuntimeException
     */
    AuthUser registrarUsuario(RegistroRequestDTO registroRequestDTO);

    /**
     * @param username
     * @return
     */
    Optional<AuthUser> encontrarPorUsername(String username);

    /**
     * Busca un usuario por su email.
     * @param email
     * @return
     */
    Optional<AuthUser> encontrarPorEmail(String email);

    /**
     * Obtiene los datos de perfil de un usuario (para ser expuestos en la API).
     * @param username
     * @return
     */
    Optional<UsuarioDTO> obtenerPerfilUsuario(String username);

    /**
     * @param userEmail
     * @return
     * @throws com.garmyshop.user_backend.exception.RecursoNoEncontradoException
     */
    String generarYSimularEnvioTokenReseteo(String userEmail);

    /**
     * Valida el token de reseteo y actualiza la contraseña del usuario.
     * @param token
     * @param nuevaPassword
     * @throws RuntimeException
     */
    void resetearPasswordConToken(String token, String nuevaPassword);

}