import React, { useState, useRef, useEffect } from 'react';
// --> 1. IMPORTAR 'Link' ADEMÁS DE 'useNavigate' para el ícono de favoritos.
import { useNavigate, Link } from 'react-router-dom';

// --> 2. AHORA EL COMPONENTE RECIBE 'favoriteItems'
export function IconsComponent({ cartItems, setCartItems, favoriteItems }) {
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [cartVisible, setCartVisible] = useState(false);
    const searchInputRef = useRef(null);
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const cartRef = useRef(null);

    // Lógica del carrito (SIN CAMBIOS)
    const toggleCart = () => {
      setCartVisible(!cartVisible);
    };

    const removeFromCart = (itemId) => {
      // Usamos el id único del carrito para evitar errores si un producto está con diferentes tallas/colores
      setCartItems(cartItems.filter(item => item.idUnicoCarrito !== itemId));
    };

    const getTotalItems = () => {
      return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Lógica del buscador (SIN CAMBIOS)
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

    // Lógica para incrementar/decrementar cantidad en el carrito (SIN CAMBIOS)
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

        {/* Ícono de Usuario (sin cambios) */}
        <i className="bi bi-person icon"></i>

        {/* --> 3. ÍCONO DE FAVORITOS ACTUALIZADO <-- */}
        {/* Envolvemos el ícono en un componente Link de react-router-dom */}
        <Link to="/favoritos" className="icon-wrapper">
          <i className="bi bi-heart icon"></i>
          {/* Mostramos el contador solo si hay favoritos */}
          {favoriteItems && favoriteItems.length > 0 && (
            <span className="cart-badge">{favoriteItems.length}</span>
          )}
        </Link>
        

        {/* Ícono y panel del Carrito (sin cambios en la lógica interna) */}
        <div className="cart-wrapper" >
            {/* --> 4. ENVUELTO EN 'icon-wrapper' PARA CONSISTENCIA DE ESTILOS */}
            <div className="icon-wrapper" onClick={toggleCart}>
                <i className="bi bi-cart icon"></i>
                {/* Mostramos el contador solo si hay items en el carrito */}
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
                    {cartItems.map((item) => (
                      <div key={item.idUnicoCarrito} className="cart-item">
                        <div className="item-image">
                            <img src={item.imagen} alt={item.nombre} />
                        </div>
                        <div className="item-details">
                          <div className="item-info">
                            <h3>{item.nombre}</h3>
                            <div className="quantity-controls">
                              <button onClick={(e) => { e.stopPropagation(); decrementQuantity(item.idUnicoCarrito); }} className="quantity-btn">-</button>
                              <span className="quantity">{item.quantity}</span>
                              <button onClick={(e) => { e.stopPropagation(); incrementQuantity(item.idUnicoCarrito); }} className="quantity-btn">+</button>
                            </div>
                          </div>
                          <div className="item-actions">
                            <button onClick={(e) => { e.stopPropagation(); removeFromCart(item.idUnicoCarrito); }} className="remove-item">
                              ✕
                            </button>
                            <div className="item-price">S/. {(item.precio * item.quantity).toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
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

export default IconsComponent;