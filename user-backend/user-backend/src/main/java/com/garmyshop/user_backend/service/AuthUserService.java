package com.garmyshop.user_backend.service;

import com.garmyshop.user_backend.dto.RegistroRequestDTO;
import com.garmyshop.user_backend.dto.UsuarioDTO;
import com.garmyshop.user_backend.entity.AuthUser;
// import com.garmyshop.user_backend.exception.RecursoNoEncontradoException; // Si decides que la interfaz declare excepciones específicas

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

    // --- MÉTODOS PARA RESETEO DE CONTRASEÑA ---

    /**
     * Genera un token JWT para el reseteo de contraseña, lo envía por email
     * y devuelve el token para fines de prueba/desarrollo.
     *
     * @param userEmail El email del usuario.
     * @return El token de reseteo generado.
     * @throws com.garmyshop.user_backend.exception.RecursoNoEncontradoException si el usuario con ese email no existe.
     *         (o RuntimeException si no quieres importar la excepción específica aquí)
     */
    String generarYSimularEnvioTokenReseteo(String userEmail); // <<< DESCOMENTADO Y CON NOMBRE/FIRMA CORRECTOS

    /**
     * Valida el token de reseteo y actualiza la contraseña del usuario.
     *
     * @param token El token de reseteo.
     * @param nuevaPassword La nueva contraseña (sin hashear).
     * @throws RuntimeException Si el token es inválido, ha expirado o el usuario no se encuentra.
     *                          (Considera excepciones más específicas como InvalidTokenException).
     */
    void resetearPasswordConToken(String token, String nuevaPassword); // <<< DESCOMENTADO Y CON NOMBRE/FIRMA CORRECTOS

    // UsuarioDTO actualizarPerfilUsuario(String username, ActualizarPerfilRequestDTO request); // Ejemplo para el futuro
}