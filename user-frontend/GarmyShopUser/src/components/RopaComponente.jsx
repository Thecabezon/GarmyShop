
import { Link } from "react-router-dom";
import React, { useState } from 'react';
import { CLOUDINARY_BASE_URL } from '../config/cloudinary';
import PriceDisplay from './ofertas/PriceDisplay';

export function RopaComponente({ producto, isLiked, handleOpenModal, handleToggleFavorite }) {
  const { id, nombre, imagenPrincipalUrl, precio, precioOferta, categoriaNombre } = producto;
  
  // Estado para controlar si se está cargando el producto
  const [isLoading, setIsLoading] = useState(false);

  // Función para manejar el clic en "Agregar al carrito"
  const handleAddToCartClick = async () => {
    setIsLoading(true);
    try {
      // Obtener los detalles completos del producto antes de abrir el modal
      const response = await fetch(`http://localhost:8085/api/productos/${id}`);
      if (!response.ok) {
        throw new Error('No se pudieron cargar los detalles del producto.');
      }
      const productoCompleto = await response.json();
      
      // Ahora que tenemos los datos completos, abrimos el modal
      handleOpenModal(productoCompleto);
    } catch (error) {
      console.error("Error al obtener detalles del producto:", error);
      alert('Hubo un error al cargar el producto. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const fullImageUrl = imagenPrincipalUrl
    ? `${CLOUDINARY_BASE_URL}/${imagenPrincipalUrl}`
    : 'https://dummyimage.com/400x500/f0f0f0/ccc&text=No+Imagen';

  return (
    <div className="ropa-card">
      <div className="ropa-imagen">
        <Link to={`/producto/${id}`} aria-label={`Ver detalles de ${nombre}`}>
          <img src={fullImageUrl} alt={nombre} loading="lazy" />
        </Link>
        <button
          onClick={() => handleToggleFavorite(producto)}
          className={`me-encanta-btn ${isLiked ? 'liked' : ''}`}
          aria-label="Añadir a favoritos"
          title="Añadir a favoritos"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="corazon-icono">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.5 5.5 0 0 1 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3A5.5 5.5 0 0 1 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>
      
      <div className="ropa-info">
        <p className="producto-categoria">{categoriaNombre || 'Categoría'}</p>
        <Link to={`/producto/${id}`} className="producto-nombre-link">
          <h5>{nombre}</h5>
        </Link>
        
        <div className="ropa-precio">
          <PriceDisplay regularPrice={precio} offerPrice={precioOferta} />
        </div>
      </div>
      
      <div className="ropa-acciones">
        <button 
          onClick={handleAddToCartClick} 
          className="agregar-carrito-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : 'Agregar al carrito'}
        </button>
        <Link to={`/producto/${id}`} className="ver-detalle-btn" aria-label="Ver detalle" title="Ver detalle">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="2" fill="none"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}