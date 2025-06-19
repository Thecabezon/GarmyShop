// src/components/MarcasSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// Ruta corregida para el CSS (sube dos niveles desde components/MarcasSection hasta src/, luego entra a styles/)
import '../styles/MarcasSection.css';
// Ruta corregida para el archivo de configuración (sube dos niveles desde components/MarcasSection hasta src/, luego entra a config/)
import { CLOUDINARY_BASE_URL } from '../config/cloudinary';

const MarcasSection = ({ marcas }) => {
  return (
    <section className="marcas-section">
      {/* Contenedor para centrar y añadir padding lateral */}
      <div className="marcas-container">
        <div className="marcas-grid">
          {marcas.map((marca) => {
            // Construye la URL completa del logo de Cloudinary
            const logoUrl = marca.imagen ? `${CLOUDINARY_BASE_URL}/${marca.imagen}` : null;

            return (
              <div key={marca.id || marca.slug} className="marca-card">
                {/* Enlace a la página de productos de la marca */}
                <Link to={`/marca/${marca.slug}`} className="marca-link">
                  <div className="marca-logo-container">
                    {/* Muestra el logo de la marca o un placeholder */}
                    <img
                      src={logoUrl || 'https://dummyimage.com/200x100/f0f0f0/666?text=Logo+No+Disp'}
                      alt={`Logo de ${marca.nombre}`}
                      className="marca-logo"
                      onError={(e) => {
                        // Muestra un placeholder en caso de error al cargar la imagen
                        e.target.src = 'https://dummyimage.com/200x100/f0f0f0/666?text=Logo+Error';
                        console.error(`Error cargando logo para la marca ${marca.nombre}`, e);
                      }}
                    />
                  </div>
                  <div className="marca-info">
                    {/* Muestra el nombre de la marca */}
                    {marca.nombre && <h3 className="marca-nombre">{marca.nombre}</h3>}
                    {/* Si tu DTO tiene la propiedad 'descripcion', puedes añadirla aquí */}
                    {/* {marca.descripcion && <p className="marca-descripcion">{marca.descripcion}</p>} */}
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