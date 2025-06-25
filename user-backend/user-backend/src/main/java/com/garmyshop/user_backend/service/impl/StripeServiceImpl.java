package com.garmyshop.user_backend.service.impl;

import com.garmyshop.user_backend.dto.CrearCheckoutSessionRequestDTO;
import com.garmyshop.user_backend.dto.ItemCheckoutDTO;
import com.garmyshop.user_backend.service.StripeService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
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

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    @Override
    public Session crearCheckoutSession(CrearCheckoutSessionRequestDTO requestDTO) throws StripeException {
        String successUrl = requestDTO.getSuccessUrl();
        String cancelUrl = requestDTO.getCancelUrl();

        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();
        for (ItemCheckoutDTO itemDto : requestDTO.getItems()) {
            SessionCreateParams.LineItem.PriceData.ProductData productData =
                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                    .setName(itemDto.getNombreProducto())
                    .build();

            SessionCreateParams.LineItem.PriceData priceData =
                SessionCreateParams.LineItem.PriceData.builder()
                    .setCurrency(itemDto.getMoneda().toLowerCase())
                    .setUnitAmount((long) (itemDto.getPrecioUnitario().doubleValue() * 100))
                    .setProductData(productData)
                    .build();

            SessionCreateParams.LineItem lineItem =
                SessionCreateParams.LineItem.builder()
                    .setPriceData(priceData)
                    .setQuantity(Long.valueOf(itemDto.getCantidad()))
                    .build();
            lineItems.add(lineItem);
        }        
        Map<String, String> metadata = new HashMap<>();
        metadata.put("orden_id_local", String.valueOf(requestDTO.getOrdenIdLocal()));

        SessionCreateParams params =
            SessionCreateParams.builder()
                .addAllLineItem(lineItems)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .putAllMetadata(metadata)
                .setCustomerEmail(requestDTO.getEmailCliente())
                .build();

        return Session.create(params);
    }

    @Override
    public Session obtenerCheckoutSession(String sessionId) throws StripeException {
        return Session.retrieve(sessionId);
    }
}