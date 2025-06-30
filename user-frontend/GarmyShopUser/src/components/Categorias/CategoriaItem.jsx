import React from 'react';
import '../../styles/Categorias.css';

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dz96emvug';

function CategoriaItem({ categoria }) {
  const imageUrl = categoria.imagen ? `${CLOUDINARY_BASE_URL}/${categoria.imagen}` : null;


  return (
    <div className="categoria-item">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`Imagen de ${categoria.nombre}`}
          className="categoria-imagen"
        />
      )}
      <div className="categoria-nombre">{categoria.nombre}</div>
    </div>
  );
}

export default CategoriaItem;