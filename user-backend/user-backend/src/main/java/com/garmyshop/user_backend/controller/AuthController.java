package com.garmyshop.user_backend.controller;

import com.garmyshop.user_backend.dto.*;
import com.garmyshop.user_backend.entity.AuthUser;
import com.garmyshop.user_backend.exception.RecursoNoEncontradoException;
import com.garmyshop.user_backend.security.JwtTokenProvider;
import com.garmyshop.user_backend.service.AuthUserService;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final AuthUserService authUserService;
    private final JwtTokenProvider tokenProvider;

    public AuthController(AuthenticationManager authenticationManager,
                          AuthUserService authUserService,
                          JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.authUserService = authUserService;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody RegistroRequestDTO registroRequestDTO) {
        try {
            authUserService.registrarUsuario(registroRequestDTO);
            return ResponseEntity.ok(Map.of("message", "Usuario registrado exitosamente."));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error al registrar el usuario: " + ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> autenticarUsuario(@RequestBody LoginRequestDTO loginRequestDTO) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequestDTO.getUsernameOrEmail(),
                            loginRequestDTO.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            AuthUser authUser = authUserService.encontrarPorUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Error al obtener detalles del usuario después del login"));

            return ResponseEntity.ok(new AuthResponseDTO(jwt, authUser.getId(), authUser.getUsername(), authUser.getEmail()));

        } catch (Exception ex) {
            logger.warn("Fallo de autenticación para el usuario {}: {}", loginRequestDTO.getUsernameOrEmail(), ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error de autenticación: Credenciales inválidas.");
        }
    }

    @GetMapping("/perfil")
    public ResponseEntity<UsuarioDTO> obtenerPerfilUsuarioActual() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal().toString())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String currentUsername = authentication.getName();
        return authUserService.obtenerPerfilUsuario(currentUsername)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    logger.warn("Perfil no encontrado para usuario autenticado: {}", currentUsername);
                    return ResponseEntity.notFound().build();
                });
    }

    /**
     * Endpoint para solicitar el reseteo de contraseña.
     * @param forgotPasswordRequestDTO
     * @return
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> solicitarReseteoPassword(@RequestBody ForgotPasswordRequestDTO forgotPasswordRequestDTO) {
        if (forgotPasswordRequestDTO.getEmail() == null || forgotPasswordRequestDTO.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El email es requerido.");
        }
        try {
           
            String token = authUserService.generarYSimularEnvioTokenReseteo(forgotPasswordRequestDTO.getEmail());
            logger.info("Token de reseteo generado para {}: {} (solo para depuración en desarrollo)", forgotPasswordRequestDTO.getEmail(), token);

            return ResponseEntity.ok("Si existe una cuenta asociada con " + forgotPasswordRequestDTO.getEmail() +
                                     ", se ha enviado un enlace para resetear la contraseña.");
        } catch (RecursoNoEncontradoException ex) {
            logger.warn("Intento de reseteo de contraseña para email no registrado: {}", forgotPasswordRequestDTO.getEmail());
            
            return ResponseEntity.ok("Si existe una cuenta asociada con " + forgotPasswordRequestDTO.getEmail() +
                                     ", se ha enviado un enlace para resetear la contraseña.");
        } catch (Exception ex) {
            logger.error("Error al procesar solicitud de olvido de contraseña para {}: ", forgotPasswordRequestDTO.getEmail(), ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar la solicitud.");
        }
    }

    /**
     * Endpoint para resetear la contraseña usando un token válido.
     * @param resetPasswordRequestDTO
     * @return
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetearPassword(@RequestBody ResetPasswordRequestDTO resetPasswordRequestDTO) {
        if (resetPasswordRequestDTO.getToken() == null || resetPasswordRequestDTO.getToken().trim().isEmpty() ||
            resetPasswordRequestDTO.getNuevaPassword() == null || resetPasswordRequestDTO.getNuevaPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El token y la nueva contraseña son requeridos.");
        }
        try {
            authUserService.resetearPasswordConToken(
                    resetPasswordRequestDTO.getToken(),
                    resetPasswordRequestDTO.getNuevaPassword()
            );
            return ResponseEntity.ok("¡Contraseña actualizada exitosamente!");
        } catch (RecursoNoEncontradoException ex) {
            logger.warn("Intento de reseteo con token, pero recurso no encontrado: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (RuntimeException ex) {
            logger.warn("Error en reseteo de contraseña (token inválido/expirado o similar): {}", ex.getMessage());
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            logger.error("Error inesperado al resetear la contraseña: ", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar la solicitud de reseteo.");
        }
    }
}
