
import React from 'react';
import { Link } from 'react-router-dom';

import { CLOUDINARY_BASE_URL } from '../../config/cloudinary';
import '../../styles/HeaderDropdowns.css';

function HeaderCategoryItem({ category }) {
  const imageUrl = category.imagen ? `${CLOUDINARY_BASE_URL}/${category.imagen}` : null;

  const linkTo = `/tienda?categoria=${category.id}`;

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