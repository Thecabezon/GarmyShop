import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CLOUDINARY_BASE_URL } from '../../config/cloudinary';
import UserDropdown from '../Auth/UserDropdown';
import '../../styles/IconsComponent.css'; // <-- LINEA CORREGIDA AQUÍ


export function IconsComponent({
    cartItems,
    setCartItems,
    favoriteItems,
    toggleSearch,
    closeSearch,
    setActiveDropdown,
    toggleMobileMenu,
    currentUser,
    isAuthenticated,
    onAuthChange
}) {
    const [cartVisible, setCartVisible] = useState(false);
    const [userDropdownVisible, setUserDropdownVisible] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDeleteId, setItemToDeleteId] = useState(null);

    const navigate = useNavigate();
    const cartPanelRef = useRef(null);
    const iconsContainerRef = useRef(null);
    const userDropdownRef = useRef(null);
    const deleteModalRef = useRef(null);


    const toggleCart = () => {
        if (typeof closeSearch === 'function') closeSearch();
        if (typeof setActiveDropdown === 'function') setActiveDropdown(null);
        if (typeof toggleMobileMenu === 'function') toggleMobileMenu(false);
        setUserDropdownVisible(false);
        setCartVisible(prev => !prev);
        setShowDeleteModal(false);
        setItemToDeleteId(null);
    };

    const toggleUserDropdown = () => {
        if (typeof closeSearch === 'function') closeSearch();
        if (typeof setActiveDropdown === 'function') setActiveDropdown(null);
        if (typeof toggleMobileMenu === 'function') toggleMobileMenu(false);
        setCartVisible(false);
        setUserDropdownVisible(prev => !prev);
        setShowDeleteModal(false);
        setItemToDeleteId(null);
    };

    const performRemoveFromCart = (itemId) => {
        if (typeof setCartItems === 'function') {
            setCartItems(prevItems => prevItems.filter(item =>
                (item.idUnicoCarrito || item.id) !== itemId
            ));
        }
    };

    const handleRemoveClick = (itemId) => {
        setItemToDeleteId(itemId);
        setShowDeleteModal(true);
        setCartVisible(false);
        if (typeof closeSearch === 'function') closeSearch();
        if (typeof setActiveDropdown === 'function') setActiveDropdown(null);
        if (typeof toggleMobileMenu === 'function') toggleMobileMenu(false);
        setUserDropdownVisible(false);
    };

    const confirmRemoval = () => {
        if (itemToDeleteId !== null) {
            performRemoveFromCart(itemToDeleteId);
        }
        setShowDeleteModal(false);
        setItemToDeleteId(null);
    };

    const cancelRemoval = () => {
        setShowDeleteModal(false);
        setItemToDeleteId(null);
    };

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

    const getTotalItems = () => {
        if (!cartItems || !Array.isArray(cartItems)) return 0;
        return cartItems.reduce((total, item) =>
            total + (item.quantity || item.cantidad || 1), 0
        );
    };

    const getCartTotal = () => {
        if (!cartItems || !Array.isArray(cartItems)) return 0;
        return cartItems.reduce((total, item) => {
            const precio = parseFloat(item.displayPrice || item.price || item.precio) || 0;
            const cantidad = parseInt(item.quantity || item.cantidad) || 1;
            return total + (precio * cantidad);
        }, 0);
    };

    const handleCheckout = () => {
        if (typeof closeSearch === 'function') closeSearch();
        navigate('/finalizar_compra');
        setCartVisible(false);
        setShowDeleteModal(false);
        setItemToDeleteId(null);
    };

    const getFullImageUrl = (item) => {
        if (item.imagen && (item.imagen.startsWith('http') || item.imagen.startsWith('/'))) {
            return item.imagen;
        }

        if (item.imagen) {
            return `${CLOUDINARY_BASE_URL}/${item.imagen}`;
        }

        return 'https://dummyimage.com/100x100/f0f0f0/ccc&text=No+Imagen';
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cartVisible &&
                cartPanelRef.current &&
                !cartPanelRef.current.contains(event.target) &&
                iconsContainerRef.current && // Añadir esta verificación
                !iconsContainerRef.current.contains(event.target)) {
                setCartVisible(false);
            }
            if (userDropdownVisible &&
                userDropdownRef.current &&
                !userDropdownRef.current.contains(event.target) &&
                iconsContainerRef.current && iconsContainerRef.current.querySelector('.user-icon-wrapper') &&
                !iconsContainerRef.current.querySelector('.user-icon-wrapper').contains(event.target)) {
                setUserDropdownVisible(false);
            }
            if (showDeleteModal &&
                deleteModalRef.current &&
                !deleteModalRef.current.contains(event.target)
                ) {
                 const isButtonClick = event.target.closest('.modal-actions button');
                 if (!isButtonClick) {
                     cancelRemoval();
                 }
            }
        };

        if (cartVisible || userDropdownVisible || showDeleteModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [cartVisible, userDropdownVisible, showDeleteModal, cancelRemoval]);

    const handleSearchClick = () => {
        if (typeof toggleSearch === 'function') {
            toggleSearch();
        }
        if (typeof setActiveDropdown === 'function') setActiveDropdown(null);
        if (typeof toggleMobileMenu === 'function') toggleMobileMenu(false);
        setCartVisible(false);
        setUserDropdownVisible(false);
        setShowDeleteModal(false);
        setItemToDeleteId(null);
    }

    const handleMobileMenuClick = () => {
        if (typeof closeSearch === 'function') closeSearch();
        if (typeof toggleMobileMenu === 'function') {
            toggleMobileMenu();
        }
        if (typeof setActiveDropdown === 'function') setActiveDropdown(null);
        setCartVisible(false);
        setUserDropdownVisible(false);
        setShowDeleteModal(false);
        setItemToDeleteId(null);
    }

    return (
        <div className="icons-container" ref={iconsContainerRef}>
            <div className="icons">
                <div className="hamburger-icon-wrapper" onClick={handleMobileMenuClick}>
                    <i className="bi bi-list hamburger-icon"></i>
                </div>

                <div className="icon-wrapper search-icon-wrapper" onClick={handleSearchClick}>
                    <i className={`bi bi-search icon search-icon`}></i>
                </div>

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

                <Link to="/favoritos" className="icon-wrapper" onClick={() => {
                    if (typeof closeSearch === 'function') closeSearch();
                    if (typeof setActiveDropdown === 'function') setActiveDropdown(null);
                    if (typeof toggleMobileMenu === 'function') toggleMobileMenu(false);
                    setCartVisible(false);
                    setUserDropdownVisible(false);
                    setShowDeleteModal(false);
                    setItemToDeleteId(null);
                }}>
                    <i className="bi bi-heart icon"></i>
                    {favoriteItems && favoriteItems.length > 0 && (
                        <span className="cart-badge">{favoriteItems.length}</span>
                    )}
                </Link>

                <div className="cart-wrapper">
                    <div className="icon-wrapper" onClick={toggleCart}>
                        <i className="bi bi-cart icon"></i>
                        {getTotalItems() > 0 && (
                            <span className="cart-badge">{getTotalItems()}</span>
                        )}
                    </div>

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
                                                                <button className="quantity-btn" onClick={() => updateCartItemQuantity(itemId, itemQuantity - 1)}>-</button>
                                                                <span className="quantity">{itemQuantity}</span>
                                                                <button className="quantity-btn" onClick={() => updateCartItemQuantity(itemId, itemQuantity + 1)}>+</button>
                                                            </div>
                                                        </div>
                                                        <div className="item-actions">
                                                            <button className="remove-item" onClick={() => handleRemoveClick(itemId)}>🗑️</button>
                                                            <span className="item-price">S/ {(itemPrice * itemQuantity).toFixed(2)}</span>
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
                                            Ir al carrito
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {cartVisible && <div className="cart-overlay" onClick={toggleCart}></div>}
            {userDropdownVisible && <div className="user-dropdown-overlay" onClick={toggleUserDropdown}></div>}

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-container" ref={deleteModalRef}>
                        <div className="modal-content">
                            <h3>Confirmar Eliminación</h3>
                            <p>¿Estás seguro de que deseas eliminar este producto del carrito?</p>
                        </div>
                        <div className="modal-actions">
                            <button className="modal-button cancel-button" onClick={cancelRemoval}>No</button>
                            <button className="modal-button confirm-button" onClick={confirmRemoval}>Sí, eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default IconsComponent;