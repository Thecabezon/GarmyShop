// src/components/Categorias/CategoriasList.jsx
import React from 'react';
// Asegúrate de importar el componente que realmente usas (Item o Card)
import CategoriaItem from './CategoriaItem'; // <-- Asegúrate que importa el componente correcto

// Asegúrate que la ruta del CSS es correcta desde este archivo
import '../../styles/Categorias.css';

function CategoriasList({ categorias }) {
  if (!categorias || categorias.length === 0) {
    // Este mensaje también está en la página, puedes dejarlo aquí o solo en la página
    return <p>No se encontraron categorías activas.</p>;
  }

  return (
    <div className="categoria-list">
      {categorias.map(categoria => (
        // Asegúrate de pasar el objeto 'categoria' completo como prop
        // Usa el id de la categoría como key, es importante para React
        <CategoriaItem key={categoria.id} categoria={categoria} /> // <-- Pasa el objeto completo
      ))}
    </div>
  );
}

export default CategoriasList;