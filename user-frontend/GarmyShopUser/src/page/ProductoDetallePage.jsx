import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PriceDisplay from '../components/ofertas/PriceDisplay';
import '../styles/ProductoDetalle.css';
import { CLOUDINARY_BASE_URL } from '../config/cloudinary';
import { API_BASE_URL } from '../config/apiConfig';
import { toast } from 'react-toastify';
import { FaHeart, FaRegHeart } from "react-icons/fa";

export const ProductoDetallePage = ({ handleAddToCart, handleToggleFavorite, favoriteItems, isAuthenticated }) => {
  const { cod } = useParams();
  const [productoActual, setProductoActual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('descripcion');
  const [combinacionesDisponibles, setCombinacionesDisponibles] = useState([]);

  // Modal de confirmación
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemToConfirm, setItemToConfirm] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProductoDetalle = async () => {
      setLoading(true);
      setError(null);
      setSelectedSize(null);
      setSelectedColor(null);
      setQuantity(1);

      try {
        const response = await fetch(`${API_BASE_URL}/api/productos/${cod}`);
        if (!response.ok) throw new Error('Producto no encontrado.');
        const apiData = await response.json();

        const imagenPrincipalPath = apiData.imagenes.find(img => img.esPrincipal)?.imagen || apiData.imagenes[0]?.imagen;
        const fullImagenPrincipal = imagenPrincipalPath
          ? `${CLOUDINARY_BASE_URL}/${imagenPrincipalPath}`
          : 'https://dummyimage.com/600x600/f0f0f0/ccc&text=No+Imagen';
        const fullListaImagenes = apiData.imagenes.map(img => `${CLOUDINARY_BASE_URL}/${img.imagen}`);
        const hasOffer = apiData.precioOferta != null && apiData.precioOferta < apiData.precio;
        const displayPrice = hasOffer ? apiData.precioOferta : apiData.precio;
        const originalPrice = hasOffer ? apiData.precio : null;

        setCombinacionesDisponibles(apiData.combinacionesDisponibles || []);

        const productoFormateado = {
          id: apiData.id,
          cod: apiData.id,
          nombre: apiData.nombre,
          precio: apiData.precio,
          precioOferta: apiData.precioOferta,
          displayPrice: displayPrice,
          originalPrice: originalPrice,
          sku: apiData.sku,
          descripcion: apiData.descripcion,
          imagenes: fullListaImagenes,
          combinacionesDisponibles: apiData.combinacionesDisponibles,
          detalles: "Fabricado con materiales de alta calidad para garantizar durabilidad y confort.",
          infoEnvio: "Envío estándar de 3-5 días hábiles. Devoluciones gratuitas dentro de los 30 días."
        };
        setProductoActual(productoFormateado);
        setSelectedImage(fullImagenPrincipal);

        // Restaurar selección previa si existe
        const preLoginSelection = sessionStorage.getItem('preLoginSelection');
        if (preLoginSelection) {
          const { cod: savedCod, selectedSize, selectedColorId, quantity } = JSON.parse(preLoginSelection);
          if (savedCod === productoFormateado.cod) {
            setSelectedSize(selectedSize);
            // Espera a que combinacionesDisponibles esté lista
            setTimeout(() => {
              // Busca el objeto color correcto por ID
              const colorObj = apiData.combinacionesDisponibles
                ?.map(c => c.color)
                .find(c => c.id === selectedColorId);
              if (colorObj) setSelectedColor(colorObj);
            }, 0);
            setQuantity(quantity);
          }
          sessionStorage.removeItem('preLoginSelection');
        }
      } catch (err) {
        setError(err.message);
        toast.error(`Error al cargar el producto: ${err.message}`);
      } finally {
        setLoading(false);
        window.scrollTo(0, 0);
      }
    };

    fetchProductoDetalle();
  }, [cod]);

  // ================= LÓGICA DE FILTRADO DINÁMICO =================

  // Todas las tallas únicas (siempre disponibles)
  const allUniqueSizes = useMemo(() => {
    if (!combinacionesDisponibles.length) return [];
    return [...new Set(combinacionesDisponibles.map(c => c.talla.nombre))];
  }, [combinacionesDisponibles]);

  // Todos los colores únicos (siempre disponibles)
  const allUniqueColors = useMemo(() => {
    if (!combinacionesDisponibles.length) return [];
    return combinacionesDisponibles
      .map(c => c.color)
      .filter((color, idx, self) =>
        idx === self.findIndex(c2 => c2.id === color.id)
      );
  }, [combinacionesDisponibles]);

  const enabledColorIds = useMemo(() => {
    if (!selectedSize) {
      return combinacionesDisponibles.map(c => c.color.id);
    }
    return combinacionesDisponibles
      .filter(c => c.talla.nombre === selectedSize)
      .map(c => c.color.id);
  }, [selectedSize, combinacionesDisponibles]);

  const handleSelectSize = (sizeName) => {
    setSelectedSize(sizeName);
    // Si el color seleccionado no está disponible para la talla, lo deseleccionamos
    const colorIdsForSize = combinacionesDisponibles
      .filter(c => c.talla.nombre === sizeName)
      .map(c => c.color.id);
    if (!colorIdsForSize.includes(selectedColor?.id)) {
      setSelectedColor(null);
    }
  };

  const handleSelectColor = (color) => {
    setSelectedColor(color);
    // No tocamos la talla seleccionada
  };

  // --- Lógica del carrito, favoritos y renderizado ---
  const handleAddToCartClick = () => {
    if (!selectedSize || !selectedColor) return;
    if (!isAuthenticated) {
      // Guarda la selección en sessionStorage
      sessionStorage.setItem('preLoginSelection', JSON.stringify({
        cod: productoActual.cod,
        selectedSize,
        selectedColorId: selectedColor.id,
        quantity
      }));
      toast.info('Debes iniciar sesión para agregar productos al carrito.');
      navigate('/login', {
        state: {
          from: location,
          action: 'addToCart',
          productId: productoActual.id
        }
      });
      return;
    }
    const combinacionSeleccionada = combinacionesDisponibles.find(c => c.talla.nombre === selectedSize && c.color.id === selectedColor.id);
    if (!combinacionSeleccionada) {
      toast.error("La combinación seleccionada no está disponible.");
      return;
    }
    const item = {
      ...productoActual,
      talla: selectedSize,
      color: selectedColor,
      cantidad: quantity,
      price: productoActual.displayPrice,
      imagen: productoActual.imagenes?.[0] || '',
      idUnicoCarrito: `${productoActual.id}-${combinacionSeleccionada.id}`,
      combinacionProductoId: combinacionSeleccionada.id
    };
    setItemToConfirm(item);
    setShowConfirmationModal(true);
  };

  const handleConfirmAddToCart = () => {
    if (itemToConfirm) handleAddToCart(itemToConfirm);
    setShowConfirmationModal(false);
  };
  const handleCancelAddToCart = () => setShowConfirmationModal(false);
  const handleToggleFavoriteClick = () => { if (productoActual) handleToggleFavorite(productoActual) };
  const isFavorite = favoriteItems?.some(item => item.id === productoActual?.id) || false;

  if (loading) return <div className="page-status"><h1>Cargando...</h1></div>;
  if (error) return <div className="page-status"><h1>Error: {error}</h1></div>;
  if (!productoActual) return <div className="page-status"><h1>Producto no disponible.</h1></div>;

  return (
    <div className="detalle-page-container">
      <div className="product-layout">
        {/* Galería de imágenes */}
        <div className="product-gallery-layout">
          <div className="thumbnail-list">
            {productoActual.imagenes.map((fullImgUrl, index) => (
              <div key={index} className={`thumbnail-item ${selectedImage === fullImgUrl ? 'active' : ''}`} onClick={() => setSelectedImage(fullImgUrl)}>
                <img src={fullImgUrl} alt={`Vista previa ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="main-image-container">
            <img src={selectedImage} alt={productoActual.nombre} className="main-image" />
          </div>
        </div>

        <div className="product-info-layout">
          <h1>{productoActual.nombre}</h1>
          <div className="price-section"><PriceDisplay regularPrice={productoActual.precio} offerPrice={productoActual.precioOferta} /></div>
          <p className="product-short-description">{productoActual.descripcion?.substring(0, 150)}...</p>

          {/* Selectores de talla y color (con orden cambiado y lógica correcta) */}
          <div className="options-group">
            <div className="option-block">
              <label>Color</label>
              <div className="color-selector">
                {allUniqueColors.map(color => {
                  const isAvailable = enabledColorIds.includes(color.id);
                  return (
                    <div
                      key={color.id}
                      title={isAvailable ? color.nombre : `${color.nombre} (no disponible para esta talla)`}
                      className={`color-swatch ${selectedColor?.id === color.id ? 'active' : ''} ${!isAvailable ? 'disabled' : ''}`}
                      style={{ backgroundColor: color.codigoHex }}
                      onClick={() => isAvailable && handleSelectColor(color)}
                    />
                  );
                })}
              </div>
            </div>
            <div className="option-block">
              <label>Talla</label>
              <div className="size-selector">
                {allUniqueSizes.map(sizeName => (
                  <button
                    key={sizeName}
                    onClick={() => handleSelectSize(sizeName)}
                    className={`size-btn ${selectedSize === sizeName ? 'active' : ''}`}
                  >
                    {sizeName}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="actions-group">
            <div className="quantity-selector">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <input type="text" value={quantity} readOnly />
              <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCartClick}
              disabled={!selectedSize || !selectedColor}
            >
              AÑADIR A LA BOLSA
            </button>
            { /* 
            <button className={`favorite-btn ${isFavorite ? 'favorited' : ''}`} onClick={handleToggleFavoriteClick}>
              {isFavorite ? <FaHeart className="icon favorite-icon" /> : <FaRegHeart className="icon" />}
              <span>{isFavorite ? 'En Favoritos' : 'Añadir a Favoritos'}</span>
            </button> */}
          </div>

          <p className="sku-info">SKU: {productoActual.sku}</p>
          <div className="info-tabs">
            <div className="tab-headers">
              <button onClick={() => setActiveTab('descripcion')} className={activeTab === 'descripcion' ? 'active' : ''}>Descripción</button>
              <button onClick={() => setActiveTab('detalles')} className={activeTab === 'detalles' ? 'active' : ''}>Detalles</button>
            </div>
            <div className="tab-content">
              {activeTab === 'descripcion' && <p>{productoActual.descripcion}</p>}
              {activeTab === 'detalles' && <p>{productoActual.detalles}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showConfirmationModal && itemToConfirm && (
        <div className="modal-overlay confirmation-modal-overlay" onClick={handleCancelAddToCart}>
          <div className="modal-content confirmation-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>🌸CONFIRMANOS🌸</h2>
            <p>¿Estás segura de que quieres agregar:</p>
            <p><strong>{itemToConfirm.nombre}</strong></p>
            {itemToConfirm.talla && itemToConfirm.color && (<p>Talla: {itemToConfirm.talla}, Color: {itemToConfirm.color.nombre}</p>)}
            <p>Cantidad: {itemToConfirm.cantidad}</p>
            <p>a la bolsa?</p>
            <div className="modal-actions">
              <button className="modal-btn confirm-btn" onClick={handleConfirmAddToCart}>Confirmar</button>
              <button className="modal-btn cancel-btn" onClick={handleCancelAddToCart}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};