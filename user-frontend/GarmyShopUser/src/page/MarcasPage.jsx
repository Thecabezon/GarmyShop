import React, { useState } from 'react';
import { marcasDestacadas } from '../data/datosProducto';
import MarcasSection from '../components/MarcasSection';
import '../styles/MarcasPage.css';

const MarcasPage = () => {
  const [busqueda, setBusqueda] = useState('');

  // Filtrar marcas solo por búsqueda
  const marcasFiltradas = marcasDestacadas.filter(marca => 
    marca.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    marca.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  return (
    <div className="marcas-page">
      {/* Hero Section */}
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

      {/* Solo Búsqueda */}
      <section className="marcas-filters">
        <div className="filters-container">
          <div className="search-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar marcas..."
                value={busqueda}
                onChange={handleBusquedaChange}
                className="search-input"
              />
              <div className="search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resultados */}
      <section className="marcas-results">
        {marcasFiltradas.length > 0 ? (
          <MarcasSection 
            marcas={marcasFiltradas} 
            titulo="" 
          />
        ) : (
          <div className="no-results">
            <div className="no-results-icon">😔</div>
            <h3>No se encontraron marcas</h3>
            <p>Intenta con otros términos de búsqueda.</p>
            <button 
              className="reset-btn"
              onClick={() => setBusqueda('')}
            >
              Limpiar búsqueda
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default MarcasPage;