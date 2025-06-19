import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/RecomendacionesCarousel.css';

const RecomendacionesCarousel = ({ productos }) => {
  const [currentPage, setCurrentPage] = useState(0);

  // --- Lógica para mostrar 3 items por página ---
  const itemsPerPage = 3;
  if (!productos || productos.length === 0) {
    return <p>No hay productos recomendados en este momento.</p>;
  }
  const totalPages = Math.ceil(productos.length / itemsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };
  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <div className="carousel-container">
      <div className="carousel-viewport">
        <div className="carousel-track" style={{ transform: `translateX(-${currentPage * 100}%)` }}>
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <div className="carousel-page" key={pageIndex}>
              {productos.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage).map(producto => (
                <div className="carousel-product-card" key={producto.id || producto.cod}>
                  <Link to={`/tienda/${producto.id || producto.cod}`}>
                    <div className="card-image-wrapper">
                      <img src={producto.imagen || producto.imagenPrincipalUrl} alt={producto.nombre} />
                    </div>
                    <div className="card-info">
                      <h3>{producto.nombre}</h3>
                      <p className="card-price">S/. {producto.precio.toFixed(2)}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {totalPages > 1 && (
        <>
          <button className="carousel-nav-btn prev" onClick={goToPrevPage}>‹</button>
          <button className="carousel-nav-btn next" onClick={goToNextPage}>›</button>
          <div className="carousel-indicators">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button key={index}
                className={`indicator ${currentPage === index ? 'active' : ''}`}
                onClick={() => goToPage(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecomendacionesCarousel;