
import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import '../styles/PagoExitoso.css';

const PagoConfirmadoCEPage = () => {
    const location = useLocation();
    const orden = location.state?.orden;

    if (!orden) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="pago-status-page">
            <div className="status-container success">
                <div className="success-icon">✓</div>
                <h2>¡Orden Recibida!</h2>
                <p>Gracias por tu compra. Hemos registrado tu pedido y lo estamos preparando para el envío.</p>
                {orden && (
                    <>
                        <p>Tu número de orden es: <strong>#{String(orden.id).padStart(6, '0')}</strong></p>
                        <div className="cod-instructions">
                            <h3>Instrucciones de Pago</h3>
                            <p>
                                Por favor, prepara el monto exacto de <strong>S/ {orden.total.toFixed(2)}</strong> para pagar en efectivo al momento de recibir tu paquete.
                            </p>
                        </div>
                    </>
                )}
                <div className="actions">
                    <Link to="/mis-pedidos" className="primary-button">Ver Mis Pedidos</Link>
                    <Link to="/tienda" className="secondary-button">Seguir Comprando</Link>
                </div>
            </div>
        </div>
    );
};

export default PagoConfirmadoCEPage;