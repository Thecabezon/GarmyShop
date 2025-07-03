// src/components/RopaComponente.jsx (CÓDIGO COMPLETO Y FUNCIONAL)

import { Link, useNavigate, useLocation } from "react-router-dom";
import React from 'react';
import { toast } from 'react-toastify';
import { CLOUDINARY_BASE_URL } from '../config/cloudinary';
import PriceDisplay from './ofertas/PriceDisplay';

export function RopaComponente({ producto, isLiked, handleOpenModal, handleToggleFavorite, isAuthenticated }) {
  const { id, nombre, imagenPrincipalUrl, precio, precioOferta, categoriaNombre } = producto;
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddToCartClick = () => {
    handleOpenModal(producto); 
  };

  const handleFavoriteClick = () => {
    if (isAuthenticated) {
      handleToggleFavorite(producto);
    } else {
      toast.info('Debes iniciar sesión para guardar favoritos.');
      navigate('/login', { state: { from: location, 
          action: 'addFavorite', 
          productId: producto.id  } });
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
          onClick={handleFavoriteClick} 
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
        >
          Agregar al carrito
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