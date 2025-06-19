// src/page/MarcasPage.jsx
import React, { useState, useEffect } from 'react';
import MarcasSection from '../components/MarcasSection';
import '../styles/MarcasPage.css';

const MarcasPage = () => {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:8085/api/marcas';

  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const response = await fetch(API_URL);

        if (response.status === 204) {
          setMarcas([]);
        } else if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          const data = await response.json();
          setMarcas(data);
        }
      } catch (err) {
        setError(err);
        console.error("Error fetching brands:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarcas();
  }, []);

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
        {loading && <p style={{ textAlign: 'center' }}>Cargando marcas...</p>}
        {error && <p className="error-message" style={{ textAlign: 'center' }}>Error al cargar las marcas: {error.message}</p>}
        {!loading && !error && marcas.length === 0 && (
          <div className="no-results" style={{ textAlign: 'center' }}>
            <p>No hay marcas disponibles en este momento.</p>
          </div>
        )}
        {!loading && !error && marcas.length > 0 && (
          <MarcasSection marcas={marcas} />
        )}
      </section>
    </div>
  );
};

export default MarcasPage;