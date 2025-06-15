package com.garmyshop.user_backend.service.impl; // o .service

import com.garmyshop.user_backend.dto.RegistroRequestDTO;
import com.garmyshop.user_backend.dto.UsuarioDTO;
import com.garmyshop.user_backend.entity.AuthUser;
import com.garmyshop.user_backend.repository.AuthUserRepository;
import com.garmyshop.user_backend.service.AuthUserService;
import org.springframework.security.core.GrantedAuthority; // Para roles/autoridades
import org.springframework.security.core.authority.SimpleGrantedAuthority; // Para roles/autoridades
import org.springframework.security.core.userdetails.User; // User de Spring Security
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet; // Para las autoridades/roles
import java.util.Optional;
import java.util.Set; // Para las autoridades/roles


@Service
public class AuthUserServiceImpl implements AuthUserService, UserDetailsService {

    private final AuthUserRepository authUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthUserServiceImpl(AuthUserRepository authUserRepository, PasswordEncoder passwordEncoder) {
        this.authUserRepository = authUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional // Esta operación modifica la base de datos
    public AuthUser registrarUsuario(RegistroRequestDTO registroRequestDTO) {
        if (authUserRepository.existsByUsername(registroRequestDTO.getUsername())) {
            throw new RuntimeException("Error: El nombre de usuario ya está en uso!");
            // Podríamos usar una excepción personalizada aquí, ej. UsuarioYaExisteException
        }

        if (authUserRepository.existsByEmail(registroRequestDTO.getEmail())) {
            throw new RuntimeException("Error: El email ya está en uso!");
        }

        AuthUser nuevoUsuario = new AuthUser();
        nuevoUsuario.setUsername(registroRequestDTO.getUsername());
        nuevoUsuario.setEmail(registroRequestDTO.getEmail());
        nuevoUsuario.setPassword(passwordEncoder.encode(registroRequestDTO.getPassword())); // Hashear la contraseña
        nuevoUsuario.setFirstName(registroRequestDTO.getFirstName());
        nuevoUsuario.setLastName(registroRequestDTO.getLastName());

        nuevoUsuario.setActive(true); // Por defecto, los usuarios se registran como activos
        nuevoUsuario.setStaff(false); // Por defecto, no son staff
        nuevoUsuario.setSuperuser(false); // Por defecto, no son superusuarios
        nuevoUsuario.setDateJoined(LocalDateTime.now()); // Fecha de registro

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

    // --- Implementación de UserDetailsService ---
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        // Permitir login con username o email
        AuthUser authUser = authUserRepository.findByUsername(usernameOrEmail)
                .orElseGet(() -> authUserRepository.findByEmail(usernameOrEmail)
                        .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con username o email: " + usernameOrEmail)));

        // Aquí construimos el Set de GrantedAuthority.
        // Por ahora, es simple. Podríamos tener una lógica más compleja si tuviéramos una entidad Rol.
        Set<GrantedAuthority> authorities = new HashSet<>();
        if (authUser.isSuperuser()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_SUPERUSER")); // Ejemplo de rol
        }
        if (authUser.isStaff()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_STAFF")); // Ejemplo de rol
        }
        // Todos los usuarios registrados podrían tener un rol por defecto si es necesario, ej. "ROLE_USER"
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));


        return new User(authUser.getUsername(), authUser.getPassword(), authUser.isActive(),
                true, true, true, // accountNonExpired, credentialsNonExpired, accountNonLocked (puedes basarlos en campos de tu entidad si los tienes)
                authorities);
    }

    // --- Helper DTO Mapper ---
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
}