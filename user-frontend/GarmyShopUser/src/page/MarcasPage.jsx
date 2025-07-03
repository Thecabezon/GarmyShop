// src/page/MarcasPage.jsx

import React from 'react';
import MarcasSection from '../components/MarcasSection';
import { useData } from '../context/DataContext'; // 1. Importamos nuestro hook del almacén
import '../styles/MarcasPage.css';

const MarcasPage = () => {
  // 2. Tomamos los datos y estados directamente desde el DataContext.
  // Ya no necesitamos los estados locales 'marcas', 'loading' y 'error'.
  const { marcas, loading, error } = useData();

  // 3. ELIMINAMOS el useEffect que hacía la llamada a la API.
  // Esa responsabilidad ahora es del DataProvider.

  return (
    <div className="marcas-page">
      <section className="marcas-hero">
        <div className="hero-content">
          <h1 className="hero-title">NUESTRAS MARCAS</h1>
          <p className="hero-subtitle">
            Descubre las mejores marcas de moda internacional que hemos seleccionado especialmente para ti
          </p>
        </div>
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
      </section>

      <section className="marcas-results">
        {/* 4. Usamos los estados del DataContext para renderizar el contenido */}
        {loading && <p style={{ textAlign: 'center' }}>Cargando marcas...</p>}
        {error && <p className="error-message" style={{ textAlign: 'center' }}>Error al cargar las marcas: {error.message}</p>}
        
        {/* Renderizamos solo si no está cargando, no hay error y hay marcas disponibles */}
        {!loading && !error && marcas.length > 0 && (
          <MarcasSection marcas={marcas} />
        )}
        
        {/* Mensaje para cuando no hay marcas */}
        {!loading && !error && marcas.length === 0 && (
          <div className="no-results" style={{ textAlign: 'center' }}>
            <p>No hay marcas disponibles en este momento.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default MarcasPage;