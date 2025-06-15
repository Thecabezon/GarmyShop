package com.garmyshop.user_backend.controller;

import com.garmyshop.user_backend.dto.AuthResponseDTO;
import com.garmyshop.user_backend.dto.LoginRequestDTO;
import com.garmyshop.user_backend.dto.RegistroRequestDTO;
// import com.garmyshop.user_backend.dto.UsuarioDTO; // Si tuviéramos un endpoint de perfil aquí
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

    // Podríamos añadir un endpoint para el perfil del usuario autenticado aquí
    // o en un UsuarioController dedicado.
    /*
    @GetMapping("/perfil")
    public ResponseEntity<UsuarioDTO> obtenerPerfilUsuarioActual() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String currentUsername = authentication.getName();
        return authUserService.obtenerPerfilUsuario(currentUsername)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    */
}