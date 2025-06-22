// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Importa los componentes hijos
import LogoComponent from './Header/LogoComponent'; // Asegúrate de que LogoComponent es exportado correctamente
import NavLinksComponent from './Header/NavLinksComponent';
import IconsComponent from './Header/IconsComponent';
import TopBarComponent from './Header/TopBarComponent';
import CategoryDropdown from './Header/CategoryDropdown';
import MegaMenu from './Header/MegaMenu';

// Importa los datos del menú para el MegaMenu
import { menuData } from '../data/menuData';

// Importa los CSS
import '../styles/header.css';
import '../styles/HeaderDropdowns.css';
// ¡NUEVO! Importa el CSS específico para el menú móvil
import '../styles/mobileMenu.css'; // ¡Creamos este archivo en el Paso 2!


// Define la URL del endpoint para categorías
const API_CATEGORIAS_URL = 'http://localhost:8085/api/categorias';

// El componente Header recibe las props necesarias de App.js
function Header({ cartItems, setCartItems, favoriteItems, setFavoriteItems, handleToggleFavorite }) {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [errorCategories, setErrorCategories] = useState(null);

    // Estados existentes: Controlan la visibilidad del buscador expandido y los dropdowns
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null); 

    // NUEVO ESTADO: Controla la visibilidad del menú móvil
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Refs para manejar clics fuera del header para cerrar todo
    const headerRef = useRef(null);
    const searchInputRef = useRef(null);

    // Hook de navegación
    const navigate = useNavigate();

    // Fetchear categorías al montar
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const response = await fetch(API_CATEGORIAS_URL);

                if (response.status === 204) {
                    setCategories([]);
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setCategories(data);
            } catch (err) {
                setErrorCategories(err);
                console.error("Error fetching categories for header:", err);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    // Función para togglear el buscador expandido
    const toggleSearch = () => {
        // Cierra cualquier dropdown abierto y el menú móvil al activar el buscador
        setActiveDropdown(null); 
        setIsMobileMenuOpen(false);
        const newState = !isSearchActive;
        setIsSearchActive(newState);
    };

    // NUEVA FUNCIÓN: Toggle del menú móvil
    const toggleMobileMenu = (forceState = null) => {
        if (forceState !== null) {
            setIsMobileMenuOpen(forceState);
        } else {
            setIsMobileMenuOpen(prev => !prev);
        }
        
        // Cierra otros elementos cuando se abre el menú móvil (o se fuerza a abrir)
        if (forceState === true || (!isMobileMenuOpen && forceState === null)) {
            setActiveDropdown(null);
            setIsSearchActive(false);
        }
    };

    // Efecto para enfocar el input del buscador cuando se activa
    useEffect(() => {
        if (isSearchActive && searchInputRef.current) {
            searchInputRef.current.focus();
        }
        // Limpiar el input cuando se desactiva
        if (!isSearchActive) {
            setSearchTerm('');
        }
    }, [isSearchActive]);

    // Función para manejar el mouse enter/leave en links de navegación
    let dropdownTimeoutId = null;
    const handleNavLinkHover = (dropdownName) => {
        // Limpia el timeout existente
        if (dropdownTimeoutId) {
            clearTimeout(dropdownTimeoutId);
            dropdownTimeoutId = null;
        }

        // Solo abre/cierra si no estamos en modo búsqueda o menú móvil
        if (!isSearchActive && !isMobileMenuOpen) {
            setActiveDropdown(dropdownName);
        }
    };

    // Función para cerrar dropdown al salir del área del header (con delay)
    const handleHeaderMouseLeave = () => {
        dropdownTimeoutId = setTimeout(() => {
            setActiveDropdown(null);
        }, 200);
    };

    // Función para mantener el dropdown/megamenu abierto si el mouse entra en él
    const handleDropdownMouseEnter = () => {
        // Limpia el timeout para evitar que se cierre
        if (dropdownTimeoutId) {
            clearTimeout(dropdownTimeoutId);
            dropdownTimeoutId = null;
        }
    };

    // Efecto para cerrar todo al hacer clic fuera del header
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Si el clic NO fue dentro del header (usando la ref) Y NO fue dentro del cart panel (si está visible)
            // (La lógica del cart panel es mejor manejarla dentro de IconsComponent,
            // pero para el menú móvil y search, este listener global es efectivo)
            if (headerRef.current && !headerRef.current.contains(event.target)) {
                 // Solo cerramos si el clic fue realmente fuera de CUALQUIER panel/elemento activo
                 // Esto es una simplificación, una lógica más robusta consideraría si el clic fue en el cartPanelRef, etc.
                 // Pero para menú móvil y search, `headerRef` es suficiente si IconsComponent maneja su propio overlay/outside click
                 // Let's rely on IconsComponent handling its cart panel clicks.
                
                 // Cierra dropdowns y buscador si están activos
                if (activeDropdown !== null || isSearchActive) {
                    setActiveDropdown(null); 
                    setIsSearchActive(false); 
                }
                
                // Cierra el menú móvil SOLO si el clic fue fuera del header Y el menú móvil está abierto
                // (IconsComponent ya maneja el cierre del carrito al abrir/cerrar el menú móvil)
                if (isMobileMenuOpen) {
                     setIsMobileMenuOpen(false); 
                }
            }
             // Note: A more precise outside click handler might be needed if panels overlap or have complex interactions,
             // but given the current structure where mobile menu/search close other things, this might be sufficient.
             // IconsComponent's cart logic already has its own outside click handler using cartPanelRef and iconsContainerRef.
        };

        // Añadir el listener si CUALQUIERA de los paneles controlados aquí está visible
        if (activeDropdown !== null || isSearchActive || isMobileMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            // Limpiar el listener si nada está abierto
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeDropdown, isSearchActive, isMobileMenuOpen]); 


    // Lógica para el input de búsqueda expandido
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchSubmit = () => {
        if (searchTerm.trim()) {
            navigate(`/buscar?query=${encodeURIComponent(searchTerm.trim())}`);
            setIsSearchActive(false);
            setSearchTerm('');
        }
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        } else if (e.key === 'Escape') {
            setIsSearchActive(false);
        }
    };

    return (
        // Contenedor principal del header con ref y onMouseLeave
        <header className="main-header" ref={headerRef} onMouseLeave={handleHeaderMouseLeave}>
            {/* La barra superior */}
            <TopBarComponent />
            
            {/* Contenedor para el logo, nav/buscador, y íconos */}
            <div className={`header-content-wrap ${isSearchActive ? 'search-active' : ''}`}>
                {/* Logo principal (visible en desktop) */}
                <Link to="/" className="logo-link" onClick={() => {
                    setActiveDropdown(null); 
                    setIsSearchActive(false);
                    setIsMobileMenuOpen(false); // Cerrar menú móvil también al hacer clic en el logo principal
                }}> 
                    <LogoComponent />
                </Link>

                {/* Contenedor para el input de búsqueda expandido */}
                <div className={`search-input-container ${isSearchActive ? 'visible' : ''}`}>
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearchKeyPress}
                        placeholder="¿Qué estás buscando?"
                        className="search-input"
                    />
                    <button
                        className="search-button"
                        onClick={handleSearchSubmit}
                        disabled={!searchTerm.trim()}
                    >
                        <i className="bi bi-search"></i>
                    </button>
                    {/* Botón para cerrar el buscador */}
                    <button className="close-button" onClick={() => setIsSearchActive(false)}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                {/* Navegación Principal (visible en desktop) */}
                <NavLinksComponent
                    categories={categories}
                    loading={loadingCategories}
                    error={errorCategories}
                    onNavLinkHover={handleNavLinkHover} 
                    activeDropdown={activeDropdown} 
                />

                {/* Iconos (incluye el hamburger) */}
                <IconsComponent
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    favoriteItems={favoriteItems}
                    setFavoriteItems={setFavoriteItems} 
                    handleToggleFavorite={handleToggleFavorite} 
                    toggleSearch={toggleSearch} 
                    setActiveDropdown={setActiveDropdown}
                    toggleMobileMenu={toggleMobileMenu} // Pasa la función toggle del menú móvil
                />
            </div>

            {/* NUEVO: Menú Móvil Panel */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'visible' : ''}`}>
                <div className="mobile-menu-content">
                    {/* NUEVO: Encabezado del Menú Móvil (Logo y Cerrar) */}
                    <div className="mobile-menu-header">
                         {/* Logo/Nombre en el menú móvil */}
                        <Link to="/" className="mobile-logo-link" onClick={() => setIsMobileMenuOpen(false)}> 
                            <LogoComponent /> {/* Reutiliza el LogoComponent */}
                        </Link>
                         {/* Botón para cerrar el menú móvil */}
                        <button className="mobile-menu-close-btn" onClick={() => toggleMobileMenu(false)}>
                             <i className="bi bi-x-lg"></i> {/* Icono de cerrar */}
                        </button>
                    </div>

                    {/* Enlaces de navegación para móvil */}
                    <div className="mobile-nav-links">
                    <Link 
                            to="/" 
                            className="mobile-nav-link"
                            onClick={() => setIsMobileMenuOpen(false)} // Cerrar menú al hacer clic
                        >
                            Inicio
                        </Link>
                        <Link 
                            to="/Tienda" 
                            className="mobile-nav-link"
                            onClick={() => setIsMobileMenuOpen(false)} // Cerrar menú al hacer clic
                        >
                            Tienda
                        </Link>
                        <Link 
                            to="/ofertas" 
                            className="mobile-nav-link"
                            onClick={() => setIsMobileMenuOpen(false)} // Cerrar menú al hacer clic
                        >
                            Ofertas
                        </Link>
                         {/* Puedes añadir más enlaces aquí si es necesario */}
                         <Link 
                            to="/marcas" 
                            className="mobile-nav-link"
                            onClick={() => setIsMobileMenuOpen(false)} // Cerrar menú al hacer clic
                        >
                            Marcas
                        </Link>

                        <Link 
                            to="/nosotros"
                            className="mobile-nav-link"
                            onClick={() => setIsMobileMenuOpen(false)} // Cerrar menú al hacer clic
                        >
                            Sobre Nosotros
                        </Link>

                        <Link 
                            to="/ayuda"
                            className="mobile-nav-link"
                            onClick={() => setIsMobileMenuOpen(false)} // Cerrar menú al hacer clic
                        >
                            Ayuda
                        </Link>
                    </div>

                    {/* Categorías en el menú móvil */}
                    {categories && categories.length > 0 && (
                        <div className="mobile-categories">
                            <h3 className="mobile-section-title">Categorías</h3>
                            <div className="mobile-category-list">
                                {/* Mapear todas las categorías, no solo 6 */}
                                {categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        to={`/categoria/${category.id}`}
                                        className="mobile-category-link"
                                        onClick={() => setIsMobileMenuOpen(false)} // Cerrar menú al hacer clic
                                    >
                                        {category.nombre}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                     {/* Puedes añadir otros elementos aquí si quieres, como enlaces a redes sociales, etc. */}
                </div>
            </div>

            {/* Overlay del menú móvil */}
            {isMobileMenuOpen && (
                <div 
                    className="mobile-menu-overlay" 
                    onClick={() => setIsMobileMenuOpen(false)} // Cerrar menú al hacer clic en el overlay
                ></div>
            )}

            {/* Dropdown de Categorías (Desktop) */}
            {/* Asegúrate de que estos dropdowns no se muestren si el menú móvil está abierto */}
            {!isMobileMenuOpen && (
                <CategoryDropdown 
                    categories={categories}
                    loading={loadingCategories}
                    error={errorCategories}
                    className={`category-dropdown ${activeDropdown === 'productos' ? 'visible' : ''}`}
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleHeaderMouseLeave}
                    // Pasa handler para cerrar menú móvil si se abren estos (aunque deberían estar ocultos por CSS)
                    onLinkClick={() => { setActiveDropdown(null); setIsMobileMenuOpen(false); }} 
                />
            )}

            {/* MegaMenu de Ofertas (Desktop) */}
             {/* Asegúrate de que estos menús no se muestren si el menú móvil está abierto */}
             {!isMobileMenuOpen && menuData && menuData.ofertas && 
                <MegaMenu 
                    columns={menuData.ofertas} 
                    className={`mega-menu ${activeDropdown === 'ofertas' ? 'visible' : ''}`}
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleHeaderMouseLeave}
                     // Pasa handler para cerrar menú móvil si se abren estos (aunque deberían estar ocultos por CSS)
                    onLinkClick={() => { setActiveDropdown(null); setIsMobileMenuOpen(false); }} 
                />
            }

        </header>
    );
}

export default Header;