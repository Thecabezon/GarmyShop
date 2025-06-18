import React, { useState } from 'react';
import '../styles/Tienda.css';
import { productos } from '../data/productos';
import { Link } from 'react-router-dom';
import { ProductModal } from '../components/ProductModal';

// Plantilla para detalles (sin cambios)
const detallesPlantilla = {
  imagenesAdicionales: ["https://gw.alicdn.com/imgextra/i1/2450640915/TB2s5BWcgoQMeJjy1XaXXcSsFXa_!!2450640915.jpg_540x540.jpg", 
    "https://ae01.alicdn.com/kf/S11cf505076a548acb262c9db137fa818w.jpg_640x640q90.jpg", 
    "https://ae01.alicdn.com/kf/H2e6eb19804e543c698322c47e2c5533dR.jpg_960x960.jpg"],
  tallasDisponibles: [
    { talla: 'XS', disponible: true }, { talla: 'S', disponible: true }, { talla: 'M', disponible: true }, 
    { talla: 'L', disponible: false }, { talla: 'XL', disponible: true }
  ],
  coloresDisponibles: [
    { nombre: 'Negro', codigoHex: '#000000' }, { nombre: 'Blanco', codigoHex: '#ffffff' }, 
    { nombre: 'Gris', codigoHex: '#808080' }, { nombre: 'Azul', codigoHex: '#0000ff' }
  ],
  detalles: "Composición: 95% Algodón, 5% Elastano. Cuidado: Lavar a máquina con agua fría.",
  infoEnvio: "Envío estándar de 3 a 5 días hábiles. Devoluciones gratuitas."
};

// --> 1. AHORA RECIBE 'favoriteItems' Y 'handleToggleFavorite' DESDE App.js
export function TiendaPage({ handleAddToCart, favoriteItems, handleToggleFavorite }) {
  // --> 2. ELIMINAMOS EL ESTADO LOCAL DE FAVORITOS, ya que ahora es global.
  // const [likedProducts, setLikedProducts] = useState({});
  
  // Estados para el modal (sin cambios)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Abrir modal con producto seleccionado (sin cambios)
  const handleOpenModal = (producto) => {
    const productoCompleto = {
      ...producto,
      imagenes: [producto.imagen, ...detallesPlantilla.imagenesAdicionales],
      tallasDisponibles: detallesPlantilla.tallasDisponibles,
      coloresDisponibles: detallesPlantilla.coloresDisponibles,
      detalles: detallesPlantilla.detalles,
      infoEnvio: detallesPlantilla.infoEnvio,
    };
    setSelectedProduct(productoCompleto);
    setIsModalOpen(true);
  };

  // Cerrar modal (sin cambios)
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="productos-container">
      <h2 className="productos-titulo">Nuestros Productos</h2>
      <div className="ropa-lista">
        {productos.map((producto) => {
          // --> 3. VERIFICAMOS SI EL PRODUCTO ESTÁ EN LA LISTA GLOBAL DE FAVORITOS
          const isLiked = favoriteItems.some(item => item.cod === producto.cod);

          return (
            <div key={producto.cod} className="ropa-card">
              <div className="ropa-imagen">
                <Link to={`/tienda/${producto.cod}`}>
                  <img src={producto.imagen} alt={producto.nombre} />
                </Link>
              </div>
              <div className="ropa-info">
                <h5>{producto.nombre}</h5>
                <p className="producto-categoria">{producto.tipoPrenda}</p>
                <div className="ropa-precio">
                  <span className="precio-actual">S/. {producto.precio.toFixed(2)}</span>
                </div>
                <div className="botones-fila">
                  <button onClick={() => handleOpenModal(producto)} className="agregar-carrito-btn">
                    Agregar al carrito
                  </button>
                  {/* --> 4. EL BOTÓN AHORA LLAMA A 'handleToggleFavorite' y su clase depende de 'isLiked' */}
                  <button
                    onClick={() => handleToggleFavorite(producto)}
                    className={`me-encanta-btn ${isLiked ? 'liked' : ''}`}
                    aria-label="Añadir a favoritos"
                    title="Añadir a favoritos"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="corazon-icono">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.5 5.5 0 0 1 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3A5.5 5.5 0 0 1 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                  <Link to={`/tienda/${producto.cod}`} className="ver-detalle-btn" aria-label="Ver detalle" title="Ver detalle">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        producto={selectedProduct}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}