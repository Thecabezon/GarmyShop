// src/components/MarcasSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MarcasSection.css';
// Importa la URL base de Cloudinary desde tu archivo de configuración
// Asegúrate que la ruta sea correcta desde src/components/MarcasSection
// Para ir de src/components/MarcasSection/ a src/config/cloudinary.js
import { CLOUDINARY_BASE_URL } from '../config/cloudinary'; // <--- VERIFICA ESTA RUTA

// Eliminamos la prop 'titulo' ya que no se usa en esta versión
const MarcasSection = ({ marcas }) => {
  // console.log("🔍 Marcas recibidas:", marcas); // Puedes dejar esto para depuración

  // No necesitamos la verificación inicial de marcas.length === 0 aquí,
  // ya que la página MarcasPage ya maneja si hay o no marcas filtradas.

  return (
    <section className="marcas-section">
      <div className="marcas-grid">
        {marcas.map((marca) => {
           // **¡IMPORTANTE!** Construimos la URL completa usando la propiedad 'imagen' del objeto marca
           // y la base URL de Cloudinary.
           // Asegúrate que 'marca.imagen' contenga el path correcto (ej: 'image/upload/...')
          const logoUrl = marca.imagen ? `${CLOUDINARY_BASE_URL}/${marca.imagen}` : null;

          return (
            // Usar marca.id como key si es único, de lo contrario usa marca.slug
            <div key={marca.id || marca.slug} className="marca-card">
              {/* Asumiendo que la ruta para ver productos de una marca es /marca/slug_de_la_marca */}
              <Link to={`/marca/${marca.slug}`} className="marca-link">
                <div className="marca-logo-container">
                  <img
                    // Usa la URL construida. Si no hay URL válida, puedes poner una imagen placeholder.
                    src={logoUrl || 'https://dummyimage.com/200x100/f0f0f0/666?text=Logo+No+Disp'} // Placeholder si no hay logo
                    alt={`Logo de ${marca.nombre}`} // Texto alternativo
                    className="marca-logo" // Clase CSS para estilos
                    onError={(e) => {
                      // Manejar errores al cargar la imagen, por ejemplo, mostrar un placeholder o el nombre
                      e.target.src = 'https://dummyimage.com/200x100/f0f0f0/666?text=Logo+Error'; // Placeholder en caso de error
                      console.error(`Error cargando logo para la marca ${marca.nombre}`, e);
                    }}
                  />
                </div>
                <div className="marca-info">
                  {/* Asegúrate que 'nombre' existe antes de mostrarlo */}
                  {marca.nombre && <h3 className="marca-nombre">{marca.nombre}</h3>}
                  {/* NOTA: Eliminamos la descripción ya que la entidad Marca que proporcionaste no la tiene */}
                  {/* Si tu DTO sí la tiene, puedes añadirla de vuelta aquí: */}
                  {/* {marca.descripcion && <p className="marca-descripcion">{marca.descripcion}</p>} */}
                  <span className="marca-cta">Ver productos</span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MarcasSection;