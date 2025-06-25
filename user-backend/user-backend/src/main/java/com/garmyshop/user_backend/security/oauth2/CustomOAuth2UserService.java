package com.garmyshop.user_backend.security.oauth2;

import com.garmyshop.user_backend.entity.AuthUser;
import com.garmyshop.user_backend.exception.OAuth2AuthenticationProcessingException;
import com.garmyshop.user_backend.repository.AuthUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;


@Service
public class CustomOAuth2UserService extends OidcUserService {

    private static final Logger logger = LoggerFactory.getLogger(CustomOAuth2UserService.class);

    private final AuthUserRepository authUserRepository;
    private final PasswordEncoder passwordEncoder;
    

    public CustomOAuth2UserService(AuthUserRepository authUserRepository, PasswordEncoder passwordEncoder) {
        this.authUserRepository = authUserRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    @Transactional
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        logger.info(">>>>>>>>>> CustomOAuth2UserService.loadUser() INICIADO <<<<<<<<<<");

        OidcUser oidcUser = super.loadUser(userRequest);
        
        logger.info("Paso 1: OidcUser cargado de Google. Email: {}", oidcUser.getEmail());

        AuthUser authUserInSystem = processAndSaveAuthUser(oidcUser);

        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        if (authUserInSystem.isStaff()) authorities.add(new SimpleGrantedAuthority("ROLE_STAFF"));
        if (authUserInSystem.isSuperuser()) authorities.add(new SimpleGrantedAuthority("ROLE_SUPERUSER"));

        logger.info("Paso 4: Devolviendo OidcUserDetails para el usuario: {}", authUserInSystem.getUsername());
        return new OidcUserDetails(oidcUser, authUserInSystem, authorities);
    }

    protected AuthUser processAndSaveAuthUser(OidcUser oidcUser) {
        String email = oidcUser.getEmail();
        String givenName = oidcUser.getGivenName();
        String familyName = oidcUser.getFamilyName();

        if (!StringUtils.hasText(email)) {
            throw new OAuth2AuthenticationProcessingException("Email no encontrado del proveedor OAuth2");
        }

        Optional<AuthUser> userOptional = authUserRepository.findByEmail(email);
        AuthUser authUserToSave;
        boolean isNew = false;

        if (userOptional.isPresent()) {
            authUserToSave = userOptional.get();
            logger.info("Paso 2a: Usuario existente encontrado por email [{}]: {}", email, authUserToSave.getUsername());
            authUserToSave.setFirstName(StringUtils.hasText(givenName) ? givenName : authUserToSave.getFirstName());
            authUserToSave.setLastName(StringUtils.hasText(familyName) ? familyName : authUserToSave.getLastName());
            authUserToSave.setLastLogin(LocalDateTime.now());
        } else {
            isNew = true;
            authUserToSave = new AuthUser();
            authUserToSave.setEmail(email);
            authUserToSave.setUsername(generateUniqueUsername(email));
            authUserToSave.setFirstName(StringUtils.hasText(givenName) ? givenName : "");
            authUserToSave.setLastName(StringUtils.hasText(familyName) ? familyName : "");
            authUserToSave.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            authUserToSave.setActive(true);
            authUserToSave.setStaff(false);
            authUserToSave.setSuperuser(false);
            authUserToSave.setDateJoined(LocalDateTime.now());
            authUserToSave.setLastLogin(LocalDateTime.now());
            logger.info("Paso 2b: Preparando nuevo usuario con email [{}]: Username={}", email, authUserToSave.getUsername());
        }

        logger.info("Paso 3: Intentando guardar AuthUser (nuevo: {}): {}", isNew, authUserToSave.getUsername());
        AuthUser savedUser = authUserRepository.save(authUserToSave);

        if (savedUser.getId() == null) {
            logger.error("¡ERROR CRÍTICO! AuthUser.save() no asignó un ID. El guardado falló o la transacción hizo rollback. Username: {}", savedUser.getUsername());
            throw new InternalAuthenticationServiceException("Fallo al persistir el usuario: No se asignó ID.");
        }
        logger.info("AuthUser guardado/actualizado exitosamente en BD. ID: {}, Username: {}", savedUser.getId(), savedUser.getUsername());
        
        return savedUser;
    }

    private String generateUniqueUsername(String email) {
        String baseUsername = email.split("@")[0].replaceAll("[^a-zA-Z0-9.-_]", "");
        if (!StringUtils.hasText(baseUsername)) { baseUsername = "user"; }
        if (baseUsername.length() > 140) { baseUsername = baseUsername.substring(0, 140); }
        String username = baseUsername;
        int count = 0;
        while (authUserRepository.existsByUsername(username) && count < 1000) {
            count++;
            String suffix = String.valueOf(count);
            if (baseUsername.length() + suffix.length() > 150) {
                username = baseUsername.substring(0, 150 - suffix.length()) + suffix;
            } else {
                username = baseUsername + suffix;
            }
        }
        if (authUserRepository.existsByUsername(username)) {
            String uuidSuffix = UUID.randomUUID().toString().substring(0, 8);
            if (baseUsername.length() + uuidSuffix.length() > 150) {
                username = baseUsername.substring(0, 150 - uuidSuffix.length()) + uuidSuffix;
            } else {
                username = baseUsername + uuidSuffix;
            }
        }
        return username;
    }
}