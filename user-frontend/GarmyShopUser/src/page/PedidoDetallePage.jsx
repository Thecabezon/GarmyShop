
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import authService from '../components/Auth/authService';
import { CLOUDINARY_BASE_URL } from '../config/cloudinary';
import '../styles/PedidoDetalle.css';
import { API_BASE_URL } from '../config/apiConfig';


const PedidoDetallePage = () => {
    const { ordenId } = useParams();
    const navigate = useNavigate();

    const [orden, setOrden] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!authService.isAuthenticated() || !token) {
            navigate(`/login?redirect=/mis-pedidos/${ordenId}`);
            return;
        }

        const fetchPedidoDetalle = async () => {
            setIsLoading(true);
            setError('');
            try {
                const response = await fetch(`${API_BASE_URL}/api/ordenes/${ordenId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 404) {
                    throw new Error('El pedido no fue encontrado o no te pertenece.');
                }
                if (!response.ok) {
                    throw new Error('No se pudo cargar el detalle del pedido.');
                }

                const data = await response.json();
                setOrden(data);
            } catch (err) {
                console.error('Error al cargar detalle del pedido:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPedidoDetalle();
    }, [ordenId, navigate]);

    const formatEstado = (estado) => {
        if (!estado) return 'Desconocido';
        return estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
    };

    if (isLoading) {
        return (
            <div className="detalle-pedido-container">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Cargando detalle del pedido...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="detalle-pedido-container">
                <div className="error-message">{error}</div>
                <Link to="/mis-pedidos" className="primary-button">Volver a Mis Pedidos</Link>
            </div>
        );
    }
    
    if (!orden) return null;

    return (
        <div className="detalle-pedido-container">
            <div className="pedido-info-header">
                <h1>Detalle del Pedido #{String(orden.id).padStart(6, '0')}</h1>
                <Link to="/mis-pedidos" className="volver-link">‹ Volver a Mis Pedidos</Link>
            </div>
            
            <div className="pedido-info-sub-header">
                <span>Fecha: {new Date(orden.fechaCreacion).toLocaleDateString('es-ES')}</span>
                <span className={`estado-badge ${orden.estado?.toLowerCase()}`}>{formatEstado(orden.estado)}</span>
                <span className={`pago-badge ${orden.estadoPago?.toLowerCase()}`}>{formatEstado(orden.estadoPago)}</span>
            </div>

            <div className="detalle-layout">
                <div className="productos-lista">
                    <h3>Productos</h3>
                    {orden.items.map(item => (
                        <div key={item.id} className="producto-item-detalle">
                            <img 
                                src={`${CLOUDINARY_BASE_URL}/${item.productoImagenUrl}`} 
                                alt={item.productoNombre} 
                                className="producto-imagen-detalle"
                            />
                            <div className="producto-info-detalle">
                                <p className="nombre">{item.productoNombre}</p>
                                <p className="sku">SKU: {item.skuCombinacion}</p>
                                <p className="variantes">Talla: {item.tallaNombre} / Color: {item.colorNombre}</p>
                            </div>
                            <div className="producto-precio-detalle">
                                <p>{item.cantidad} x S/ {item.precioUnitario.toFixed(2)}</p>
                                <p className="subtotal">S/ {item.subtotal.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="resumen-y-direccion">
                    <div className="detalle-seccion">
                        <h3>Dirección de Envío</h3>
                        <p>{orden.direccionEnvio.nombre} {orden.direccionEnvio.apellido}</p>
                        <p>{orden.direccionEnvio.calle}, {orden.direccionEnvio.distrito}</p>
                        <p>{orden.direccionEnvio.provincia}, {orden.direccionEnvio.departamento}</p>
                        <p>Código Postal: {orden.direccionEnvio.codigoPostal}</p>
                        <p>Teléfono: {orden.direccionEnvio.telefono}</p>
                    </div>

                    <div className="detalle-seccion">
                        <h3>Resumen de Pago</h3>
                        <div className="resumen-linea">
                            <span>Subtotal:</span>
                            <span>S/ {orden.total.toFixed(2)}</span>
                        </div>
                        <div className="resumen-linea">
                            <span>Envío:</span>
                            <span>Gratis</span>
                        </div>
                        <div className="resumen-linea total-final">
                            <span>Total:</span>
                            <span>S/ {orden.total.toFixed(2)}</span>
                        </div>
                        <p className="metodo-pago">Pagado con: {formatEstado(orden.metodoPago)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PedidoDetallePage;