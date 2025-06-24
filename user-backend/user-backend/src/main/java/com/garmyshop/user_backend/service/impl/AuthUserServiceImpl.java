package com.garmyshop.user_backend.service.impl;

import com.garmyshop.user_backend.dto.RegistroRequestDTO;
import com.garmyshop.user_backend.dto.UsuarioDTO;
import com.garmyshop.user_backend.entity.AuthUser;
import com.garmyshop.user_backend.exception.RecursoNoEncontradoException; // Asegúrate que esta clase existe
import com.garmyshop.user_backend.repository.AuthUserRepository;
import com.garmyshop.user_backend.security.JwtTokenProvider; // Importar JwtTokenProvider
import com.garmyshop.user_backend.service.AuthUserService;
import com.garmyshop.user_backend.service.EmailService;     // Importar EmailService
import org.slf4j.Logger;                                    // Importar Logger
import org.slf4j.LoggerFactory;                             // Importar LoggerFactory
import org.springframework.beans.factory.annotation.Value;   // Importar Value
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class AuthUserServiceImpl implements AuthUserService, UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(AuthUserServiceImpl.class);

    private final AuthUserRepository authUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider; // Inyectado
    private final EmailService emailService;         // Inyectado

    @Value("${garmyshop.app.frontendResetPasswordUrl}") // URL base del frontend para la página de reseteo
    private String frontendResetPasswordUrl;

    // Constructor actualizado para inyectar todas las dependencias
    public AuthUserServiceImpl(AuthUserRepository authUserRepository,
                               PasswordEncoder passwordEncoder,
                               JwtTokenProvider jwtTokenProvider,
                               EmailService emailService) {
        this.authUserRepository = authUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public AuthUser registrarUsuario(RegistroRequestDTO registroRequestDTO) {
        if (authUserRepository.existsByUsername(registroRequestDTO.getUsername())) {
            throw new RuntimeException("Error: El nombre de usuario ya está en uso!");
        }
        if (authUserRepository.existsByEmail(registroRequestDTO.getEmail())) {
            throw new RuntimeException("Error: El email ya está en uso!");
        }

        AuthUser nuevoUsuario = new AuthUser();
        nuevoUsuario.setUsername(registroRequestDTO.getUsername());
        nuevoUsuario.setEmail(registroRequestDTO.getEmail());
        nuevoUsuario.setPassword(passwordEncoder.encode(registroRequestDTO.getPassword()));
        nuevoUsuario.setFirstName(registroRequestDTO.getFirstName());
        nuevoUsuario.setLastName(registroRequestDTO.getLastName());
        nuevoUsuario.setActive(true);
        nuevoUsuario.setStaff(false);
        nuevoUsuario.setSuperuser(false);
        nuevoUsuario.setDateJoined(LocalDateTime.now());
        return authUserRepository.save(nuevoUsuario);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AuthUser> encontrarPorUsername(String username) {
        return authUserRepository.findByUsername(username);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AuthUser> encontrarPorEmail(String email) {
        return authUserRepository.findByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UsuarioDTO> obtenerPerfilUsuario(String username) {
        return authUserRepository.findByUsername(username)
                .map(this::convertirAUsuarioDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        AuthUser authUser = authUserRepository.findByUsername(usernameOrEmail)
                .orElseGet(() -> authUserRepository.findByEmail(usernameOrEmail)
                        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con username o email: " + usernameOrEmail)));

        Set<GrantedAuthority> authorities = new HashSet<>();
        if (authUser.isSuperuser()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_SUPERUSER"));
        }
        if (authUser.isStaff()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_STAFF"));
        }
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        return new User(authUser.getUsername(), authUser.getPassword(), authUser.isActive(),
                true, true, true, authorities);
    }

    private UsuarioDTO convertirAUsuarioDTO(AuthUser authUser) {
        if (authUser == null) return null;
        return new UsuarioDTO(
                authUser.getId(),
                authUser.getUsername(),
                authUser.getFirstName(),
                authUser.getLastName(),
                authUser.getEmail(),
                authUser.getDateJoined(),
                authUser.getLastLogin()
        );
    }

    // --- Métodos para Reseteo de Contraseña ---

    @Override
    @Transactional // Puede que solo lea, pero si actualizas un token o contador, necesita ser transaccional
    public String generarYSimularEnvioTokenReseteo(String userEmail) { // Cambiado de void a String para devolver el token (para pruebas/simplicidad temporal)
        AuthUser user = authUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró usuario con el email: " + userEmail));

        // Consideración: Si el usuario ya tiene un token de reseteo activo, ¿invalidarlo o reutilizarlo?
        // Por ahora, generamos uno nuevo.

        String token = jwtTokenProvider.generateTokenFromUsername(user.getUsername());
        // Idealmente, este token debería tener una expiración corta (ej. 15-60 minutos)
        // y un "tipo" o "scope" específico para reseteo de contraseña si modificas JwtTokenProvider.
        // Por ahora, usa la expiración general de JWT.

        // Enviar el email real
        emailService.enviarEmailReseteoPassword(user.getEmail(), user.getFirstName(), token, frontendResetPasswordUrl);
        
        logger.info("Solicitud de reseteo de contraseña procesada y email enviado para: {}", userEmail);

        // Devolvemos el token aquí para que puedas probarlo fácilmente con Postman
        // si el sistema de email no está completamente configurado o para depuración.
        // En un entorno de producción real, este método probablemente sería void
        // y el usuario obtendría el token solo a través del email.
        return token;
    }

    @Override
    @Transactional // Operación de escritura en la BD
    public void resetearPasswordConToken(String token, String nuevaPassword) {
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("El token no puede ser nulo o vacío.");
        }
        if (nuevaPassword == null || nuevaPassword.trim().isEmpty()) {
            // Aquí también podrías validar la fortaleza de la nueva contraseña
            throw new IllegalArgumentException("La nueva contraseña no puede ser nula o vacía.");
        }

        if (!jwtTokenProvider.validateToken(token)) {
            throw new RuntimeException("Token de reseteo inválido o expirado.");
            // Podrías usar una InvalidTokenException personalizada
        }

        String username = jwtTokenProvider.getUsernameFromJWT(token);
        AuthUser user = authUserRepository.findByUsername(username)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado para el token de reseteo. Username: " + username));
        
        // Opcional: Verificar si el token es específicamente para reseteo (si tuvieras claims para ello)
        // Opcional: Verificar si la contraseña es diferente a la anterior.

        user.setPassword(passwordEncoder.encode(nuevaPassword));
        // Podrías querer actualizar un campo como 'passwordLastResetAt' o 'lastPasswordChangeDate'
        authUserRepository.save(user);

        logger.info("Contraseña reseteada exitosamente para el usuario: {}", username);
        // Opcional: Enviar un email de notificación de que la contraseña ha sido cambiada.
    }
}