package com.garmyshop.user_backend.service;

import com.garmyshop.user_backend.dto.CrearCheckoutSessionRequestDTO; // Necesitaremos este DTO
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session; // Import de Stripe

public interface StripeService {

    /**
     * Crea una sesión de Stripe Checkout.
     *
     * @param requestDTO Datos necesarios para crear la sesión de checkout (ej. items, URLs de éxito/cancelación, ID de orden local).
     * @return El objeto Session de Stripe que contiene el ID de la sesión para redirigir al usuario.
     * @throws StripeException Si ocurre un error al comunicarse con la API de Stripe.
     */
    Session crearCheckoutSession(CrearCheckoutSessionRequestDTO requestDTO) throws StripeException;
    Session obtenerCheckoutSession(String sessionId) throws StripeException;
}