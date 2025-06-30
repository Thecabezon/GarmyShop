import React from 'react';
import CategoriaItem from './CategoriaItem';

import '../../styles/Categorias.css';

function CategoriasList({ categorias }) {
  if (!categorias || categorias.length === 0) {
    return <p>No se encontraron categorías activas.</p>;
  }

  return (
    <div className="categoria-list">
      {categorias.map(categoria => (
        <CategoriaItem key={categoria.id} categoria={categoria} />
      ))}
    </div>
  );
}

export default CategoriasList;