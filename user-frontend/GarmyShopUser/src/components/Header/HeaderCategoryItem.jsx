// src/components/Header/HeaderCategoryItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// Ruta correcta desde components/Header/ a src/config/
import { CLOUDINARY_BASE_URL } from '../../config/cloudinary';
// Importar el CSS específico de los dropdowns
import '../../styles/HeaderDropdowns.css';


function HeaderCategoryItem({ category }) {
  const imageUrl = category.imagen ? `${CLOUDINARY_BASE_URL}/${category.imagen}` : null;

  // El enlace debe dirigir a la página de productos, filtrando por la categoría.
  // Asumimos que tu página de tienda (/tienda) puede manejar parámetros de URL
  // para mostrar productos de una categoría específica (ej: /tienda?categoria=slug-de-la-categoria).
  const linkTo = `/tienda?categoria=${category.slug}`;

  return (
    <Link to={linkTo} className="header-category-item">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={category.nombre}
          className="header-category-image"
        />
      )}
      <span className="header-category-name">{category.nombre}</span>
    </Link>
  );
}

export default HeaderCategoryItem;