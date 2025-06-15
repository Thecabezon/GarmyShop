import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MarcasSection.css';

const MarcasSection = ({ marcas, titulo = "NUESTRAS MARCAS" }) => {
  console.log("🔍 Marcas recibidas:", marcas);

  if (!marcas || marcas.length === 0) {
    return (
      <div className="no-brands">
        <p>No hay marcas disponibles.</p>
      </div>
    );
  }

  return (
    <section className="marcas-section">
      <div className="marcas-container">
   
        
        <div className="marcas-grid">
          {marcas.map((marca) => (
            <div key={marca.id} className="marca-card">
              <Link to={`/marca/${marca.slug}`} className="marca-link">
                <div className="marca-logo-container">
                  <img 
                    src={marca.logo} 
                    alt={`Logo de ${marca.nombre}`}
                    className="marca-logo"
                    onError={(e) => {
                      e.target.src = 'https://dummyimage.com/200x100/f0f0f0/666?text=' + marca.nombre;
                    }}
                  />
                </div>
                <div className="marca-info">
                  <h3 className="marca-nombre">{marca.nombre}</h3>
                  <p className="marca-descripcion">{marca.descripcion}</p>
                  <span className="marca-cta">Ver productos</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
    
      </div>
    </section>
  );
};

export default MarcasSection;