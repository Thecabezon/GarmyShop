// src/components/Header/IconsComponent.jsx

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
<<<<<<< HEAD
// No necesitas importar Header.css aquí si ya se importa en App.jsx o index.jsx


// IconsComponent recibe props, incluyendo handlers del padre para buscador y dropdowns
export function IconsComponent({ 
    cartItems, setCartItems, 
    favoriteItems, // solo para mostrar el badge, no necesita setter o handler aquí
    toggleSearch, // Handler del padre para mostrar/ocultar el buscador expandido
    setActiveDropdown // Handler del padre para cerrar dropdowns de navegación
}) {
    // REMOVIDO: estado local searchVisible, searchTerm, searchInputRef, containerRef
    // Estos se manejarán para el buscador expandido en Header.jsx

    // Estado local para la visibilidad del carrito (ESTE SÍ SE MANTIENE LOCAL)
    const [cartVisible, setCartVisible] = useState(false); 

=======
// Importa la configuración de Cloudinary
import { CLOUDINARY_BASE_URL } from '../../config/cloudinary';

export default function IconsComponent({ cartItems, setCartItems, favoriteItems }) {
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [cartVisible, setCartVisible] = useState(false);
    const searchInputRef = useRef(null);
    const containerRef = useRef(null);
>>>>>>> 483e88cf78232d03d98f4f8eda625afa5a07a4c1
    const navigate = useNavigate();
    // Referencia para el panel del carrito para detectar clics fuera
    const cartPanelRef = useRef(null); 

<<<<<<< HEAD
    // Referencia para el contenedor PRINCIPAL de todos los iconos
    // Útil para detectar clics fuera de la *barra* de iconos para cerrar paneles (opcional)
     const iconsContainerRef = useRef(null); 


    // Lógica para alternar la visibilidad del carrito
=======
    // Lógica del carrito (sin cambios)
>>>>>>> 483e88cf78232d03d98f4f8eda625afa5a07a4c1
    const toggleCart = () => {
      // Cierra cualquier dropdown de navegación abierto
      if (typeof setActiveDropdown === 'function') {
          setActiveDropdown(null);
      }
       // Opcional: Cierra el buscador expandido si está abierto (requiere pasar isSearchActive y su setter)
       // if (typeof toggleSearch === 'function') { toggleSearch(false); } // Asumiendo que toggleSearch puede cerrar

      setCartVisible(prev => !prev); 
    };

    // Lógica para eliminar un ítem del carrito (se mantiene)
    const removeFromCart = (itemId) => {
      setCartItems(cartItems.filter(item => item.idUnicoCarrito !== itemId));
    };

    // Calcular el total de ítems en el carrito para el badge (se mantiene)
    const getTotalItems = () => {
      return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

<<<<<<< HEAD
    // Calcular el total del carrito para mostrar en el footer del panel (se mantiene)
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.precio || 0) * item.quantity, 0).toFixed(2);
=======
    // Lógica del buscador (sin cambios)
    const toggleSearch = () => {
      setSearchVisible(!searchVisible);
>>>>>>> 483e88cf78232d03d98f4f8eda625afa5a07a4c1
    };


    // Efecto para cerrar paneles (carrito) y notificar al padre para cerrar otros (dropdowns, buscador)
    useEffect(() => {
         const handleClickOutside = (event) => {
            // Si el clic NO fue dentro del icons-container (el div raíz de este componente)
            // Y tampoco fue dentro del panel del carrito
            if (iconsContainerRef.current && !iconsContainerRef.current.contains(event.target) &&
                cartPanelRef.current && !cartPanelRef.current.contains(event.target)
               ) 
            {
              setCartVisible(false); // Cierra carrito localmente
              // Notifica al padre para cerrar dropdowns si el clic fue fuera de TODO el header (opcional)
               // if (typeof setActiveDropdown === 'function') { setActiveDropdown(null); }
            }
         };

         // Añade el listener solo si el panel del carrito está visible
         if (cartVisible) {
           document.addEventListener('mousedown', handleClickOutside);
         } else {
           document.removeEventListener('mousedown', handleClickOutside);
         }

         return () => {
           document.removeEventListener('mousedown', handleClickOutside);
         };
    }, [cartVisible, setActiveDropdown]); // Dependencias actualizadas

<<<<<<< HEAD
=======
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
>>>>>>> 483e88cf78232d03d98f4f8eda625afa5a07a4c1

  return (
    // Este es el div raíz con la clase "icons-container"
    // Es el hijo directo del "header-content-wrap" en Header.jsx
    <div className="icons-container" ref={iconsContainerRef}> 
      {/* El div con clase "icons" organiza los iconos individuales horizontalmente */}
      <div className="icons">

        {/* Ícono de Búsqueda (Lupa) */}
        {/* Este ícono SOLO debe ser visible cuando el buscador expandido NO está activo (controlado por CSS) */}
        {/* Llama a toggleSearch (handler del padre) al hacer clic */}
        <div className="icon-wrapper search-icon-wrapper" onClick={toggleSearch}> {/* Usa icon-wrapper para estilos base */}
             <i className={`bi bi-search icon search-icon`}></i> {/* Usa icon para estilos base */}
        </div>

<<<<<<< HEAD
        {/* Ícono de Usuario */}
        {/* Si tienes una página de perfil, envuelve esto en un Link */}
         <div className="icon-wrapper" onClick={() => setActiveDropdown(null)}> {/* Cierra dropdowns al hacer clic */}
            <i className="bi bi-person icon"></i>
         </div>


        {/* ÍCONO DE FAVORITOS */}
        {/* Envolvemos en Link y usamos .icon-wrapper */}
        <Link to="/favoritos" className="icon-wrapper" onClick={() => setActiveDropdown(null)}> {/* Cierra dropdowns al navegar */}
          <i className="bi bi-heart icon"></i>
          {/* Badge de favoritos */}
=======
        <i className="bi bi-person icon"></i>

        <Link to="/favoritos" className="icon-wrapper">
          <i className="bi bi-heart icon"></i>
>>>>>>> 483e88cf78232d03d98f4f8eda625afa5a07a4c1
          {favoriteItems && favoriteItems.length > 0 && (
            <span className="cart-badge">{favoriteItems.length}</span> 
          )}
        </Link>
<<<<<<< HEAD


        {/* Ícono y panel del Carrito */}
        <div className="cart-wrapper" >
            {/* .icon-wrapper para el área de clic del ícono del carrito */}
            <div className="icon-wrapper" onClick={toggleCart}> {/* Llama a toggleCart */}
                <i className="bi bi-cart icon"></i>
                {/* Badge del carrito */}
=======
        
        <div className="cart-wrapper" >
            <div className="icon-wrapper" onClick={toggleCart}>
                <i className="bi bi-cart icon"></i>
>>>>>>> 483e88cf78232d03d98f4f8eda625afa5a07a4c1
                {getTotalItems() > 0 && (
                  <span className="cart-badge">{getTotalItems()}</span>
                )}
            </div>

            {/* Panel del carrito - posicionado fixed/absolute (controlado por CSS) */}
            {/* Su visibilidad se controla con la clase 'visible' basada en el estado local cartVisible */}
            <div className={`cart-panel ${cartVisible ? 'visible' : ''}`} ref={cartPanelRef}>
                <div className="cart-header">
                  <h2>Tu carrito</h2>
                  <button className="close-cart" onClick={toggleCart}>
                    ✕
                  </button>
                </div>
<<<<<<< HEAD

                <div className="cart-content">
                  {cartItems.length === 0 ? (
                    <div className="empty-cart" style={{ textAlign: 'center', padding: '20px', color: '#777' }}>
                      <p>Tu carrito está vacío</p>
                    </div>
                  ) : (
                    <>
                      <div className="cart-items">
                        {cartItems.map((item) => (
                          <div key={item.idUnicoCarrito || item.cod} className="cart-item">
                            <div className="item-image">
                                <img 
                                    src={item.imagen || 'placeholder-image-url.jpg'} 
                                    alt={item.nombre || 'Producto'} 
                                />
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
                                <div className="item-price">S/. {((item.precio || 0) * item.quantity).toFixed(2)}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
=======
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
>>>>>>> 483e88cf78232d03d98f4f8eda625afa5a07a4c1

                      <div className="cart-footer">
                         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 'bold' }}>
                             <span>Subtotal:</span>
                             <span>S/. {getCartTotal()}</span>
                         </div>
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
      {/* Overlay que aparece cuando el carrito está visible, para cerrar al hacer clic fuera */}
      {cartVisible && <div className="cart-overlay" onClick={toggleCart}></div>}
    </div>
  );
}