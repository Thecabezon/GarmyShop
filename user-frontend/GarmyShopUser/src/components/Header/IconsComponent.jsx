// src/components/Header/IconsComponent.jsx

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// IconsComponent recibe props, incluyendo handlers del padre para buscador, dropdowns, y MENÚ MÓVIL
export function IconsComponent({ 
    cartItems, setCartItems, 
    favoriteItems, 
    toggleSearch, 
    setActiveDropdown, 
    toggleMobileMenu // Handler del menú móvil del padre
}) {
    // Estado local para la visibilidad del carrito
    const [cartVisible, setCartVisible] = useState(false); 

    const navigate = useNavigate();
    const cartPanelRef = useRef(null); 
    const iconsContainerRef = useRef(null); 

    // Lógica para alternar la visibilidad del carrito
    const toggleCart = () => {
        if (typeof setActiveDropdown === 'function') { 
            setActiveDropdown(null); 
        }
        // Cierra menú móvil si está abierto
        if (typeof toggleMobileMenu === 'function') { 
            toggleMobileMenu(false); 
        }
        setCartVisible(prev => !prev); 
    };

    // Lógica para eliminar un ítem del carrito
    const removeFromCart = (itemId) => {
        if (typeof setCartItems === 'function') {
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        }
    };

    // Calcular el total de ítems en el carrito
    const getTotalItems = () => {
        if (!cartItems || !Array.isArray(cartItems)) return 0;
        return cartItems.reduce((total, item) => total + (item.cantidad || 1), 0);
    };

    // Calcular el total del carrito
    const getCartTotal = () => {
        if (!cartItems || !Array.isArray(cartItems)) return 0;
        return cartItems.reduce((total, item) => {
            const precio = parseFloat(item.precio) || 0;
            const cantidad = parseInt(item.cantidad) || 1;
            return total + (precio * cantidad);
        }, 0);
    };

    // Efecto para cerrar paneles al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (iconsContainerRef.current && !iconsContainerRef.current.contains(event.target) &&
                cartPanelRef.current && !cartPanelRef.current.contains(event.target)
            ) {
                setCartVisible(false); 
            }
        };

        if (cartVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [cartVisible]);

    // Handler para el ícono de búsqueda
    const handleSearchClick = () => {
        if (typeof toggleSearch === 'function') {
            toggleSearch();
        }
        if (typeof setActiveDropdown === 'function') { 
            setActiveDropdown(null); 
        }
        if (typeof toggleMobileMenu === 'function') { 
            toggleMobileMenu(false); 
        }
    }

    // NUEVO: Handler para el menú hamburguesa
    const handleMobileMenuClick = () => {
        if (typeof toggleMobileMenu === 'function') {
            toggleMobileMenu(); // Toggle del menú móvil
        }
        if (typeof setActiveDropdown === 'function') { 
            setActiveDropdown(null); 
        }
        setCartVisible(false); // Cierra el carrito si está abierto
    }

    return (
        <div className="icons-container" ref={iconsContainerRef}> 
            <div className="icons">

                {/* NUEVO: Ícono de Menú Hamburguesa */}
                <div className="hamburger-icon-wrapper" onClick={handleMobileMenuClick}>
                    <i className="bi bi-list hamburger-icon"></i>
                </div>

                {/* Ícono de Búsqueda (Lupa) */}
                <div className="icon-wrapper search-icon-wrapper" onClick={handleSearchClick}> 
                    <i className={`bi bi-search icon search-icon`}></i> 
                </div>

                {/* Ícono de Usuario */}
                <div className="icon-wrapper" onClick={() => { 
                    if (typeof setActiveDropdown === 'function') setActiveDropdown(null); 
                    if (typeof toggleMobileMenu === 'function') toggleMobileMenu(false); 
                }}> 
                    <i className="bi bi-person icon"></i>
                </div>

                {/* Ícono de Favoritos */}
                <Link to="/favoritos" className="icon-wrapper" onClick={() => { 
                    if (typeof setActiveDropdown === 'function') setActiveDropdown(null); 
                    if (typeof toggleMobileMenu === 'function') toggleMobileMenu(false); 
                }}> 
                    <i className="bi bi-heart icon"></i>
                    {favoriteItems && favoriteItems.length > 0 && (
                        <span className="cart-badge">{favoriteItems.length}</span> 
                    )}
                </Link>

                {/* Ícono y panel del Carrito */}
                <div className="cart-wrapper">
                    <div className="icon-wrapper" onClick={toggleCart}>
                        <i className="bi bi-cart icon"></i>
                        {getTotalItems() > 0 && (
                            <span className="cart-badge">{getTotalItems()}</span>
                        )}
                    </div>

                    {/* Panel del carrito */}
                    <div className={`cart-panel ${cartVisible ? 'visible' : ''}`} ref={cartPanelRef}>
                        <div className="cart-header">
                            <h2>Tu carrito</h2>
                            <button className="close-cart" onClick={toggleCart}> ✕ </button>
                        </div>
                        <div className="cart-content">
                            {cartItems.length === 0 ? (
                                <div className="empty-cart" style={{ textAlign: 'center', padding: '20px', color: '#777' }}>
                                    <p>Tu carrito está vacío</p>
                                </div>
                            ) : (
                                <>
                                    <div className="cart-items">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="cart-item">
                                                <div className="item-image">
                                                    <img src={item.imagen || '/placeholder-image.jpg'} alt={item.nombre} />
                                                </div>
                                                <div className="item-details">
                                                    <div className="item-info">
                                                        <h3>{item.nombre}</h3>
                                                        <div className="quantity-controls">
                                                            <button className="quantity-btn">-</button>
                                                            <span className="quantity">{item.cantidad || 1}</span>
                                                            <button className="quantity-btn">+</button>
                                                        </div>
                                                    </div>
                                                    <div className="item-actions">
                                                        <button 
                                                            className="remove-item" 
                                                            onClick={() => removeFromCart(item.id)}
                                                        >
                                                            🗑️
                                                        </button>
                                                        <span className="item-price">
                                                            S/ {(parseFloat(item.precio || 0) * (item.cantidad || 1)).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="cart-footer">
                                        <div style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                            Total: S/ {getCartTotal().toFixed(2)}
                                        </div>
                                        <button className="checkout-btn">
                                            Proceder al checkout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Overlay del carrito */}
            {cartVisible && <div className="cart-overlay" onClick={toggleCart}></div>}
        </div>
    );
}

export default IconsComponent;