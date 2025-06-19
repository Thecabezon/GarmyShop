import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Importa la configuración de Cloudinary
import { CLOUDINARY_BASE_URL } from '../../config/cloudinary';

export default function IconsComponent({ cartItems, setCartItems, favoriteItems }) {
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [cartVisible, setCartVisible] = useState(false);
    const searchInputRef = useRef(null);
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const cartRef = useRef(null);

    // Lógica del carrito (sin cambios)
    const toggleCart = () => {
      setCartVisible(!cartVisible);
    };

    const removeFromCart = (itemId) => {
      setCartItems(cartItems.filter(item => item.idUnicoCarrito !== itemId));
    };

    const getTotalItems = () => {
      return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Lógica del buscador (sin cambios)
    const toggleSearch = () => {
      setSearchVisible(!searchVisible);
    };

    useEffect(() => {
      if (searchVisible && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [searchVisible]);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setSearchVisible(false);
        }
        if (cartRef.current && !cartRef.current.contains(event.target)) {
          setCartVisible(false);
        }
      };
      if (searchVisible || cartVisible) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [searchVisible, cartVisible]);

    const handleSearch = () => {
      if (searchTerm.trim()) {
        navigate(`/buscar?query=${encodeURIComponent(searchTerm.trim())}`);
        setSearchVisible(false);
        setSearchTerm('');
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      } else if (e.key === 'Escape') {
        setSearchVisible(false);
        setSearchTerm('');
      }
    };

    const incrementQuantity = (itemId) => {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.idUnicoCarrito === itemId ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    };

    const decrementQuantity = (itemId) => {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.idUnicoCarrito === itemId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    };

  return (
    <div className="">
    <div className="icons-container" ref={containerRef}>
      <div className="icons">
        <div className="search-icon-wrapper">
          <i 
            className={`bi bi-search search-icon ${searchVisible ? 'active' : ''}`} 
            onClick={toggleSearch}
          ></i>
          <div className={`search-container ${searchVisible ? 'visible' : ''}`}>
            <div className="search-input-wrapper">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="¿Qué estás buscando?"
                className="search-input"
              />
              <button 
                className="search-button" 
                onClick={handleSearch}
                disabled={!searchTerm.trim()}
              >
                <i className="bi bi-search"></i>
              </button>
            </div>
            <button className="close-button" onClick={toggleSearch}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <i className="bi bi-person icon"></i>

        <Link to="/favoritos" className="icon-wrapper">
          <i className="bi bi-heart icon"></i>
          {favoriteItems && favoriteItems.length > 0 && (
            <span className="cart-badge">{favoriteItems.length}</span>
          )}
        </Link>
        
        <div className="cart-wrapper" >
            <div className="icon-wrapper" onClick={toggleCart}>
                <i className="bi bi-cart icon"></i>
                {getTotalItems() > 0 && (
                  <span className="cart-badge">{getTotalItems()}</span>
                )}
            </div>

          <div className={`cart-panel ${cartVisible ? 'visible' : ''}`} ref={cartRef}>
            <div className="cart-header">
              <h2>Tu carrito</h2>
              <button className="close-cart" onClick={toggleCart}>
                ✕
              </button>
            </div>

            <div className="cart-content">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <p>Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cartItems.map((item) => {
                      const imagePath = item.imagenPrincipalUrl || item.imagen;
                      const fullImageUrl = imagePath
                        ? `${CLOUDINARY_BASE_URL}/${imagePath}`
                        : 'https://dummyimage.com/150x150/f0f0f0/ccc&text=No+Img';
                        
                      return (
                        // --- INICIO DE LA ESTRUCTURA ADAPTADA A LOS ESTILOS ---
                        <div key={item.idUnicoCarrito} className="cart-item">
                          <div className="item-image">
                            <div className="placeholder-image">
                                <img src={fullImageUrl} alt={item.nombre} />
                            </div>
                          </div>
                          <div className="item-details">
                            <div className="item-info">
                              <h3>{item.nombre}</h3>
                              <p>Talla: {item.talla} / Color: {item.color.nombre}</p>
                              <div className="quantity-controls">
                                <button onClick={(e) => { e.stopPropagation(); decrementQuantity(item.idUnicoCarrito); }} className="quantity-btn">-</button>
                                <span className="quantity">{item.quantity}</span>
                                <button onClick={(e) => { e.stopPropagation(); incrementQuantity(item.idUnicoCarrito); }} className="quantity-btn">+</button>
                              </div>
                            </div>
                            <div className="item-actions">
                               <div className="item-price">S/. {(item.precio * item.quantity).toFixed(2)}</div>
                               <button onClick={(e) => { e.stopPropagation(); removeFromCart(item.idUnicoCarrito); }} className="remove-item">
                                ✕
                               </button>
                            </div>
                          </div>
                        </div>
                        // --- FIN DE LA ESTRUCTURA ADAPTADA ---
                      );
                    })}
                  </div>

                  <div className="cart-footer">
                    <button
                      className="checkout-btn"
                      onClick={() => {
                        setCartVisible(false); 
                        navigate('/finalizar_compra'); 
                      }}
                    >
                      Finalizar compra
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    {cartVisible && <div className="cart-overlay" onClick={() => setCartVisible(false)}></div>}
    </div>
  );
}