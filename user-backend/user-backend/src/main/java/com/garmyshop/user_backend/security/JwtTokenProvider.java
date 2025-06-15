package com.garmyshop.user_backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws; // Importante para el resultado del parseo
import io.jsonwebtoken.JwtParser; // Importante para construir el parser
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException; // Importar la nueva SignatureException
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey; // Usar la interfaz SecretKey
import java.util.Date;

@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${garmyshop.app.jwtSecret}")
    private String jwtSecretString;

    @Value("${garmyshop.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    private SecretKey key; // Usar la interfaz SecretKey
    private JwtParser jwtParser; // Guardar una instancia del parser

    @jakarta.annotation.PostConstruct
    public void init() {
        byte[] keyBytes = Decoders.BASE64.decode(this.jwtSecretString);
        this.key = Keys.hmacShaKeyFor(keyBytes); // Esto genera una SecretKey específica para HMAC-SHA (HS256, HS384, o HS512)
                                                 // El algoritmo se infiere de la longitud de la clave o del tipo de clave.
                                                 // Para HMAC-SHA, el algoritmo usado por Keys.hmacShaKeyFor ya está implícito.
        this.jwtParser = Jwts.parser().verifyWith(this.key).build(); // Construir el parser una vez
    }

    public String generateToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(userPrincipal.getUsername())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key) // <-- MODIFICADO: Solo se pasa la SecretKey
                .compact();
    }

    public String generateTokenFromUsername(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key) // <-- MODIFICADO: Solo se pasa la SecretKey
                .compact();
    }

    public String getUsernameFromJWT(String token) {
        Jws<Claims> claimsJws = jwtParser.parseSignedClaims(token); // Usar el parser pre-construido
        return claimsJws.getPayload().getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            jwtParser.parseSignedClaims(authToken); // Usar el parser pre-construido
            return true;
        } catch (SignatureException ex) { // Usar io.jsonwebtoken.security.SignatureException
            logger.error("Firma del JWT inválida: {}", ex.getMessage());
        } catch (MalformedJwtException ex) {
            logger.error("Token JWT inválido: {}", ex.getMessage());
        } catch (ExpiredJwtException ex) {
            logger.error("Token JWT expirado: {}", ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            logger.error("Token JWT no soportado: {}", ex.getMessage());
        } catch (IllegalArgumentException ex) { // Esta excepción todavía puede ocurrir si el token es null o vacío antes de ser parseado
            logger.error("Las claims del JWT están vacías o el token es inválido: {}", ex.getMessage());
        }
        return false;
    }
}