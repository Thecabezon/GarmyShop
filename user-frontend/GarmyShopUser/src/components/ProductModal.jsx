import React, { useState } from 'react';
import '../styles/ProductModal.css';

export const ProductModal = ({ 
  isOpen, 
  onClose, 
  producto, 
  onAddToCart 
}) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(producto?.imagen || '');
  const [quantity, setQuantity] = useState(1);

  // Si el modal no está abierto o no hay producto, no renderizar nada
  if (!isOpen || !producto) return null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Por favor, selecciona una talla.");
      return;
    }
    if (!selectedColor) {
      alert("Por favor, selecciona un color.");
      return;
    }

    const itemToAdd = {
      ...producto,
      talla: selectedSize,
      color: selectedColor,
      cantidad: quantity,
      idUnicoCarrito: `${producto.cod}-${selectedSize}-${selectedColor.nombre}`
    };

    onAddToCart(itemToAdd);
    onClose(); // Cerrar el modal después de agregar
    alert(`${producto.nombre} agregado al carrito!`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Botón cerrar */}
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-body">
          {/* Columna izquierda: Imágenes */}
          <div className="modal-images">
            <div className="main-image-container">
              <img src={selectedImage} alt={producto.nombre} className="modal-main-image" />
            </div>
            <div className="modal-thumbnails">
              {producto.imagenes?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`modal-thumbnail ${selectedImage === img ? 'active' : ''}`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Columna derecha: Información y opciones */}
          <div className="modal-info">
            <h2>{producto.nombre}</h2>
            <div className="modal-price">
              <span className="price">S/. {producto.precio.toFixed(2)}</span>
            </div>

            {/* Selector de Color */}
            <div className="modal-option">
              <label>Color:</label>
              <div className="color-options">
                {producto.coloresDisponibles?.map(color => (
                  <div
                    key={color.nombre}
                    className={`color-option ${selectedColor?.nombre === color.nombre ? 'selected' : ''}`}
                    style={{ backgroundColor: color.codigoHex }}
                    onClick={() => setSelectedColor(color)}
                    title={color.nombre}
                  />
                ))}
              </div>
            </div>

            {/* Selector de Talla */}
            <div className="modal-option">
              <label>Talla:</label>
              <div className="size-options">
                {producto.tallasDisponibles?.map(talla => (
                  <button
                    key={talla.talla}
                    className={`size-option ${selectedSize === talla.talla ? 'selected' : ''}`}
                    disabled={!talla.disponible}
                    onClick={() => setSelectedSize(talla.talla)}
                  >
                    {talla.talla}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Cantidad */}
            <div className="modal-option">
              <label>Cantidad:</label>
              <div className="quantity-selector">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>
            </div>

            {/* Botón Agregar al Carrito */}
            <button className="modal-add-btn" onClick={handleAddToCart}>
              AÑADIR A LA BOLSA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};