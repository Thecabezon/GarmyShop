package com.garmyshop.user_backend.controller;

import com.garmyshop.user_backend.dto.AuthResponseDTO;
import com.garmyshop.user_backend.dto.LoginRequestDTO;
import com.garmyshop.user_backend.dto.RegistroRequestDTO;
import com.garmyshop.user_backend.dto.UsuarioDTO;
import com.garmyshop.user_backend.entity.AuthUser;
import com.garmyshop.user_backend.security.JwtTokenProvider;
import com.garmyshop.user_backend.service.AuthUserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.core.userdetails.UserDetails; // Para obtener el UserDetails del Authentication
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/auth") // Ruta base para autenticación
public class AuthController {

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

    /**
     * Endpoint para registrar un nuevo usuario.
     * POST /api/auth/registro
     *
     * @param registroRequestDTO Datos del usuario para el registro.
     * @return ResponseEntity con un mensaje de éxito o error.
     */
    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody RegistroRequestDTO registroRequestDTO) {
        try {
            authUserService.registrarUsuario(registroRequestDTO);
            return ResponseEntity.ok("¡Usuario registrado exitosamente!");
        } catch (RuntimeException ex) {
            // Podrías tener un manejo de excepciones más granular aquí
            // o un @ControllerAdvice global para manejar excepciones personalizadas.
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    /**
     * Endpoint para autenticar un usuario e iniciar sesión.
     * POST /api/auth/login
     *
     * @param loginRequestDTO Credenciales de inicio de sesión.
     * @return ResponseEntity con AuthResponseDTO (incluyendo el token JWT) o un error.
     */
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

            // Obtener detalles del usuario para la respuesta
            // UserDetails userDetails = (UserDetails) authentication.getPrincipal(); // Obtenemos el UserDetails de Spring
            AuthUser authUser = authUserService.encontrarPorUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Error al obtener detalles del usuario después del login"));


            // Si necesitas roles en el DTO de respuesta:
            // List<String> roles = userDetails.getAuthorities().stream()
            //        .map(item -> item.getAuthority())
            //        .collect(Collectors.toList());

            // Usamos el constructor que definimos para AuthResponseDTO
            return ResponseEntity.ok(new AuthResponseDTO(jwt, authUser.getId(), authUser.getUsername(), authUser.getEmail() /*, roles */));

        } catch (Exception ex) {
            // Manejar excepciones de autenticación (ej. BadCredentialsException)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error de autenticación: Credenciales inválidas.");
        }
    }

    /**
     * Endpoint para obtener el perfil del usuario actualmente autenticado.
     * GET /api/auth/perfil
     * Requiere que el usuario esté autenticado (token JWT válido).
     *
     * @return ResponseEntity con UsuarioDTO si está autenticado, o 401/404.
     */
    @GetMapping("/perfil")
    // @PreAuthorize("isAuthenticated()") // Alternativa para asegurar que esté autenticado (si tienes @EnableMethodSecurity)
    public ResponseEntity<UsuarioDTO> obtenerPerfilUsuarioActual() {
        // Obtener el objeto Authentication del contexto de seguridad
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Verificar si el usuario está autenticado y no es el "anonymousUser"
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal().toString())) {
            // Esto no debería suceder si el endpoint está correctamente protegido por Spring Security
            // y el filtro JWT funciona, pero es una buena doble verificación.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // El nombre del principal es usualmente el username
        String currentUsername = authentication.getName();

        return authUserService.obtenerPerfilUsuario(currentUsername)
                .map(ResponseEntity::ok) // Si el DTO se encuentra, devuelve 200 OK con el DTO
                .orElseGet(() -> {
                    // Esto sería raro si el usuario está autenticado pero no se encuentra su perfil
                    // Podría indicar un problema de sincronización o que el usuario fue eliminado
                    // mientras su token aún era válido (menos probable con JWTs cortos).
                    // Devolver 404 Not Found tiene sentido aquí.
                    return ResponseEntity.notFound().build();
                });
    }

}