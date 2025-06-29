
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CLOUDINARY_BASE_URL } from '../../config/cloudinary';
import UserDropdown from '../Auth/UserDropdown'; 

export function IconsComponent({ 
    cartItems, setCartItems, 
    favoriteItems, 
    toggleSearch, 
    setActiveDropdown, 
    toggleMobileMenu,
    currentUser,
    isAuthenticated,
    onAuthChange
}) {
    const [cartVisible, setCartVisible] = useState(false);
    const [userDropdownVisible, setUserDropdownVisible] = useState(false);

    const navigate = useNavigate();
    const cartPanelRef = useRef(null);
    const iconsContainerRef = useRef(null);
    const userDropdownRef = useRef(null);

    // Lógica para alternar la visibilidad del carrito
    const toggleCart = () => {
        if (typeof setActiveDropdown === 'function') { 
            setActiveDropdown(null); 
        }
        if (typeof toggleMobileMenu === 'function') { 
            toggleMobileMenu(false); 
        }
        setUserDropdownVisible(false);
        setCartVisible(prev => !prev); 
    };

    // Lógica para alternar la visibilidad del dropdown de usuario
    const toggleUserDropdown = () => {
        if (typeof setActiveDropdown === 'function') { 
            setActiveDropdown(null); 
        }
        if (typeof toggleMobileMenu === 'function') { 
            toggleMobileMenu(false); 
        }
        setCartVisible(false);
        setUserDropdownVisible(prev => !prev);
    };

    // Lógica para eliminar un ítem del carrito
    const removeFromCart = (itemId) => {
        if (typeof setCartItems === 'function') {
            setCartItems(prevItems => prevItems.filter(item => 
                (item.idUnicoCarrito || item.id) !== itemId
            ));
        }
    };

    // Función para actualizar la cantidad de un producto en el carrito
    const updateCartItemQuantity = (itemId, newQuantity) => {
        if (typeof setCartItems === 'function' && newQuantity >= 1) {
            setCartItems(prevItems => 
                prevItems.map(item => 
                    (item.idUnicoCarrito || item.id) === itemId 
                        ? { ...item, cantidad: newQuantity, quantity: newQuantity } 
                        : item
                )
            );
        }
    };

    // Calcular el total de ítems en el carrito
    const getTotalItems = () => {
        if (!cartItems || !Array.isArray(cartItems)) return 0;
        return cartItems.reduce((total, item) => 
            total + (item.quantity || item.cantidad || 1), 0
        );
    };

    // Calcular el total del carrito
    const getCartTotal = () => {
        if (!cartItems || !Array.isArray(cartItems)) return 0;
        return cartItems.reduce((total, item) => {
            const precio = parseFloat(item.displayPrice || item.price || item.precio) || 0;
            const cantidad = parseInt(item.quantity || item.cantidad) || 1;
            return total + (precio * cantidad);
        }, 0);
    };

    // Función para proceder al checkout
    const handleCheckout = () => {
        navigate('/finalizar_compra');
        setCartVisible(false);
    };

    // Función para obtener la URL completa de la imagen
    const getFullImageUrl = (item) => {
        if (item.imagen && (item.imagen.startsWith('http') || item.imagen.startsWith('/'))) {
            return item.imagen;
        }
        
        if (item.imagen) {
            return `${CLOUDINARY_BASE_URL}/${item.imagen}`;
        }
        
        return 'https://dummyimage.com/100x100/f0f0f0/ccc&text=No+Imagen';
    };

    // Efecto para cerrar paneles al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Cerrar carrito si se hace clic fuera
            if (cartVisible && 
                cartPanelRef.current && 
                !cartPanelRef.current.contains(event.target) &&
                !iconsContainerRef.current.contains(event.target)) {
                setCartVisible(false);
            }
            
            // Cerrar dropdown de usuario si se hace clic fuera
            if (userDropdownVisible && 
                userDropdownRef.current && 
                !userDropdownRef.current.contains(event.target) &&
                !iconsContainerRef.current.querySelector('.user-icon-wrapper').contains(event.target)) {
                setUserDropdownVisible(false);
            }
        };

        if (cartVisible || userDropdownVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [cartVisible, userDropdownVisible]);

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
        setCartVisible(false);
        setUserDropdownVisible(false);
    }

    // Handler para el menú hamburguesa
    const handleMobileMenuClick = () => {
        if (typeof toggleMobileMenu === 'function') {
            toggleMobileMenu();
        }
        if (typeof setActiveDropdown === 'function') { 
            setActiveDropdown(null); 
        }
        setCartVisible(false);
        setUserDropdownVisible(false);
    }

    return (
        <div className="icons-container" ref={iconsContainerRef}> 
            <div className="icons">
                {/* Ícono de Menú Hamburguesa */}
                <div className="hamburger-icon-wrapper" onClick={handleMobileMenuClick}>
                    <i className="bi bi-list hamburger-icon"></i>
                </div>

                {/* Ícono de Búsqueda (Lupa) */}
                <div className="icon-wrapper search-icon-wrapper" onClick={handleSearchClick}> 
                    <i className={`bi bi-search icon search-icon`}></i> 
                </div>

                {/* Ícono de Usuario con Dropdown */}
                <div className="icon-wrapper user-icon-wrapper" onClick={toggleUserDropdown}> 
                    <i className="bi bi-person icon"></i>
                    {isAuthenticated && (
                        <span className="user-indicator"></span>
                    )}
                    {userDropdownVisible && (
                        <div ref={userDropdownRef}>
                            <UserDropdown 
                                isAuthenticated={isAuthenticated} 
                                userInfo={currentUser} 
                                onClose={() => setUserDropdownVisible(false)}
                                onAuthChange={onAuthChange}
                            />
                        </div>
                    )}
                </div>

                {/* Ícono de Favoritos */}
                <Link to="/favoritos" className="icon-wrapper" onClick={() => { 
                    if (typeof setActiveDropdown === 'function') setActiveDropdown(null); 
                    if (typeof toggleMobileMenu === 'function') toggleMobileMenu(false); 
                    setCartVisible(false);
                    setUserDropdownVisible(false);
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
                                        {cartItems.map((item) => {
                                            const itemId = item.idUnicoCarrito || item.id;
                                            const itemQuantity = item.quantity || item.cantidad || 1;
                                            const itemPrice = parseFloat(item.displayPrice || item.price || item.precio) || 0;
                                            
                                            return (
                                                <div key={itemId} className="cart-item">
                                                    <div className="item-image">
                                                        <img src={getFullImageUrl(item)} alt={item.nombre} />
                                                    </div>
                                                    <div className="item-details">
                                                        <div className="item-info">
                                                            <h3>{item.nombre}</h3>
                                                            {item.talla && <p>Talla: {item.talla}</p>}
                                                            {item.color && <p>Color: {item.color.nombre}</p>}
                                                            <div className="quantity-controls">
                                                                <button 
                                                                    className="quantity-btn"
                                                                    onClick={() => updateCartItemQuantity(itemId, itemQuantity - 1)}
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="quantity">{itemQuantity}</span>
                                                                <button 
                                                                    className="quantity-btn"
                                                                    onClick={() => updateCartItemQuantity(itemId, itemQuantity + 1)}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="item-actions">
                                                            <button 
                                                                className="remove-item" 
                                                                onClick={() => removeFromCart(itemId)}
                                                            >
                                                                🗑️
                                                            </button>
                                                            <span className="item-price">
                                                                S/ {(itemPrice * itemQuantity).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="cart-footer">
                                        <div style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                            Total: S/ {getCartTotal().toFixed(2)}
                                        </div>
                                        <button className="checkout-btn" onClick={handleCheckout}>
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
            {/* Overlay del dropdown de usuario */}
            {userDropdownVisible && <div className="user-dropdown-overlay" onClick={toggleUserDropdown}></div>}
        </div>
    );
}

export default IconsComponent;