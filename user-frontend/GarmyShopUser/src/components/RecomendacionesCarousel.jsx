import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/RecomendacionesCarousel.css';

const RecomendacionesCarousel = ({ productos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  console.log("🔍 Productos recibidos:", productos);

  if (!productos || productos.length === 0) {
    return (
      <div className="no-recommendations">
        <p>No hay productos recomendados disponibles.</p>
      </div>
    );
  }

  // Funciones simples para navegación
  const goToPrevious = () => {
    console.log("🔍 Botón anterior clickeado, índice actual:", currentIndex);
    setCurrentIndex(prevIndex => {
      const newIndex = prevIndex > 0 ? prevIndex - 1 : productos.length - 1;
      console.log("🔍 Nuevo índice:", newIndex);
      return newIndex;
    });
  };

  const goToNext = () => {
    console.log("🔍 Botón siguiente clickeado, índice actual:", currentIndex);
    setCurrentIndex(prevIndex => {
      const newIndex = prevIndex < productos.length - 1 ? prevIndex + 1 : 0;
      console.log("🔍 Nuevo índice:", newIndex);
      return newIndex;
    });
  };

  return (
    <div className="simple-carousel">
      {/* BOTÓN ANTERIOR */}
      <button 
        className="nav-btn prev-btn" 
        onClick={goToPrevious}
        type="button"
      >
        &#8249;
      </button>

      {/* CONTENEDOR DE PRODUCTOS */}
      <div className="products-container">
        {productos.map((producto, index) => (
          <div 
            key={producto.cod} 
            className={`product-item ${index === currentIndex ? 'active' : ''}`}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: 'transform 0.3s ease'
            }}
          >
            <Link to={`/producto/${producto.cod}`} className="product-link">
              <div className="product-image">
                <img 
                  src={producto.imagen} 
                  alt={producto.nombre}
                  onError={(e) => {
                    e.target.src = 'https://i.pinimg.com/originals/f2/91/88/f29188204ca351f2b0cb604b51fc409a.jpg';
                  }}
                />
              </div>
              <div className="product-details">
                <h4>{producto.nombre}</h4>
                <p className="category">{producto.categoria}</p>
                <p className="price">S/. {producto.precio.toFixed(2)}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* BOTÓN SIGUIENTE */}
      <button 
        className="nav-btn next-btn" 
        onClick={goToNext}
        type="button"
      >
        &#8250;
      </button>

      {/* INDICADORES */}
      <div className="indicators">
        {productos.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default RecomendacionesCarousel;