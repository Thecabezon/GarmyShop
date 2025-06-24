
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/MisPedidos.css'; // Crearemos este archivo después
import authService from '../Auth/authService';

const MisPedidosPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Función para cargar los pedidos
    const fetchPedidos = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // Aquí iría la llamada a la API para obtener los pedidos del usuario
        // Por ahora, usamos datos de ejemplo
        const mockPedidos = [
          {
            id: 'ORD-12345',
            fecha: '2023-05-15',
            estado: 'Entregado',
            total: 159.90,
            items: [
              { id: 1, nombre: 'Camiseta Básica', cantidad: 2, precio: 39.95 },
              { id: 2, nombre: 'Pantalón Vaquero', cantidad: 1, precio: 79.95 }
            ]
          },
          {
            id: 'ORD-12346',
            fecha: '2023-06-20',
            estado: 'En proceso',
            total: 89.95,
            items: [
              { id: 3, nombre: 'Zapatillas Deportivas', cantidad: 1, precio: 89.95 }
            ]
          }
        ];
        
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setPedidos(mockPedidos);
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
        setError('No se pudieron cargar tus pedidos. Inténtalo de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPedidos();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="pedidos-container">
        <h1>Mis Pedidos</h1>
        <div className="loading-spinner">Cargando tus pedidos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pedidos-container">
        <h1>Mis Pedidos</h1>
        <div className="error-message">{error}</div>
        <button onClick={() => window.location.reload()} className="retry-button">
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
          <p>No tienes pedidos realizados.</p>
          <Link to="/tienda" className="shop-now-button">
            Comprar ahora
          </Link>
        </div>
      ) : (
        <div className="pedidos-list">
          {pedidos.map(pedido => (
            <div key={pedido.id} className="pedido-card">
              <div className="pedido-header">
                <div className="pedido-info">
                  <h3>Pedido #{pedido.id}</h3>
                  <p className="pedido-fecha">Fecha: {new Date(pedido.fecha).toLocaleDateString()}</p>
                </div>
                <div className="pedido-estado">
                  <span className={`estado-badge ${pedido.estado.toLowerCase().replace(' ', '-')}`}>
                    {pedido.estado}
                  </span>
                </div>
              </div>
              
              <div className="pedido-items">
                {pedido.items.map(item => (
                  <div key={item.id} className="pedido-item">
                    <div className="item-details">
                      <p className="item-name">{item.nombre}</p>
                      <p className="item-quantity">Cantidad: {item.cantidad}</p>
                    </div>
                    <p className="item-price">S/ {item.precio.toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="pedido-footer">
                <div className="pedido-total">
                  <p>Total:</p>
                  <p className="total-amount">S/ {pedido.total.toFixed(2)}</p>
                </div>
                <Link to={`/pedido/${pedido.id}`} className="ver-detalles-button">
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