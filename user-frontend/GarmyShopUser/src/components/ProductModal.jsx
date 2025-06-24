
import React, { useState, useEffect, useMemo } from 'react';
import '../styles/ProductModal.css';
import PriceDisplay from './ofertas/PriceDisplay';
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
  const [combinacionesDisponibles, setCombinacionesDisponibles] = useState([]);
  const [tallasDisponibles, setTallasDisponibles] = useState([]);
  const [coloresDisponibles, setColoresDisponibles] = useState([]);

  // Usa useMemo para calcular los precios y la URL de la imagen principal
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
    const offerPrice = producto.precioOferta;
    const regularPrice = producto.precio;

    const hasOffer = offerPrice != null && offerPrice < regularPrice;
    const calculatedDisplayPrice = hasOffer ? offerPrice : regularPrice;
    const calculatedOriginalPrice = hasOffer ? regularPrice : null;

    // Construye la URL completa de la imagen principal
    const imagenPrincipalObj = producto.imagenes?.find(img => img.esPrincipal) || producto.imagenes?.[0];
    const calculatedFullMainImageUrl = imagenPrincipalObj?.imagen
      ? `${CLOUDINARY_BASE_URL}/${imagenPrincipalObj.imagen}`
      : 'https://dummyimage.com/600x600/f0f0f0/ccc&text=No+Imagen';

    return {
        fullMainImageUrl: calculatedFullMainImageUrl,
        displayPrice: calculatedDisplayPrice,
        originalPrice: calculatedOriginalPrice,
        hasOffer: hasOffer,
        formattedProducto: producto
    };
  }, [producto, isLoading]);

  // Este useEffect se encarga de actualizar la imagen inicial y resetear estados
  useEffect(() => {
    if (!isLoading && producto && producto.id) {
      setSelectedImage(fullMainImageUrl);

      // Resetea las selecciones para el nuevo producto
      setSelectedSize(null);
      setSelectedColor(null);
      setQuantity(1);

      // Procesar combinaciones disponibles
      if (producto.combinacionesDisponibles && producto.combinacionesDisponibles.length > 0) {
        setCombinacionesDisponibles(producto.combinacionesDisponibles);
        
        // Extraer tallas únicas disponibles
        const tallas = [...new Set(producto.combinacionesDisponibles
          .map(c => c.talla.nombre))]
          .map(nombreTalla => ({
            talla: nombreTalla,
            disponible: true
          }));
        setTallasDisponibles(tallas);
        
        // Extraer colores únicos disponibles
        const colores = producto.combinacionesDisponibles
          .map(c => c.color)
          .filter((color, index, self) => 
            index === self.findIndex((c) => c.id === color.id)
          );
        setColoresDisponibles(colores);
      }
    } else if (!isOpen) {
      // Si el modal se cierra o no hay producto/cargando, resetea estados
      setSelectedSize(null);
      setSelectedColor(null);
      setSelectedImage('');
      setQuantity(1);
      setCombinacionesDisponibles([]);
      setTallasDisponibles([]);
      setColoresDisponibles([]);
    }
  }, [producto, isLoading, fullMainImageUrl, isOpen]);

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
  
    // Verificar si la combinación seleccionada está disponible
    const combinacionSeleccionada = combinacionesDisponibles.find(
      c => c.talla.nombre === selectedSize && c.color.id === selectedColor.id
    );
  
    if (!combinacionSeleccionada) {
      alert("La combinación seleccionada no está disponible.");
      return;
    }
  
    // Asegúrate de que el producto en el estado tiene la estructura correcta para el carrito
    const itemToAdd = {
      ...producto,
      id: producto.id,
      nombre: producto.nombre,
      talla: selectedSize,
      color: selectedColor,
      cantidad: quantity,
      quantity: quantity, // Añadir quantity para compatibilidad
      price: displayPrice,
      displayPrice: displayPrice, // Añadir displayPrice para compatibilidad
      precio: producto.precio, // Mantener el precio original
      imagen: producto.imagenes?.find(img => img.esPrincipal)?.imagen || producto.imagenes?.[0]?.imagen || producto.imagen,
      idUnicoCarrito: `${producto.id}-${selectedSize}-${selectedColor.nombre}`
    };
  
    onAddToCart(itemToAdd);
    onClose();
    alert(`${producto.nombre} agregado al carrito!`);
  };

  // Construimos las URLs completas para las miniaturas
  const fullThumbnailUrls = producto?.imagenes?.map(
    imgObj => `${CLOUDINARY_BASE_URL}/${imgObj.imagen}`
  ) || [];

  // Función para renderizar el contenido del modal
  const renderModalContent = () => {
    // Si está cargando, muestra un spinner
    if (isLoading) {
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
            <PriceDisplay 
                regularPrice={producto.precio} 
                offerPrice={producto.precioOferta} 
            />
          </div>

          <div className="modal-option">
            <label>Color:</label>
            <div className="color-options">
              {coloresDisponibles.map(color => (
                <div
                  key={color.id}
                  className={`color-option ${selectedColor?.id === color.id ? 'selected' : ''}`}
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
              {tallasDisponibles.map(talla => (
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