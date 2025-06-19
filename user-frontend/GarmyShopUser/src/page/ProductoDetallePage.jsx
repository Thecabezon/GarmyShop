// src/page/ProductoDetallePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productoDetalle, productosRecomendados } from '../data/datosProducto';
import RecomendacionesCarousel from '../components/RecomendacionesCarousel';
import '../styles/ProductoDetalle.css';

export const ProductoDetallePage = ({ handleAddToCart }) => {
  const { cod } = useParams();
  const [productoActual, setProductoActual] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('descripcion');

  useEffect(() => {
    const productoCompleto = {
      ...productoDetalle,
      cod: parseInt(cod, 10) || productoDetalle.id
    };

    setProductoActual(productoCompleto);
    setSelectedImage(productoCompleto.imagenes[0]);
    setSelectedSize(null);
    setSelectedColor(null);
    setQuantity(1);
    window.scrollTo(0, 0);
  }, [cod]);

  const handleAddToCartClick = () => {
    if (!productoActual) return;
    if (!selectedSize) return alert("Por favor, selecciona una talla.");
    if (!selectedColor) return alert("Por favor, selecciona un color.");

    const itemToAdd = {
      ...productoActual,
      talla: selectedSize,
      color: selectedColor,
      cantidad: quantity,
      idUnicoCarrito: `${productoActual.cod}-${selectedSize}-${selectedColor.nombre}`
    };

    handleAddToCart(itemToAdd);
    alert(`${productoActual.nombre} (${selectedSize}, ${selectedColor.nombre}) ha sido añadido al carrito.`);
  };

  if (!productoActual) {
    return <div><h1>Cargando producto...</h1></div>;
  }

  return (
    <div className="producto-detalle-container">
      <div className="product-gallery">
        <img src={selectedImage} alt={productoActual.nombre} className="main-image" />
        <div className="thumbnail-container">
          {productoActual.imagenes.map((img, index) => (
            <img 
              key={index} 
              src={img} 
              alt={`Thumbnail ${index + 1}`}
              className={selectedImage === img ? 'thumbnail active' : 'thumbnail'}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>

      <div className="product-info">
        <h1>{productoActual.nombre}</h1>
        <div className="price-section">
          <span className="current-price">S/. {productoActual.precio.toFixed(2)}</span>
          {productoActual.precioAnterior && (
            <span className="old-price">S/. {productoActual.precioAnterior.toFixed(2)}</span>
          )}
        </div>

        <div className="options-section">
          <div className="size-selector">
            <p>Talla:</p>
            <div className="options-buttons">
              {productoActual.tallasDisponibles.map(talla => (
                <button 
                  key={talla.talla} 
                  className={`size-btn ${selectedSize === talla.talla ? 'active' : ''}`} 
                  disabled={!talla.disponible} 
                  onClick={() => setSelectedSize(talla.talla)}
                >
                  {talla.talla}
                </button>
              ))}
            </div>
          </div>

          <div className="color-selector">
            <p>Colores Disponibles:</p>
            <div className="options-buttons">
              {productoActual.coloresDisponibles.map(color => (
                <div 
                  key={color.nombre} 
                  className={`color-swatch ${selectedColor?.nombre === color.nombre ? 'active' : ''}`}
                  style={{ backgroundColor: color.codigoHex, border: color.codigoHex === '#ffffff' ? '1px solid #ccc' : 'none' }}
                  onClick={() => setSelectedColor(color)} 
                  title={color.nombre}
                />
              ))}
            </div>
          </div>

          <div className="quantity-selector">
            <p>Cantidad:</p>
            <div className="quantity-input">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <input type="number" value={quantity} readOnly />
              <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
          </div>
        </div>

        <button className="add-to-cart-btn" onClick={handleAddToCartClick}>
          AGREGAR AL CARRITO
        </button>

        <p className="sku-info">SKU: {productoActual.sku}</p>

        <div className="product-description-tabs">
          <div className="tab-headers">
            <button className={activeTab === 'descripcion' ? 'active' : ''} onClick={() => setActiveTab('descripcion')}>DESCRIPCIÓN</button>
            <button className={activeTab === 'detalles' ? 'active' : ''} onClick={() => setActiveTab('detalles')}>DETALLE</button>
            <button className={activeTab === 'envio' ? 'active' : ''} onClick={() => setActiveTab('envio')}>ENVÍO</button>
          </div>
          <div className="tab-content">
            {activeTab === 'descripcion' && <p>{productoActual.descripcion}</p>}
            {activeTab === 'detalles' && <p>{productoActual.detalles}</p>}
            {activeTab === 'envio' && <p>{productoActual.infoEnvio}</p>}
          </div>
        </div>
      </div>

      <div className="recommendations-section">
        <h2>TAMBIÉN TE PODRÍA INTERESAR</h2>
        <RecomendacionesCarousel productos={productosRecomendados} />
      </div>
    </div>
  );
};
