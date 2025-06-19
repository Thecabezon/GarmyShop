// src/components/RopaComponente.js

import { Link } from "react-router-dom";
import React from 'react';

// Este componente ahora es la plantilla para cada tarjeta de producto en la tienda
export function RopaComponente({ producto, isLiked, handleOpenModal, handleToggleFavorite }) {
  
  // --> Mapeamos los campos de la API a variables para que el JSX sea más limpio
  const { id, nombre, imagenPrincipalUrl, precio, categoriaNombre } = producto;

  return (
    <div className="ropa-card">
      <div className="ropa-imagen">
        {/* --> El Link ahora usa el 'id' del producto que viene de la API */}
        <Link to={`/tienda/${id}`}>
          <img src={imagenPrincipalUrl} alt={nombre} />
        </Link>
      </div>
      <div className="ropa-info">
        <h5>{nombre}</h5>
        <p className="producto-categoria">{categoriaNombre}</p>
        <div className="ropa-precio">
          <span className="precio-actual">S/. {precio.toFixed(2)}</span>
        </div>
        <div className="botones-fila">
          <button onClick={() => handleOpenModal(producto)} className="agregar-carrito-btn">
            Agregar al carrito
          </button>
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
          <Link to={`/tienda/${id}`} className="ver-detalle-btn" aria-label="Ver detalle" title="Ver detalle">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="2" fill="none"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}