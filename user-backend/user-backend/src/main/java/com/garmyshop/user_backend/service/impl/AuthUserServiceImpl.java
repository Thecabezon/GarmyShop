package com.garmyshop.user_backend.service.impl;

import com.garmyshop.user_backend.dto.RegistroRequestDTO;
import com.garmyshop.user_backend.dto.UsuarioDTO;
import com.garmyshop.user_backend.entity.AuthUser;
import com.garmyshop.user_backend.exception.RecursoNoEncontradoException;
import com.garmyshop.user_backend.repository.AuthUserRepository;
import com.garmyshop.user_backend.security.JwtTokenProvider;
import com.garmyshop.user_backend.service.AuthUserService;
import com.garmyshop.user_backend.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
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
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;

    @Value("${garmyshop.app.frontendResetPasswordUrl}")
    private String frontendResetPasswordUrl;

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


    @Override
    @Transactional
    public String generarYSimularEnvioTokenReseteo(String userEmail) {
        AuthUser user = authUserRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RecursoNoEncontradoException("No se encontró usuario con el email: " + userEmail));

        String token = jwtTokenProvider.generateTokenFromUsername(user.getUsername());

        emailService.enviarEmailReseteoPassword(user.getEmail(), user.getFirstName(), token, frontendResetPasswordUrl);
        
        logger.info("Solicitud de reseteo de contraseña procesada y email enviado para: {}", userEmail);

        return token;
    }

    @Override
    @Transactional
    public void resetearPasswordConToken(String token, String nuevaPassword) {
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("El token no puede ser nulo o vacío.");
        }
        if (nuevaPassword == null || nuevaPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("La nueva contraseña no puede ser nula o vacía.");
        }

        if (!jwtTokenProvider.validateToken(token)) {
            throw new RuntimeException("Token de reseteo inválido o expirado.");
        }

        String username = jwtTokenProvider.getUsernameFromJWT(token);
        AuthUser user = authUserRepository.findByUsername(username)
                .orElseThrow(() -> new RecursoNoEncontradoException("Usuario no encontrado para el token de reseteo. Username: " + username));


        user.setPassword(passwordEncoder.encode(nuevaPassword));
        authUserRepository.save(user);

        logger.info("Contraseña reseteada exitosamente para el usuario: {}", username);
    }
}