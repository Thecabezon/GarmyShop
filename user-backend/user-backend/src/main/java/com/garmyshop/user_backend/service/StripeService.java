package com.garmyshop.user_backend.service;

import com.garmyshop.user_backend.dto.CrearCheckoutSessionRequestDTO;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;

public interface StripeService {

    /**
     * Crea una sesión de Stripe Checkout.
     * @param requestDTO
     * @return
     * @throws StripeException
     */
    Session crearCheckoutSession(CrearCheckoutSessionRequestDTO requestDTO) throws StripeException;
    Session obtenerCheckoutSession(String sessionId) throws StripeException;
}