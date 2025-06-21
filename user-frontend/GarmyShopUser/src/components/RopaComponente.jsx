// src/components/RopaComponente.js

import { Link } from "react-router-dom";
import React from 'react';
import { CLOUDINARY_BASE_URL } from '../config/cloudinary';
// Importa el componente PriceDisplay
import PriceDisplay from './ofertas/PriceDisplay'; // Ajusta la ruta si es necesario

export function RopaComponente({ producto, isLiked, handleOpenModal, handleToggleFavorite }) {
  
  // Añade 'precioOferta' a la destructuración
  const { id, nombre, imagenPrincipalUrl, precio, precioOferta, categoriaNombre } = producto;

   // Asegúrate de que la imagen principal se obtiene correctamente si 'imagenPrincipalUrl'
   // no siempre es el campo correcto que viene de la API directamente en este nivel.
   // Basado en ProductoDetallePage, la API devuelve un array 'imagenes'.
   // Quizás debas buscar la imagen principal en el array `producto.imagenes` si 'imagenPrincipalUrl' no viene directamente.
   // Por ahora, asumimos que 'imagenPrincipalUrl' es una URL parcial válida o viene en el objeto.
   // Si la API retorna un array 'imagenes' aquí también, podrías hacer algo como:
   // const imagenPrincipalObj = producto.imagenes?.find(img => img.esPrincipal) || producto.imagenes?.[0];
   // const imageUrl = imagenPrincipalObj?.imagen ? `${CLOUDINARY_BASE_URL}/${imagenPrincipalObj.imagen}` : '...';
   // Pero si `imagenPrincipalUrl` ya te da la URL parcial de la imagen principal, la lógica actual está bien.
   const fullImageUrl = imagenPrincipalUrl
     ? `${CLOUDINARY_BASE_URL}/${imagenPrincipalUrl}`
     : 'https://dummyimage.com/400x500/f0f0f0/ccc&text=No+Imagen';


  return (
    <div className="ropa-card">
      <div className="ropa-imagen">
        {/* Usar el slug si lo tienes en el producto y tu ruta es por slug */}
        {/* <Link to={`/tienda/${producto.slug}`} aria-label={`Ver detalles de ${nombre}`}> */}
        <Link to={`/producto/${id}`} aria-label={`Ver detalles de ${nombre}`}> {/* Asegúrate que la ruta de detalle es '/producto/:id' o '/producto/:slug' */}
          <img src={fullImageUrl} alt={nombre} loading="lazy" />
        </Link>
        <button
          onClick={() => handleToggleFavorite(producto)}
          className={`me-encanta-btn ${isLiked ? 'liked' : ''}`}
          aria-label="Añadir a favoritos"
          title="Añadir a favoritos"
        >
          {/* Volvemos al ícono original, que es perfecto para el estilo de contorno */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="corazon-icono">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.5 5.5 0 0 1 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3A5.5 5.5 0 0 1 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>
      
      <div className="ropa-info">
        <p className="producto-categoria">{categoriaNombre || 'Categoría'}</p>
         {/* Usar el slug si lo tienes */}
        {/* <Link to={`/tienda/${producto.slug}`} className="producto-nombre-link"> */}
        <Link to={`/producto/${id}`} className="producto-nombre-link"> {/* Asegúrate que la ruta de detalle es correcta */}
          <h5>{nombre}</h5>
        </Link>
        
        <div className="ropa-precio">
           {/* *** Usa el componente PriceDisplay aquí *** */}
           {/* Pasa el precio regular y el precio de oferta */}
           <PriceDisplay regularPrice={precio} offerPrice={precioOferta} />
           {/* ELIMINA el span de precio actual anterior: */}
           {/* <span className="precio-actual">S/. {precio.toFixed(2)}</span> */}
        </div>
      </div>
      
      <div className="ropa-acciones">
         {/* El botón para abrir el modal ya le pasa el 'producto' completo.
             Como ya modificamos ProductModal para usar displayPrice, la lógica
             de añadir al carrito con el precio correcto está en el modal. */}
        <button onClick={() => handleOpenModal(producto)} className="agregar-carrito-btn">
          Agregar al carrito
        </button>
         {/* Usar el slug si lo tienes */}
        {/* <Link to={`/tienda/${producto.slug}`} className="ver-detalle-btn" aria-label="Ver detalle" title="Ver detalle"> */}
        <Link to={`/producto/${id}`} className="ver-detalle-btn" aria-label="Ver detalle" title="Ver detalle"> {/* Asegúrate que la ruta de detalle es correcta */}
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="2" fill="none"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}

