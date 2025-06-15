package com.garmyshop.user_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
// Más adelante añadiremos el filtro JWT aquí:
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// import com.garmyshop.user_backend.security.JwtAuthenticationFilter; // Suponiendo que lo creemos aquí

@Configuration // Indica que esta clase contiene definiciones de beans de configuración
@EnableWebSecurity // Habilita la seguridad web de Spring Security en el proyecto
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true) // Habilita la seguridad a nivel de método (opcional pero útil)
public class SecurityConfig {

    // Más adelante inyectaremos el JwtAuthenticationFilter aquí
    // private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
    // this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    // }
    // Por ahora, un constructor vacío o sin parámetros si no hay filtro JWT aún.
    public SecurityConfig() {
    }


    @Bean // Expone el PasswordEncoder como un bean gestionado por Spring
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean // Expone el AuthenticationManager como un bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean // Define la cadena de filtros de seguridad principal
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Deshabilitar CSRF (Cross-Site Request Forgery) ya que usaremos tokens JWT (stateless)
            // Si tu API va a ser consumida por navegadores directamente y no solo por un SPA/móvil, podrías necesitar CSRF.
            .csrf(csrf -> csrf.disable())

            // Configurar la gestión de sesiones como STATELESS, ya que JWT es stateless
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Configurar la autorización de peticiones HTTP
            .authorizeHttpRequests(authorize -> authorize
                    // Permitir acceso público a los endpoints de autenticación y registro
                    .requestMatchers("/api/auth/**").permitAll()

                    // Permitir acceso público a la documentación de Swagger/OpenAPI
                    .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-resources/**", "/webjars/**").permitAll()

                    // Permitir acceso público (GET) a los endpoints de catálogo (categorías, productos, etc.)
                    .requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/marcas/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/colores/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/tallas/**").permitAll()
                    
                    // Cualquier otra petición debe estar autenticada
                    .anyRequest().authenticated()
            );

            // Más adelante, cuando tengamos el filtro JWT, lo añadiremos aquí:
            // .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}