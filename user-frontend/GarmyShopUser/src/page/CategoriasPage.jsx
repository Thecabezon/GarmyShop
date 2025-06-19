// src/page/CategoriasPage.jsx
import React, { useEffect, useState } from 'react';
import CategoriaList from '../components/Categorias/CategoriasList'; // Asegúrate que esta ruta sea correcta
import '../styles/Categorias.css'; // Estilos para la página

function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:8085/api/categorias'; // Cambia si usas variable de entorno

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);  

        if (response.status === 204) {
          setCategorias([]);
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCategorias(data);
      } catch (err) {
        setError(err);
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  return (
    <div className="categorias-page-container">
      <h1>Nuestras Categorías</h1>

      {loading && <p>Cargando categorías...</p>}
      {error && <p className="error-message">Error al cargar las categorías: {error.message}</p>}

      {!loading && !error && categorias.length === 0 && (
        <p>No se encontraron categorías activas.</p>
      )}

      {!loading && !error && categorias.length > 0 && (
        <CategoriaList categorias={categorias} />
      )}
    </div>
  );
}

export default CategoriasPage;
