package com.garmyshop.user_backend.security.oauth2;

import com.garmyshop.user_backend.security.JwtTokenProvider;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.util.StringUtils;

import java.io.IOException;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private static final Logger logger = LoggerFactory.getLogger(OAuth2AuthenticationSuccessHandler.class);
    private final JwtTokenProvider tokenProvider;

    @Value("${garmyshop.app.oauth2RedirectUri}")
    private String oauth2RedirectUri;

    public OAuth2AuthenticationSuccessHandler(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        String targetUrl = determineTargetUrl(request, response, authentication);
        if (response.isCommitted()) {
            logger.debug("La respuesta ya fue commited. Imposible redirigir a " + targetUrl);
            return;
        }
        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    @Override
    protected String determineTargetUrl(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) {
        
        if (!StringUtils.hasText(oauth2RedirectUri)) {
            logger.warn("La URI de redirección OAuth2 (garmyshop.app.oauth2RedirectUri) no está configurada. Usando comportamiento por defecto del padre.");
            return super.determineTargetUrl(request, response, authentication);
        }

        Object principal = authentication.getPrincipal();
        logger.debug("Tipo de Principal recibido en SuccessHandler: {}", principal.getClass().getName());

        // La verificación más importante: ¿Es nuestro OidcUserDetails personalizado?
        // Si no lo es, significa que nuestro CustomOAuth2UserService no se ejecutó o su resultado fue descartado.
        if (!(principal instanceof OidcUserDetails)) {
            logger.error("¡ERROR CRÍTICO! El Principal no es del tipo OidcUserDetails. Tu CustomOAuth2UserService no se ejecutó o su resultado fue descartado.");
            logger.error("Tipo de Principal recibido: {}. Esto significa que el usuario NO FUE CREADO/ACTUALIZADO en la base de datos.", principal.getClass().getName());
            
            // Generamos una URL de error clara para el frontend.
            return UriComponentsBuilder.fromUriString(oauth2RedirectUri)
                    .queryParam("error", "UserProcessingFailed")
                    .build().toUriString();
        }

        // Si llegamos aquí, el flujo fue correcto. El Principal es nuestra clase personalizada.
        OidcUserDetails userDetails = (OidcUserDetails) principal;
        
        // Obtenemos el username de NUESTRO sistema, que está guardado en OidcUserDetails.
        String username = userDetails.getUsername(); 

        if (!StringUtils.hasText(username)) {
            logger.error("Se recibió OidcUserDetails, pero el username interno es nulo o vacío. No se puede generar el token.");
             return UriComponentsBuilder.fromUriString(oauth2RedirectUri)
                    .queryParam("error", "UsernameMissingInPrincipal")
                    .build().toUriString();
        }

        logger.info("Éxito. Username determinado desde OidcUserDetails para generar JWT: {}", username);
        
        // Generamos el token JWT usando el username de nuestra base de datos.
        String token = tokenProvider.generateTokenFromUsername(username);

        // Construimos la URL final para redirigir al frontend con el token.
        return UriComponentsBuilder.fromUriString(oauth2RedirectUri)
                .queryParam("token", token)
                .build().toUriString();
    }
}