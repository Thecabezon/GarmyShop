// src/page/MisPedidosPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/MisPedidos.css';
import authService from '../components/Auth/authService';
import { API_BASE_URL } from '../config/apiConfig';


const MisPedidosPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!authService.isAuthenticated() || !token) {
      navigate('/login?redirect=/mis-pedidos');
      return;
    }

    const fetchPedidos = async () => {
      setIsLoading(true);
      setError('');
     
      try {
        // Hacemos la llamada real al endpoint del backend
        const response = await fetch(`${API_BASE_URL}/api/ordenes`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('No se pudieron cargar tus pedidos. Inténtalo de nuevo más tarde.');
        }

        const data = await response.json();
        // El endpoint devuelve un objeto de paginación, los pedidos están en 'content'
        setPedidos(data.content); 

      } catch (err) {
        console.error('Error al cargar pedidos:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPedidos();
  }, [navigate]);

  const formatEstado = (estado) => {
    if (!estado) return 'Desconocido';
    return estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
  };

  if (isLoading) {
    return (
      <div className="pedidos-container">
        <h1>Mis Pedidos</h1>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando tus pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pedidos-container">
        <h1>Mis Pedidos</h1>
        <div className="error-message">{error}</div>
        <button onClick={() => window.location.reload()} className="primary-button">
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="pedidos-container">
      <h1>Mis Pedidos</h1>
     
      {pedidos.length === 0 ? (
        <div className="no-pedidos">
          <i className="bi bi-box-seam no-pedidos-icon"></i>
          <h3>Aún no tienes pedidos</h3>
          <p>¡Explora nuestra tienda y encuentra algo que te encante!</p>
          <Link to="/tienda" className="primary-button">
            Ir a la Tienda
          </Link>
        </div>
      ) : (
        <div className="pedidos-list">
          {pedidos.map(pedido => (
            <div key={pedido.id} className="pedido-card">
              <div className="pedido-header">
                <div className="pedido-info">
                  <h3>Pedido #{String(pedido.id).padStart(6, '0')}</h3>
                  <p className="pedido-fecha">
                    Fecha: {new Date(pedido.fechaCreacion).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div className="pedido-estado">
                  <span className={`estado-badge ${pedido.estado?.toLowerCase().replace(' ', '-')}`}>
                    {formatEstado(pedido.estado)}
                  </span>
                </div>
              </div>
             
              <div className="pedido-items-summary">
                <p>{pedido.cantidadTotalItems} {pedido.cantidadTotalItems === 1 ? 'producto' : 'productos'}</p>
              </div>
             
              <div className="pedido-footer">
                <div className="pedido-total">
                  <p>Total:</p>
                  <p className="total-amount">S/ {pedido.total.toFixed(2)}</p>
                </div>
                {/* En el futuro, este enlace irá a una página de detalle del pedido */}
                <Link to={`/mis-pedidos/${pedido.id}`} className="ver-detalles-button">
                  Ver detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisPedidosPage;