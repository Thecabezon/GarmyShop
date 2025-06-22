package com.garmyshop.user_backend.service.impl;

import com.garmyshop.user_backend.dto.CrearCheckoutSessionRequestDTO;
import com.garmyshop.user_backend.dto.ItemCheckoutDTO;
import com.garmyshop.user_backend.service.StripeService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct; // Para inicializar la API key de Stripe
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StripeServiceImpl implements StripeService {

    @Value("${stripe.apiKey.secret}")
    private String stripeSecretKey;

    @PostConstruct // Este método se ejecuta después de que se inyectan las dependencias
    public void init() {
        Stripe.apiKey = stripeSecretKey; // Configura la clave API globalmente para la librería Stripe
    }

    @Override
    public Session crearCheckoutSession(CrearCheckoutSessionRequestDTO requestDTO) throws StripeException {
        // URLs de redirección (deben ser URLs completas)
        String successUrl = requestDTO.getSuccessUrl(); // Ej. "http://localhost:3000/pago-exitoso?session_id={CHECKOUT_SESSION_ID}"
        String cancelUrl = requestDTO.getCancelUrl();   // Ej. "http://localhost:3000/pago-cancelado"

        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();
        for (ItemCheckoutDTO itemDto : requestDTO.getItems()) {
            SessionCreateParams.LineItem.PriceData.ProductData productData =
                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                    .setName(itemDto.getNombreProducto())
                    // .setDescription(itemDto.getDescripcionProducto()) // Opcional
                    // .addImage(itemDto.getImagenProductoUrl()) // Opcional
                    .build();

            SessionCreateParams.LineItem.PriceData priceData =
                SessionCreateParams.LineItem.PriceData.builder()
                    .setCurrency(itemDto.getMoneda().toLowerCase()) // Stripe espera la moneda en minúsculas, ej. "pen", "usd"
                    .setUnitAmount((long) (itemDto.getPrecioUnitario().doubleValue() * 100)) // Stripe espera el monto en centavos/la menor unidad
                    .setProductData(productData)
                    .build();

            SessionCreateParams.LineItem lineItem =
                SessionCreateParams.LineItem.builder()
                    .setPriceData(priceData)
                    .setQuantity(Long.valueOf(itemDto.getCantidad()))
                    .build();
            lineItems.add(lineItem);
        }
        
        // Metadata para asociar la sesión de Stripe con tu orden local
        Map<String, String> metadata = new HashMap<>();
        metadata.put("orden_id_local", String.valueOf(requestDTO.getOrdenIdLocal()));

        SessionCreateParams params =
            SessionCreateParams.builder()
                .addAllLineItem(lineItems)
                .setMode(SessionCreateParams.Mode.PAYMENT) // Para pagos únicos
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .putAllMetadata(metadata) // Añadir metadata
                .setCustomerEmail(requestDTO.getEmailCliente()) // Opcional pero recomendado
                // Podrías añadir más opciones como envío, impuestos, etc.
                .build();

        return Session.create(params);
    }

    @Override // <<< NUEVO MÉTODO
    public Session obtenerCheckoutSession(String sessionId) throws StripeException {
        // Asegúrate de que Stripe.apiKey ya ha sido configurado en el método init()
        return Session.retrieve(sessionId);
    }
}