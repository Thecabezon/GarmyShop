import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Tienda.css'; // Reutilizamos los estilos de la tienda
import '../styles/Favoritos.css'; // Añadiremos estilos específicos

// Este componente muestra la lista de productos favoritos.
// Recibe la lista y la función para añadir/quitar.
export const FavoritosPage = ({ favoriteItems, handleToggleFavorite }) => {
  return (
    <div className="productos-container">
      <h2 className="productos-titulo">Mis Favoritos</h2>
      
      {favoriteItems.length > 0 ? (
        <div className="ropa-lista">
          {favoriteItems.map((producto) => (
            <div key={producto.cod} className="ropa-card">
              <div className="ropa-imagen">
                <Link to={`/tienda/${producto.cod}`}>
                  <img src={producto.imagen} alt={producto.nombre} />
                </Link>
              </div>
              <div className="ropa-info">
                <h5>{producto.nombre}</h5>
                <p className="producto-categoria">{producto.tipoPrenda}</p>
                <div className="ropa-precio">
                  <span className="precio-actual">S/. {producto.precio.toFixed(2)}</span>
                </div>
                <div className="botones-fila">
                  <Link to={`/tienda/${producto.cod}`} className="ver-detalle-completo-btn">
                    Ver Producto
                  </Link>
                  <button
                    onClick={() => handleToggleFavorite(producto)}
                    className="me-encanta-btn liked" // El corazón siempre estará relleno aquí
                    aria-label="Quitar de favoritos"
                    title="Quitar de favoritos"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="corazon-icono">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.5 5.5 0 0 1 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3A5.5 5.5 0 0 1 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-favoritos">
          <h3>Aún no tienes productos favoritos.</h3>
          <p>Haz clic en el corazón de los productos que te gusten para guardarlos aquí.</p>
          <Link to="/tienda" className="boton-explorar">
            Explorar Tienda
          </Link>
        </div>
      )}
    </div>
  );
};