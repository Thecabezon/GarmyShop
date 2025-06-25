package com.garmyshop.user_backend.security.oauth2;

import com.garmyshop.user_backend.entity.AuthUser;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority; // Necesario si construyes authorities aquí
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

import java.util.Collection;
import java.util.HashSet; // Para construir authorities aquí si es necesario
import java.util.Map;
import java.util.Set;   // Para construir authorities aquí si es necesario

public class OidcUserDetails implements OidcUser, UserDetails {

    private final OidcUser oidcUser;
    private final AuthUser authUser; // Tu usuario interno
    private final Collection<? extends GrantedAuthority> authorities; // Autoridades de tu sistema

    public OidcUserDetails(OidcUser oidcUser, AuthUser authUser, Collection<? extends GrantedAuthority> authorities) {
        this.oidcUser = oidcUser;
        this.authUser = authUser;
        this.authorities = authorities;
    }

    // Métodos de OidcUser (delegados)
    @Override
    public Map<String, Object> getClaims() {
        return oidcUser.getClaims();
    }

    @Override
    public OidcUserInfo getUserInfo() {
        return oidcUser.getUserInfo();
    }

    @Override
    public OidcIdToken getIdToken() {
        return oidcUser.getIdToken();
    }

    // Métodos de OAuth2User (delegados)
    @Override
    public Map<String, Object> getAttributes() {
        // Devuelve los atributos originales de Google, o podrías combinar/modificar si es necesario
        return oidcUser.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Devolvemos las authorities que construimos para nuestro sistema
        return this.authorities;
    }

    @Override
    public String getName() {
        // ¡IMPORTANTE! Devolvemos el username de nuestro sistema interno.
        // Este es el que JwtTokenProvider usará si se le pasa el Authentication object directamente.
        // Y también es el que authentication.getName() devolverá.
        return authUser.getUsername();
    }

    // Métodos de UserDetails
    @Override
    public String getPassword() {
        return authUser.getPassword(); // Contraseña hasheada de nuestro sistema
    }

    @Override
    public String getUsername() {
        // Username de nuestro sistema
        return authUser.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return authUser.isActive();
    }

    // Getter para tu AuthUser interno
    public AuthUser getAuthUser() {
        return authUser;
    }

    // Getter para el OidcUser original si se necesita acceder a algo más de él
    public OidcUser getOidcUser() {
        return oidcUser;
    }
}