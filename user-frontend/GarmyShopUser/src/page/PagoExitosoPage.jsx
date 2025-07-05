
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import authService from '../components/Auth/authService';
import '../styles/PagoExitoso.css'; // Crearemos este archivo CSS

const API_BASE_URL = 'https://garmyshop-user-backend.onrender.com';

const PagoExitosoPage = ({ setCartItems }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState('processing');
    const [error, setError] = useState(null);
    const [orden, setOrden] = useState(null);

    useEffect(() => {
        const sessionId = searchParams.get('session_id');
        const token = localStorage.getItem('token');

        if (!sessionId || !token) {
            setError('Faltan datos para confirmar el pago. Sesión inválida.');
            setStatus('error');
            return;
        }

        const confirmarPago = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/pagos/confirmar-pago-stripe`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ sessionId: sessionId })
                });

                if (!response.ok) {
                    const errorData = await response.text();
                    throw new Error(errorData || 'Hubo un problema al confirmar tu pago.');
                }
                
                const ordenConfirmada = await response.json();
                setOrden(ordenConfirmada);
                setStatus('success');
                
                // Limpiar el carrito después de una confirmación exitosa
                setCartItems([]); // Esto actualiza el estado en App.jsx y localStorage
                
            } catch (err) {
                console.error("Error al confirmar pago:", err);
                setError(err.message);
                setStatus('error');
            }
        };

        confirmarPago();
    }, [searchParams, setCartItems, navigate]);


    const renderContent = () => {
        switch (status) {
            case 'processing':
                return (
                    <div className="status-container">
                        <div className="spinner"></div>
                        <h2>Procesando tu pago...</h2>
                        <p>Estamos confirmando tu transacción. Por favor, no cierres esta ventana.</p>
                    </div>
                );
            case 'success':
                return (
                    <div className="status-container success">
                        <div className="success-icon">✓</div>
                        <h2>¡Pago Exitoso!</h2>
                        <p>Gracias por tu compra. Hemos recibido tu pago y tu orden ya está en proceso.</p>
                        {orden && <p>Tu número de orden es: <strong>#{orden.id}</strong></p>}
                        <div className="actions">
                            <Link to="/mis-pedidos" className="primary-button">Ver Mis Pedidos</Link>
                            <Link to="/tienda" className="secondary-button">Seguir Comprando</Link>
                        </div>
                    </div>
                );
            case 'error':
                return (
                    <div className="status-container error">
                        <div className="error-icon">✗</div>
                        <h2>Error en la Confirmación</h2>
                        <p>Hubo un problema al confirmar tu pago.</p>
                        {error && <p className="error-message">Detalle: {error}</p>}
                        <div className="actions">
                            <Link to="/ayuda" className="secondary-button">Contactar a Soporte</Link>
                            <Link to="/tienda" className="primary-button">Volver a la Tienda</Link>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="pago-status-page">
            {renderContent()}
        </div>
    );
};

export default PagoExitosoPage;