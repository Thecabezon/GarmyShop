import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MarcasSection.css';
import { CLOUDINARY_BASE_URL } from '../config/cloudinary';

const MarcasSection = ({ marcas }) => {
  return (
    <section className="marcas-section">
      <div className="marcas-container">
        <div className="marcas-grid">
          {marcas.map((marca) => {
            const logoUrl = marca.imagen ? `${CLOUDINARY_BASE_URL}/${marca.imagen}` : null;

            return (
              <div key={marca.id || marca.slug} className="marca-card">
                <Link to={`/marcas/${marca.slug}`} className="marca-link">
                  <div className="marca-logo-container">
                    <img
                      src={logoUrl || 'https://dummyimage.com/200x100/f0f0f0/666?text=Logo+No+Disp'}
                      alt={`Logo de ${marca.nombre}`}
                      className="marca-logo"
                      onError={(e) => {
                        e.target.src = 'https://dummyimage.com/200x100/f0f0f0/666?text=Logo+Error';
                        console.error(`Error cargando logo para la marca ${marca.nombre}`, e);
                      }}
                    />
                  </div>
                  <div className="marca-info">
                    {marca.nombre && <h3 className="marca-nombre">{marca.nombre}</h3>}
                    <span className="marca-cta">Ver productos</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MarcasSection;