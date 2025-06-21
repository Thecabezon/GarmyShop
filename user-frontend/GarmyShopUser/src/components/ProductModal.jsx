// src/components/ProductModal.js

import React, { useState, useEffect } from 'react';
import '../styles/ProductModal.css';
// --- NUEVO: Importa la configuración de Cloudinary ---
import { CLOUDINARY_BASE_URL } from '../config/cloudinary';

export const ProductModal = ({ 
  isOpen, 
  onClose, 
  producto, 
  onAddToCart,
  isLoading // <-- NUEVA PROP para saber si se están cargando los datos
}) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Este useEffect se encarga de actualizar la imagen cuando el producto cambia
  useEffect(() => {
    // Solo actualiza si NO está cargando y hay un producto con imagen
    if (!isLoading && producto && producto.imagen) {
      // Construye la URL completa de la imagen principal
      const fullMainImageUrl = `${CLOUDINARY_BASE_URL}/${producto.imagen}`;
      setSelectedImage(fullMainImageUrl);
      
      // Resetea las selecciones para el nuevo producto
      setSelectedSize(null);
      setSelectedColor(null);
      setQuantity(1);
    }
  }, [producto, isLoading]); // Se ejecuta si `producto` o `isLoading` cambian

  // Si el modal no está abierto, no renderizamos nada
  if (!isOpen) return null;

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
      // Usamos el ID de la API, que es más seguro y único
      idUnicoCarrito: `${producto.id}-${selectedSize}-${selectedColor.nombre}`
    };

    onAddToCart(itemToAdd);
    onClose();
    alert(`${producto.nombre} agregado al carrito!`);
  };

  // Construimos las URLs completas para las miniaturas
  const fullThumbnailUrls = producto?.imagenes?.map(
    imgPartialUrl => `${CLOUDINARY_BASE_URL}/${imgPartialUrl}`
  ) || [];

  // Función para renderizar el contenido del modal
  const renderModalContent = () => {
    // Si está cargando, muestra un spinner
    if (isLoading || !producto?.id) {
      return (
        <div className="modal-loading">
          <div className="spinner"></div>
          <p>Cargando...</p>
        </div>
      );
    }

    // Si ya cargó, muestra la información del producto
    return (
      <div className="modal-body">
        <div className="modal-images">
          <div className="main-image-container">
            <img src={selectedImage} alt={producto.nombre} className="modal-main-image" />
          </div>
          <div className="modal-thumbnails">
            {fullThumbnailUrls.map((fullUrl, index) => (
              <img
                key={index}
                src={fullUrl}
                alt={`Thumbnail ${index + 1}`}
                className={`modal-thumbnail ${selectedImage === fullUrl ? 'active' : ''}`}
                onClick={() => setSelectedImage(fullUrl)}
              />
            ))}
          </div>
        </div>

        <div className="modal-info">
          <h2>{producto.nombre}</h2>
          <div className="modal-price">
            <span className="price">S/. {producto.precio.toFixed(2)}</span>
          </div>

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

          <div className="modal-option">
            <label>Cantidad:</label>
            <div className="quantity-selector">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
          </div>

          <button className="modal-add-btn" onClick={handleAddToCart}>
            AÑADIR A LA BOLSA
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {renderModalContent()}
      </div>
    </div>
  );
};