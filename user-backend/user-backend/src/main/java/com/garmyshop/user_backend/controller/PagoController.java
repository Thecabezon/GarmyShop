package com.garmyshop.user_backend.controller;

import com.garmyshop.user_backend.dto.CrearCheckoutSessionRequestDTO;
import com.garmyshop.user_backend.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // Para obtener info del usuario si es necesario
import org.springframework.security.core.context.SecurityContextHolder; // Para obtener info del usuario si es necesario
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.garmyshop.user_backend.dto.OrdenDetailDTO; // Necesario para el tipo de respuesta
import com.garmyshop.user_backend.service.OrdenService;

import java.util.HashMap; // Para la respuesta
import java.util.Map;    // Para la respuesta
import java.util.Optional; // Para manejar la respuesta de la orden actualizada

@RestController
@RequestMapping("/api/pagos") // Ruta base para los endpoints de pago
public class PagoController {

    private static final Logger logger = LoggerFactory.getLogger(PagoController.class);
    private final StripeService stripeService;
    private final OrdenService ordenService;

    public PagoController(StripeService stripeService, OrdenService ordenService) {
        this.stripeService = stripeService;
        this.ordenService = ordenService;
    }


    /**
     * Endpoint para crear una sesión de Stripe Checkout.
     * El frontend llamará a este endpoint cuando el usuario esté listo para pagar una orden.
     *
     * @param requestDTO Contiene los ítems de la orden, URLs de éxito/cancelación, y el ID de la orden local.
     * @return ResponseEntity con el ID de la sesión de Stripe para que el frontend pueda redirigir,
     *         o un error si la creación de la sesión falla.
     */
    @PostMapping("/crear-checkout-session")
    public ResponseEntity<?> crearCheckoutSession(@RequestBody CrearCheckoutSessionRequestDTO requestDTO) {
        // Opcional: Obtener el email del usuario autenticado si no viene en el requestDTO
        // y quieres asegurarte de que el pago se asocia al usuario correcto
        // o si el requestDTO no incluye el email.
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = requestDTO.getEmailCliente(); // Usamos el email del DTO por ahora

        if (userEmail == null && authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal().toString())) {
            // Podrías obtener el email del 'authentication.getName()' si es el email
            // o buscar el AuthUser y obtener su email.
            // Por ahora, asumimos que el frontend envía el email en requestDTO.
            // Si no, necesitarías lógica para obtenerlo.
        }
        
        if (userEmail == null || userEmail.trim().isEmpty()) {
            // Considera si el email es estrictamente obligatorio. Stripe lo recomienda.
            // return ResponseEntity.badRequest().body("El email del cliente es requerido para la sesión de checkout.");
        }


        try {
            Session stripeSession = stripeService.crearCheckoutSession(requestDTO);
            
            // Devolvemos el ID de la sesión de Stripe.
            // El frontend usará este ID para redirigir al usuario a la página de Stripe Checkout
            // usando stripe.redirectToCheckout({ sessionId: 'EL_ID_DE_LA_SESION_AQUI' });
            Map<String, String> responseData = new HashMap<>();
            responseData.put("sessionId", stripeSession.getId());
            // También podrías devolver la stripeSession.getUrl() si prefieres que el frontend use esa URL directamente.
            // responseData.put("checkoutUrl", stripeSession.getUrl());

            return ResponseEntity.ok(responseData);

        } catch (StripeException e) {
            logger.error("Error al crear la sesión de Stripe Checkout: {}", e.getMessage());
            // Devolver un mensaje de error genérico al cliente
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                    .body("Error al procesar el pago: " + e.getMessage());
        } catch (Exception e) {
            // Captura para cualquier otra excepción inesperada
            logger.error("Error inesperado al crear la sesión de checkout: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                    .body("Error interno del servidor al procesar la solicitud de pago.");
        }
    }



    /**
     * Endpoint para confirmar un pago de Stripe y actualizar la orden local.
     * El frontend llamará a este endpoint desde su página de éxito,
     * pasando el session_id de Stripe obtenido de la URL.
     *
     * @param payload Un objeto JSON que contiene el "sessionId" de Stripe.
     * @return ResponseEntity con los detalles de la orden actualizada o un error.
     */
    @PostMapping("/confirmar-pago-stripe")
    public ResponseEntity<?> confirmarPagoStripe(@RequestBody Map<String, String> payload) {
        String sessionId = payload.get("sessionId");

        if (sessionId == null || sessionId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El sessionId de Stripe es requerido.");
        }

        try {
            // 1. Obtener la sesión de Stripe para verificarla y obtener metadata
            Session stripeSession = stripeService.obtenerCheckoutSession(sessionId);

            // 2. Verificar el estado del pago de la sesión de Stripe
            if ("paid".equalsIgnoreCase(stripeSession.getPaymentStatus())) {
                // 3. Obtener el ID de nuestra orden local desde los metadata de la sesión de Stripe
                String ordenIdLocalStr = stripeSession.getMetadata().get("orden_id_local");
                if (ordenIdLocalStr == null) {
                    logger.error("No se encontró 'orden_id_local' en los metadata de la sesión de Stripe: {}", sessionId);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                            .body("Información de la orden local no encontrada en la sesión de Stripe.");
                }
                Integer ordenIdLocal = Integer.parseInt(ordenIdLocalStr);

                // 4. Confirmar el pago en nuestro sistema y actualizar la orden
                Optional<OrdenDetailDTO> ordenActualizadaOpt = ordenService.confirmarPagoOrden(ordenIdLocal, sessionId);
                
                if (ordenActualizadaOpt.isPresent()) {
                    return ResponseEntity.ok(ordenActualizadaOpt.get());
                } else {
                    // Esto sería raro si la orden existía y la confirmación debía tener éxito
                    logger.error("No se pudo confirmar el pago para la orden local ID {} asociada con la sesión de Stripe {}", ordenIdLocal, sessionId);
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                            .body("No se pudo actualizar la orden después de confirmar el pago.");
                }

            } else {
                // El pago no está confirmado en Stripe (podría ser "unpaid", "no_payment_required")
                logger.warn("Intento de confirmar pago para sesión de Stripe no pagada. SessionId: {}, PaymentStatus: {}", 
                            sessionId, stripeSession.getPaymentStatus());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body("El pago para esta sesión no ha sido completado en Stripe. Estado: " + stripeSession.getPaymentStatus());
            }

        } catch (StripeException e) {
            logger.error("Error al obtener la sesión de Stripe para confirmación: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE) // O INTERNAL_SERVER_ERROR
                                    .body("Error al comunicarse con Stripe para verificar el pago: " + e.getMessage());
        } catch (NumberFormatException e) {
            logger.error("Error al convertir orden_id_local de metadata a Integer. SessionId: {}", sessionId);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                    .body("Error en los datos de la sesión de Stripe (orden_id_local inválido).");
        } catch (Exception e) {
            logger.error("Error inesperado al confirmar el pago de Stripe: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                    .body("Error interno del servidor al procesar la confirmación del pago.");
        }
    }
}