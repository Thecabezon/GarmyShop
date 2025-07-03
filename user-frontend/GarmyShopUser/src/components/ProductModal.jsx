// src/components/ProductModal.jsx

import React, { useState, useEffect, useMemo } from 'react';
import '../styles/ProductModal.css'; 
import PriceDisplay from './ofertas/PriceDisplay';
import { CLOUDINARY_BASE_URL } from '../config/cloudinary';
import { toast } from 'react-toastify'; 

const CheckIcon = () => (
  <svg
    className="check-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export const ProductModal = ({
  isOpen,
  onClose,
  producto,
  onAddToCart, 
  isLoading
}) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [showQuickConfirmationModal, setShowQuickConfirmationModal] = useState(false);
  const [itemToConfirmInModal, setItemToConfirmInModal] = useState(null); 
  const { fullMainImageUrl, displayPrice } = useMemo(() => {
    if (isLoading || !producto?.id) {
      return { fullMainImageUrl: '', displayPrice: null };
    }
    const offerPrice = producto.precioOferta;
    const regularPrice = producto.precio;
    const hasOffer = offerPrice != null && offerPrice < regularPrice;
    const calculatedDisplayPrice = hasOffer ? offerPrice : regularPrice;
    const imagenPrincipalObj = producto.imagenes?.find(img => img.esPrincipal) || producto.imagenes?.[0];
    const calculatedFullMainImageUrl = imagenPrincipalObj?.imagen
      ? `${CLOUDINARY_BASE_URL}/${imagenPrincipalObj.imagen}`
      : 'https://dummyimage.com/600x600/f0f0f0/ccc&text=No+Imagen';
    return {
      fullMainImageUrl: calculatedFullMainImageUrl,
      displayPrice: calculatedDisplayPrice,
    };
  }, [producto, isLoading]);

  useEffect(() => {
    if (isOpen && producto?.id) {
        setSelectedImage(fullMainImageUrl);
        setSelectedSize(null);
        setSelectedColor(null);
        setQuantity(1);
        setShowQuickConfirmationModal(false);
        setItemToConfirmInModal(null);
    } else if (!isOpen) {
      setSelectedSize(null);
      setSelectedColor(null);
      setSelectedImage(null);
      setQuantity(1);
      setShowQuickConfirmationModal(false);
      setItemToConfirmInModal(null);
    }
  }, [producto, isLoading, fullMainImageUrl, isOpen]);

  const todasLasTallas = useMemo(() => {
    if (!producto || !producto.combinacionesDisponibles) return [];
    return [...new Set(producto.combinacionesDisponibles.map(c => c.talla.nombre))];
  }, [producto]);

  const todosLosColores = useMemo(() => {
    if (!producto || !producto.combinacionesDisponibles) return [];
    return producto.combinacionesDisponibles
      .map(c => c.color)
      .filter((color, index, self) => index === self.findIndex(c => c.id === color.id));
  }, [producto]);

  const coloresFiltrados = useMemo(() => {
    if (!selectedSize) {
      return todosLosColores.map(color => ({ ...color, disponible: true }));
    }
    if (!producto || !producto.combinacionesDisponibles) return [];

    const idsColoresValidosParaTalla = producto.combinacionesDisponibles
      .filter(c => c.talla.nombre === selectedSize)
      .map(c => c.color.id);
    return todosLosColores.map(color => ({
      ...color,
      disponible: idsColoresValidosParaTalla.includes(color.id)
    }));
  }, [selectedSize, todosLosColores, producto]);

  useEffect(() => {
    if (selectedColor) {
      const esColorValido = coloresFiltrados.find(
        color => color.id === selectedColor.id && color.disponible
      );
      if (!esColorValido) {
        setSelectedColor(null);
      }
    }
  }, [coloresFiltrados, selectedColor]);

  if (!isOpen) return null; 

  const handleAddToCartClick = () => {
    if (!selectedSize) {
      toast.warning("Por favor, selecciona una talla.");
      return;
    }
    if (!selectedColor) {
      toast.warning("Por favor, selecciona un color.");
      return;
    }

    const combinacionSeleccionada = producto.combinacionesDisponibles?.find( 
      c => c.talla.nombre === selectedSize && c.color.id === selectedColor.id
    );

    if (!combinacionSeleccionada) {
       toast.warning("La combinación seleccionada no está disponible.");
       return;
    }

    const item = {
      ...producto,
      talla: selectedSize,
      color: selectedColor,
      cantidad: quantity,
      price: displayPrice,
      imagen: producto.imagenes?.find(img => img.esPrincipal)?.imagen || producto.imagenes?.[0]?.imagen,
      idUnicoCarrito: `${producto.id}-${combinacionSeleccionada.id}`,
      combinacionProductoId: combinacionSeleccionada.id
    };

    setItemToConfirmInModal(item); 
    setShowQuickConfirmationModal(true); 
  };

  const handleConfirmAddToCartInModal = () => {
    if (itemToConfirmInModal) {
      onAddToCart(itemToConfirmInModal); 
    }
    setItemToConfirmInModal(null); 
    setShowQuickConfirmationModal(false); 
    onClose(); 
  };

  const handleCancelAddToCartInModal = () => {
    setItemToConfirmInModal(null); 
    setShowQuickConfirmationModal(false); 
  };

  const fullThumbnailUrls = producto?.imagenes?.map(
    imgObj => `${CLOUDINARY_BASE_URL}/${imgObj.imagen}`
  ) || [];

  const handleColorClick = (color) => {
    if (selectedColor?.id === color.id) {
      setSelectedColor(null);
    } else {
      setSelectedColor(color);
    }
  };

  const handleSizeClick = (tallaNombre) => {
    if (selectedSize === tallaNombre) {
      setSelectedSize(null);
    } else {
      setSelectedSize(tallaNombre);
    }
  };

  const renderModalContent = () => {
    if (isLoading) {
      return <div className="modal-loading"><div className="spinner"></div><p>Cargando...</p></div>;
    }

    if (!producto?.id) {
        return <div className="modal-error">No se pudo cargar la información del producto.</div>;
    }

    return (
      <div className="modal-body">
        <div className="modal-images">
            <div className="main-image-container">
              {selectedImage && (
                <img src={selectedImage} alt={producto.nombre} className="modal-main-image" />
              )}
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
            <PriceDisplay
                regularPrice={producto.precio}
                offerPrice={producto.precioOferta}
            />
          </div>

          <div className="modal-option">
            <label>Color:</label>
            <div className="color-options">
              {coloresFiltrados.map(color => (
                <div
                  key={color.id}
                  className={`color-option ${selectedColor?.id === color.id ? 'selected' : ''} ${!color.disponible ? 'disabled' : ''}`}
                  style={{ backgroundColor: color.codigoHex }}
                  onClick={() => color.disponible && handleColorClick(color)}
                  title={color.nombre}
                >
                  {selectedColor?.id === color.id && <CheckIcon />}
                </div>
              ))}
            </div>
          </div>

          <div className="modal-option">
            <label>Talla:</label>
            <div className="size-options">
              {todasLasTallas.map(tallaNombre => (
                  <button
                    key={tallaNombre}
                    className={`size-option ${selectedSize === tallaNombre ? 'selected' : ''}`}
                    onClick={() => handleSizeClick(tallaNombre)}
                  >
                    {tallaNombre}
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

          <button className="modal-add-btn" onClick={handleAddToCartClick} disabled={!selectedSize || !selectedColor}>
            AÑADIR A LA BOLSA
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="modal-overlay product-modal-overlay" onClick={onClose}> 
      <div className="modal-content product-modal-content" onClick={(e) => e.stopPropagation()}> 
        <button className="modal-close" onClick={onClose}>×</button>
        {renderModalContent()}
      </div>

      {showQuickConfirmationModal && itemToConfirmInModal && (
        <div className="modal-overlay confirmation-modal-overlay" onClick={handleCancelAddToCartInModal}> 
          <div className="modal-content confirmation-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>🌸CONFIRMANOS🌸</h2>
            <p>¿Estás segura de que quieres agregar:</p>
            <p><strong>{itemToConfirmInModal.nombre}</strong></p>
             {itemToConfirmInModal.talla && itemToConfirmInModal.color && (
                 <p>Talla: {itemToConfirmInModal.talla}, Color: {itemToConfirmInModal.color.nombre}</p>
             )}
             <p>Cantidad: {itemToConfirmInModal.cantidad}</p>
            <p>a la bolsa?</p>
            <div className="modal-actions">
              <button className="modal-btn confirm-btn" onClick={handleConfirmAddToCartInModal}>Confirmar</button>
              <button className="modal-btn cancel-btn" onClick={handleCancelAddToCartInModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};