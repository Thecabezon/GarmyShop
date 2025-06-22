// src/components/ProductModal.js

import React, { useState, useEffect, useMemo } from 'react'; // Importa useMemo
import '../styles/ProductModal.css';
import PriceDisplay from './ofertas/PriceDisplay'; // Importa el nuevo componente
// --- NUEVO: Importa la configuración de Cloudinary ---
import { CLOUDINARY_BASE_URL } from '../config/cloudinary';

export const ProductModal = ({
  isOpen,
  onClose,
  producto,
  onAddToCart,
  isLoading
}) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);

   // Usa useMemo para calcular los precios y la URL de la imagen principal
   // Se recalcula solo si producto o isLoading cambian
  const { fullMainImageUrl, displayPrice, originalPrice, hasOffer, formattedProducto } = useMemo(() => {
    if (isLoading || !producto?.id) {
      return {
          fullMainImageUrl: '',
          displayPrice: null,
          originalPrice: null,
          hasOffer: false,
          formattedProducto: null
      };
    }

     // Lógica para calcular displayPrice y originalPrice
     const offerPrice = producto.precioOferta; // Asumiendo que producto ya trae precioOferta
     const regularPrice = producto.precio; // Asumiendo que producto ya trae precio

     const hasOffer = offerPrice != null && offerPrice < regularPrice;
     const calculatedDisplayPrice = hasOffer ? offerPrice : regularPrice;
     const calculatedOriginalPrice = hasOffer ? regularPrice : null;

     // Construye la URL completa de la imagen principal
     // Necesitamos encontrar la imagen principal o la primera si no hay principal
     const imagenPrincipalObj = producto.imagenes?.find(img => img.esPrincipal) || producto.imagenes?.[0];
     const calculatedFullMainImageUrl = imagenPrincipalObj?.imagen
       ? `${CLOUDINARY_BASE_URL}/${imagenPrincipalObj.imagen}` // Asume que producto.imagenes es un array de objetos { imagen: 'url/parcial', esPrincipal: true/false }
       : 'https://dummyimage.com/600x600/f0f0f0/ccc&text=No+Imagen';


    return {
        fullMainImageUrl: calculatedFullMainImageUrl,
        displayPrice: calculatedDisplayPrice,
        originalPrice: calculatedOriginalPrice,
        hasOffer: hasOffer,
         // Puedes devolver el producto formateado si es necesario, aunque aquí solo necesitamos los precios e imagen
        formattedProducto: producto // Para no modificar el objeto producto original si no queremos
    };

  }, [producto, isLoading]);


  // Este useEffect se encarga de actualizar la imagen inicial y resetear estados
  useEffect(() => {
    if (!isLoading && producto && producto.imagen) { // Usa la condición similar al useMemo
      setSelectedImage(fullMainImageUrl); // Usa la URL calculada por useMemo

      // Resetea las selecciones para el nuevo producto
      setSelectedSize(null);
      setSelectedColor(null);
      setQuantity(1);
    } else if (!isOpen) {
         // Si el modal se cierra o no hay producto/cargando, resetea estados
         setSelectedSize(null);
         setSelectedColor(null);
         setSelectedImage('');
         setQuantity(1);
    }
  }, [producto, isLoading, fullMainImageUrl, isOpen]); // Añade fullMainImageUrl e isOpen a dependencias


  // Si el modal no está abierto o no hay producto (y no está cargando), no renderizamos nada
  if (!isOpen || (!isLoading && !producto?.id)) return null;


  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Por favor, selecciona una talla.");
      return;
    }
    if (!selectedColor) {
      alert("Por favor, selecciona un color.");
      return;
    }
     // Asegúrate de que el producto en el estado tiene la estructura correcta para el carrito
     // o construye el objeto itemToAdd con la información necesaria
    const itemToAdd = {
      ...producto, // Copia las propiedades existentes del producto
      // Añade las propiedades necesarias para el carrito, incluyendo el precio correcto
      id: producto.id, // ID principal del producto
      talla: selectedSize,
      color: selectedColor, // Asegúrate de que selectedColor es el objeto completo o tiene .nombre y .codigoHex
      cantidad: quantity,
      price: displayPrice, // *** USA EL displayPrice CALCULADO ***
      // Genera un ID único para el carrito (combinando ID del producto, talla y color)
      idUnicoCarrito: `${producto.id}-${selectedSize}-${selectedColor.nombre}`
    };

    onAddToCart(itemToAdd);
    onClose();
    alert(`${producto.nombre} agregado al carrito!`);
  };

   // Construimos las URLs completas para las miniaturas
   // Asume que producto.imagenes es un array de OBJETOS { imagen: 'partial/url', esPrincipal: bool }
  const fullThumbnailUrls = producto?.imagenes?.map(
    imgObj => `${CLOUDINARY_BASE_URL}/${imgObj.imagen}`
  ) || [];


  // Función para renderizar el contenido del modal
  const renderModalContent = () => {
    // Si está cargando, muestra un spinner
    if (isLoading) { // Ahora solo verifica isLoading aquí
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
            {/* Usa la URL calculada por useMemo */}
            <img src={selectedImage} alt={producto.nombre} className="modal-main-image" />
          </div>
          <div className="modal-thumbnails">
             {/* Asegúrate de que fullThumbnailUrls son URLs completas */}
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
             {/* Usa el componente PriceDisplay */}
             <PriceDisplay 
                 regularPrice={producto.precio} 
                 offerPrice={producto.precioOferta} 
             />
             {/* ELIMINA la visualización manual del precio */}
             {/* <span className="price">S/. {producto.precio.toFixed(2)}</span> */}
          </div>

          <div className="modal-option">
            <label>Color:</label>
            <div className="color-options">
               {/* Asegúrate de que producto.coloresDisponibles es un array y cada item tiene .nombre y .codigoHex */}
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
               {/* Asegúrate de que producto.tallasDisponibles es un array y cada item tiene .talla y .disponible */}
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

          <button className="modal-add-btn" onClick={handleAddToCart} disabled={!selectedSize || !selectedColor}>
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