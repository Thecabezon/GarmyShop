import React, { useState } from 'react';
// ¡Asegúrate de que esta importación sea correcta!
import { RopaComponente } from './RopaComponente'; 
import '../styles/RecomendacionesCarousel.css';

const RecomendacionesCarousel = ({ productos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;

  if (!productos || productos.length === 0) {
    return null; // No renderiza nada si no hay productos
  }

  const handlePrev = () => { /* ... */ };
  const handleNext = () => { /* ... */ };

  return (
    <div className="carousel-container">
      {/* ... botones de navegación ... */}
      <div className="carousel-window">
        <div className="carousel-track" style={{ /* ... */ }}>
          {productos.map((producto) => (
            <div className="carousel-item" key={producto.cod}>
              {/* ¡PUNTO CLAVE! Verifica que estas props se estén pasando */}
              <RopaComponente
                id={producto.cod}
                nombre={producto.nombre}
                categoria={producto.tipoPrenda} // Asegúrate que sea tipoPrenda
                precio={producto.precio}
                imagen={producto.imagen}
              />
            </div>
          ))}
        </div>
      </div>
      {/* ... botones de navegación ... */}
    </div>
  );
};

export default RecomendacionesCarousel; // Si usas export default, la importación debe ser sin llaves.