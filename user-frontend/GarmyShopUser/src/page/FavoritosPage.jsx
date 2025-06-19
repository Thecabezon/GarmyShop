// src/pages/FavoritosPage.js

import React from 'react';
import { Link } from 'react-router-dom';

// --- NUEVO: Importamos la configuración de Cloudinary para las imágenes ---
import { CLOUDINARY_BASE_URL } from '../config/cloudinary';

import '../styles/Tienda.css'; // Asegúrate de que los estilos base de la tienda están importados
import '../styles/Favoritos.css'; // Estilos específicos para esta página

export const FavoritosPage = ({ favoriteItems, handleToggleFavorite }) => {
  return (
    <div className="productos-container">
      <h2 className="productos-titulo">Mis Favoritos</h2>
      
      {favoriteItems && favoriteItems.length > 0 ? (
        <div className="ropa-lista">
          {favoriteItems.map((producto) => {
            // --- CORRECCIÓN: Construimos la URL de la imagen correctamente ---
            const fullImageUrl = producto.imagenPrincipalUrl
              ? `${CLOUDINARY_BASE_URL}/${producto.imagenPrincipalUrl}`
              // Si no la tienes, usa la propiedad 'imagen' que tenías antes
              : producto.imagen || 'https://dummyimage.com/400x500/f0f0f0/ccc&text=No+Imagen';

            return (
              // Usamos la misma estructura de la tarjeta de la tienda para consistencia
              <div key={producto.id || producto.cod} className="ropa-card">
                <div className="ropa-imagen">
                  <Link to={`/tienda/${producto.id || producto.cod}`}>
                    <img src={fullImageUrl} alt={producto.nombre} />
                  </Link>
                </div>
                <div className="ropa-info">
                  <p className="producto-categoria">{producto.categoriaNombre || producto.tipoPrenda}</p>
                  <Link to={`/tienda/${producto.id || producto.cod}`} className="producto-nombre-link">
                    <h5>{producto.nombre}</h5>
                  </Link>
                  <div className="ropa-precio">
                    <span className="precio-actual">S/. {producto.precio.toFixed(2)}</span>
                  </div>
                </div>
                {/* Usamos la misma estructura de botones para consistencia */}
                <div className="ropa-acciones">
                  <Link to={`/tienda/${producto.id || producto.cod}`} className="ver-producto-btn">
                    Ver Producto
                  </Link>
                  <button
                    onClick={() => handleToggleFavorite(producto)}
                    className="me-encanta-btn liked" // Siempre "liked" aquí
                    aria-label="Quitar de favoritos"
                    title="Quitar de favoritos"
                  >
                    {/* --- CORRECCIÓN: Usamos el mismo ícono bonito de la tienda --- */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="corazon-icono">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.5 5.5 0 0 1 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3A5.5 5.5 0 0 1 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // --- DISEÑO MEJORADO PARA CUANDO NO HAY FAVORITOS ---
        <div className="no-favoritos">
           <svg className="no-favoritos-icono" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.5 5.5 0 0 1 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3A5.5 5.5 0 0 1 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <h3>Tu lista de favoritos está vacía</h3>
          <p>Haz clic en el corazón de los productos que te enamoren para guardarlos aquí y no perderlos de vista.</p>
          <Link to="/tienda" className="boton-explorar">
            Descubrir Productos
          </Link>
        </div>
      )}
    </div>
  );
};