import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

  export function IconsComponent({ cartItems, setCartItems }) {
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [cartVisible, setCartVisible] = useState(false);
    const searchInputRef = useRef(null);
    const containerRef = useRef(null);
    const navigate = useNavigate();


    const cartRef = useRef(null);

    const toggleCart = () => {
      setCartVisible(!cartVisible);
    };

    const removeFromCart = (itemId) => {
      setCartItems(cartItems.filter(item => item.cod !== itemId));
    };

    const getTotalItems = () => {
      return cartItems.reduce((total, item) => total + item.quantity, 0);
    };



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
          item.cod === itemId ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    };

    const decrementQuantity = (itemId) => {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.cod === itemId && item.quantity > 1
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
        <i className="bi bi-heart icon"></i>

        <div className="cart-wrapper" >
          <i className="bi bi-cart icon" onClick={toggleCart}></i>
          <span className="cart-badge">{getTotalItems()}</span>

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
                      <div key={item.cod} className="cart-item">
                        <div className="item-image">
                          <div className="placeholder-image">
                            <img src={item.imagen} alt={item.nombre} />
                          </div>
                          <span className="quantity-indicator">{item.quantity}</span>
                        </div>
                        <div className="item-details">
                          <div className="item-info">
                            <h3>{item.nombre}</h3>
                            <p>Descripción: {item.descripcion}</p>
                            <p>Categoria: {item.categoria}</p>
                            <div className="quantity-controls">
                              <button  onClick={(e) => {e.stopPropagation(); decrementQuantity(item.cod);}}  className="quantity-btn">-</button>
                              <span className="quantity">{item.quantity}</span>
                              <button onClick={(e) => {e.stopPropagation(); incrementQuantity(item.cod);}}  className="quantity-btn">+</button>
                            </div>
                          </div>
                          <div className="item-actions">
                            <button  onClick={(e) => {e.stopPropagation(); removeFromCart(item.cod);}} className="remove-item" >
                              ✕
                            </button>
                            <div className="item-price">S/.  {item.precio}</div>
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
