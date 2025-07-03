// src/page/MarcasPage.jsx

import React from 'react';
import MarcasSection from '../components/MarcasSection';
import { useData } from '../context/DataContext';
import '../styles/MarcasPage.css';

const MarcasPage = () => {
  const { marcas, loading, error } = useData();

  return (
    <div className="marcas-page">
      <section className="marcas-titulo-section">
        <h2 className="titulo-marcas">Nuestras marcas</h2>
        <div className="linea-decorativa"></div>
      </section>

      <section className="marcas-results">
        {loading && <p style={{ textAlign: 'center' }}>Cargando marcas...</p>}
        {error && <p className="error-message" style={{ textAlign: 'center' }}>Error al cargar las marcas: {error.message}</p>}

        {!loading && !error && marcas.length > 0 && (
          <MarcasSection marcas={marcas} />
        )}

        {!loading && !error && marcas.length === 0 && (
          <div className="no-results">
            <p>No hay marcas disponibles en este momento.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default MarcasPage;
