package com.garmyshop.user_backend.controller;

import com.garmyshop.user_backend.dto.CrearCheckoutSessionRequestDTO;
import com.garmyshop.user_backend.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.garmyshop.user_backend.dto.OrdenDetailDTO;
import com.garmyshop.user_backend.service.OrdenService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/pagos")
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
     * @param requestDTO
     * @return
     */
    @PostMapping("/crear-checkout-session")
    public ResponseEntity<?> crearCheckoutSession(@RequestBody CrearCheckoutSessionRequestDTO requestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = requestDTO.getEmailCliente();

        if (userEmail == null && authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal().toString())) {

        }
        
        if (userEmail == null || userEmail.trim().isEmpty()) {

        }


        try {
            Session stripeSession = stripeService.crearCheckoutSession(requestDTO);
            
            Map<String, String> responseData = new HashMap<>();
            responseData.put("sessionId", stripeSession.getId());

            return ResponseEntity.ok(responseData);

        } catch (StripeException e) {
            logger.error("Error al crear la sesión de Stripe Checkout: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                    .body("Error al procesar el pago: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error inesperado al crear la sesión de checkout: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                    .body("Error interno del servidor al procesar la solicitud de pago.");
        }
    }



    /**
     * Endpoint para confirmar un pago de Stripe y actualizar la orden local.
     * @param payload
     * @return
     */
    @PostMapping("/confirmar-pago-stripe")
    public ResponseEntity<?> confirmarPagoStripe(@RequestBody Map<String, String> payload) {
        String sessionId = payload.get("sessionId");

        if (sessionId == null || sessionId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El sessionId de Stripe es requerido.");
        }

        try {
            Session stripeSession = stripeService.obtenerCheckoutSession(sessionId);

            if ("paid".equalsIgnoreCase(stripeSession.getPaymentStatus())) {
                String ordenIdLocalStr = stripeSession.getMetadata().get("orden_id_local");
                if (ordenIdLocalStr == null) {
                    logger.error("No se encontró 'orden_id_local' en los metadata de la sesión de Stripe: {}", sessionId);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                            .body("Información de la orden local no encontrada en la sesión de Stripe.");
                }
                Integer ordenIdLocal = Integer.parseInt(ordenIdLocalStr);

                Optional<OrdenDetailDTO> ordenActualizadaOpt = ordenService.confirmarPagoOrden(ordenIdLocal, sessionId);
                
                if (ordenActualizadaOpt.isPresent()) {
                    return ResponseEntity.ok(ordenActualizadaOpt.get());
                } else {
                    logger.error("No se pudo confirmar el pago para la orden local ID {} asociada con la sesión de Stripe {}", ordenIdLocal, sessionId);
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                            .body("No se pudo actualizar la orden después de confirmar el pago.");
                }

            } else {
                logger.warn("Intento de confirmar pago para sesión de Stripe no pagada. SessionId: {}, PaymentStatus: {}", 
                            sessionId, stripeSession.getPaymentStatus());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body("El pago para esta sesión no ha sido completado en Stripe. Estado: " + stripeSession.getPaymentStatus());
            }

        } catch (StripeException e) {
            logger.error("Error al obtener la sesión de Stripe para confirmación: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
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