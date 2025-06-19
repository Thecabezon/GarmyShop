// src/components/Categorias/CategoriaItem.jsx
import React from 'react';
// Asegúrate que la ruta del CSS es correcta desde este archivo (dos niveles arriba hasta src/, luego styles/)
import '../../styles/Categorias.css';

// Define la URL base de Cloudinary
// **¡IMPORTANTE!** Reemplaza '<tu_nombre_de_cloud>' con el nombre real de tu cuenta de Cloudinary.
// Es recomendable guardar esto en una variable de entorno (ej. en un archivo .env)
// Por ejemplo: const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_URL; // Si usas Vite con .env
const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dz96emvug'; // <-- Usa tu nombre de cloud real

function CategoriaItem({ categoria }) {
  // Verifica si la propiedad 'imagen' existe y tiene valor
  const imageUrl = categoria.imagen ? `${CLOUDINARY_BASE_URL}/${categoria.imagen}` : null;

  // Puedes añadir un enlace si quieres que la categoría te lleve a una página de productos por categoría
  // const linkUrl = `/tienda?categoria=${categoria.slug}`; // Ejemplo de URL usando slug para filtrar productos

  return (
    // Considera usar un <Link> de react-router-dom si haces la card clickeable
    // <Link to={linkUrl} className="categoria-item">
    <div className="categoria-item">
      {/* Renderiza la imagen solo si se pudo construir la URL completa */}
      {imageUrl && (
        <img
          src={imageUrl} // <-- Usa la URL COMPLETA construida
          alt={`Imagen de ${categoria.nombre}`} // Texto alternativo para accesibilidad
          className="categoria-imagen" // Aplica estilos CSS (asegúrate que esta clase exista y tenga estilos)
        />
      )}
      {/* Muestra el nombre de la categoría */}
      <div className="categoria-nombre">{categoria.nombre}</div>
      {/* Puedes añadir la descripción si quieres */}
      {/* {categoria.descripcion && <p className="categoria-descripcion">{categoria.descripcion}</p>} */}
    </div>
    // </Link>
  );
}

export default CategoriaItem;