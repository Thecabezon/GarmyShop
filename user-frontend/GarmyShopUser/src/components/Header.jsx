import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Importa los componentes hijos
import LogoComponent from './Header/LogoComponent'; // Asegúrate de que la ruta sea correcta
import NavLinksComponent from './Header/NavLinksComponent'; // Asegúrate de que la ruta sea correcta
import IconsComponent from './Header/IconsComponent'; // Asegúrate de que la ruta sea correcta
import TopBarComponent from './Header/TopBarComponent'; // Asegúrate de que la ruta sea correcta
import CategoryDropdown from './Header/CategoryDropdown'; // Asegúrate de que la ruta sea correcta
import MegaMenu from './Header/MegaMenu'; // Asegúrate de que la ruta sea correcta

// Importa los datos del menú para el MegaMenu
import { menuData } from '../data/menuData'; // Asegúrate de que la ruta sea correcta

// Importa los CSS
import '../styles/header.css'; // Asegúrate de que la ruta sea correcta
import '../styles/HeaderDropdowns.css'; // Asegúrate de que la ruta sea correcta
import '../styles/mobileMenu.css'; // Asegúrate de que la ruta sea correcta

// Importa authService para el logout en el menú móvil
import authService from './Auth/authService'; // Asegúrate de que la ruta sea correcta


// Define la URL del endpoint para categorías
const API_CATEGORIAS_URL = 'http://localhost:8085/api/categorias'; // Asegúrate de que la URL sea correcta


// El componente Header recibe las props necesarias de App.js
function Header({
    cartItems,
    setCartItems,
    favoriteItems,
    setFavoriteItems, // Recibido pero no usado en Header, es buena práctica
    handleToggleFavorite, // Recibido pero no usado en Header, es buena práctica
    currentUser,        // NUEVO: información del usuario actual
    isAuthenticated,    // NUEVO: estado de autenticación
    onAuthChange        // NUEVO: callback para cambios de autenticación
}) {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [errorCategories, setErrorCategories] = useState(null);

    // Estados existentes: Controlan la visibilidad del buscador expandido y los dropdowns
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    // Estado: Controla la visibilidad del menú móvil
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
                     console.log("Header: No content for categories.");
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                 console.log("Header: Categories fetched successfully.");
                setCategories(data);
            } catch (err) {
                setErrorCategories(err);
                console.error("Header: Error fetching categories:", err);
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
         console.log("Header: Toggling search to", newState);
    };

    // Función: Toggle del menú móvil
    const toggleMobileMenu = (forceState = null) => {
        const newState = forceState !== null ? forceState : !isMobileMenuOpen;
        setIsMobileMenuOpen(newState);
         console.log("Header: Toggling mobile menu to", newState);

        // Cierra otros elementos cuando se abre el menú móvil (o se fuerza a abrir)
        if (newState) { // Si el menú móvil se abre
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

    // Función para manejar el mouse enter/leave en links de navegación (Desktop)
    let dropdownTimeoutId = null;
    const handleNavLinkHover = (dropdownName) => {
         //console.log("Header: Mouse over nav link", dropdownName);
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

    // Función para cerrar dropdown al salir del área del header (con delay) (Desktop)
    const handleHeaderMouseLeave = () => {
         //console.log("Header: Mouse leaving header area. Setting close timeout.");
        // Establece un timeout para cerrar los dropdowns DESKTOP
        dropdownTimeoutId = setTimeout(() => {
            setActiveDropdown(null);
            dropdownTimeoutId = null; // Limpiar el ID después de ejecutar
             //console.log("Header: Dropdown close timeout finished.");
        }, 200); // Pequeño delay para permitir pasar el mouse al dropdown
    };

     // Función para mantener el dropdown/megamenu abierto si el mouse entra en él (Desktop)
    const handleDropdownMouseEnter = () => {
        //console.log("Header: Mouse entering dropdown. Clearing close timeout.");
        // Limpia el timeout para evitar que se cierre
        if (dropdownTimeoutId) {
            clearTimeout(dropdownTimeoutId);
            dropdownTimeoutId = null;
        }
    };

    // Efecto para cerrar todo al hacer clic fuera del header (Desktop/Mobile Overlays)
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Si se hace clic fuera del header, cerrar dropdowns (desktop) y buscador
            if (headerRef.current && !headerRef.current.contains(event.target)) {
                 //console.log("Header handleClickOutside: Click outside header.");
                // Cierra dropdowns (Desktop) y buscador si están activos
                if (activeDropdown !== null || isSearchActive) {
                    setActiveDropdown(null);
                    setIsSearchActive(false);
                     //console.log("Header handleClickOutside: Closed dropdowns and search.");
                }

                // Cierra el menú móvil si está abierto (manejado por su propio overlay/lógica de toggleMobileMenu)
                // La lógica del menú móvil se cierra con el overlay o el botón interno.
                // No es necesario cerrarlo aquí si el overlay ya lo maneja.
            }
        };

        // Añadir el listener si CUALQUIERA de los paneles controlados por este useEffect está visible
        // (principalmente dropdowns desktop y buscador expandido)
        // El menú móvil se cierra por su propio overlay o el botón de cerrar
        if (activeDropdown !== null || isSearchActive) {
            document.addEventListener('mousedown', handleClickOutside);
             //console.log("Header useEffect: Added mousedown listener for outside clicks.");
        } else {
            // Limpiar el listener si nada está abierto
            document.removeEventListener('mousedown', handleClickOutside);
             //console.log("Header useEffect: Removed mousedown listener.");
        }


        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
             //console.log("Header useEffect: Cleanup mousedown listener.");
        };
    }, [activeDropdown, isSearchActive, isMobileMenuOpen]); // Incluir isMobileMenuOpen aunque no lo cerremos aquí directamente


    // Lógica para el input de búsqueda expandido
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchSubmit = () => {
        if (searchTerm.trim()) {
            navigate(`/buscar?query=${encodeURIComponent(searchTerm.trim())}`);
            setIsSearchActive(false);
            setSearchTerm('');
             console.log("Header: Search submitted for", searchTerm);
        }
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        } else if (e.key === 'Escape') {
            setIsSearchActive(false);
             console.log("Header: Search cancelled via Escape.");
        }
    };

    // Handler para el logout en el menú móvil
    const handleMobileLogout = () => {
         console.log("Header: Mobile logout clicked.");
        authService.logout(); // Llama a tu servicio de logout
        if (onAuthChange) {
            onAuthChange(); // Notifica a App.js sobre el cambio de autenticación
        }
        toggleMobileMenu(false); // Cierra el menú
        navigate('/'); // Redirige a la página de inicio
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
                    toggleMobileMenu(false); // Cerrar menú móvil al hacer clic en el logo
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
                    <button className="close-button" onClick={() => toggleSearch(false)}> {/* Cambiado a toggleSearch(false) */}
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

                {/* Iconos (incluye el hamburger) - MODIFICADO para pasar nuevas props */}
                <IconsComponent
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    favoriteItems={favoriteItems}
                    setFavoriteItems={setFavoriteItems} // Pasando props que IconsComponent no usa pero Header recibe
                    handleToggleFavorite={handleToggleFavorite} // Pasando props que IconsComponent no usa
                    toggleSearch={toggleSearch}
                    setActiveDropdown={setActiveDropdown}
                    toggleMobileMenu={toggleMobileMenu}
                    currentUser={currentUser}
                    isAuthenticated={isAuthenticated}
                    onAuthChange={onAuthChange} // Pasando callback de cambio de auth
                />
            </div>

            {/* Menú Móvil Panel */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'visible' : ''}`}>
                <div className="mobile-menu-content">
                    {/* Encabezado del Menú Móvil (Logo y Cerrar) */}
                    <div className="mobile-menu-header">
                         {/* Logo/Nombre en el menú móvil */}
                        <Link to="/" className="mobile-logo-link" onClick={() => toggleMobileMenu(false)}> {/* Cerrar menú al hacer clic */}
                            <LogoComponent />
                        </Link>
                         {/* Botón para cerrar el menú móvil */}
                        <button className="mobile-menu-close-btn" onClick={() => toggleMobileMenu(false)}>
                             <i className="bi bi-x-lg"></i>
                        </button>
                    </div>

                    {/* Sección de usuario en menú móvil */}
                    <div className="mobile-user-section">
                        {isAuthenticated ? (
                            <div className="mobile-user-info">
                                <div className="mobile-user-avatar">
                                    {currentUser?.firstName?.charAt(0).toUpperCase() ||
                                     currentUser?.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="mobile-user-details">
                                    <p className="mobile-user-name">
                                        ¡Hola, {currentUser?.firstName || currentUser?.username || 'Usuario'}!
                                    </p>
                                    <p className="mobile-user-email">{currentUser?.email}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="mobile-auth-buttons">
                                <Link
                                    to="/login"
                                    className="mobile-login-btn"
                                    onClick={() => toggleMobileMenu(false)} // Cerrar menú al navegar
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    to="/registro"
                                    className="mobile-register-btn"
                                    onClick={() => toggleMobileMenu(false)} // Cerrar menú al navegar
                                >
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Enlaces de navegación para móvil */}
                    <div className="mobile-nav-links">
                        <Link
                            to="/"
                            className="mobile-nav-link"
                            onClick={() => toggleMobileMenu(false)} // Cerrar menú al navegar
                        >
                            Inicio
                        </Link>
                        <Link
                            to="/tienda"
                            className="mobile-nav-link"
                            onClick={() => toggleMobileMenu(false)} // Cerrar menú al navegar
                        >
                            Tienda
                        </Link>
                        <Link
                            to="/ofertas"
                            className="mobile-nav-link"
                            onClick={() => toggleMobileMenu(false)} // Cerrar menú al navegar
                        >
                            Ofertas
                        </Link>
                        <Link
                            to="/marcas"
                            className="mobile-nav-link"
                            onClick={() => toggleMobileMenu(false)} // Cerrar menú al navegar
                        >
                            Marcas
                        </Link>
                        <Link
                            to="/nosotros"
                            className="mobile-nav-link"
                            onClick={() => toggleMobileMenu(false)} // Cerrar menú al navegar
                        >
                            Sobre Nosotros
                        </Link>
                        <Link
                            to="/ayuda"
                            className="mobile-nav-link"
                            onClick={() => toggleMobileMenu(false)} // Cerrar menú al navegar
                        >
                            Ayuda
                        </Link>

                        {/* Enlaces específicos para usuarios autenticados */}
                        {isAuthenticated && (
                            <>
                                <div className="mobile-nav-divider"></div> {/* Línea separadora */}
                                <Link
                                    to="/perfil"
                                    className="mobile-nav-link"
                                    onClick={() => toggleMobileMenu(false)} // Cerrar menú al navegar
                                >
                                    <i className="bi bi-person-circle"></i>
                                    Mi Perfil
                                </Link>
                                <Link
                                    to="/mis-pedidos"
                                    className="mobile-nav-link"
                                    onClick={() => toggleMobileMenu(false)} // Cerrar menú al navegar
                                >
                                    <i className="bi bi-box-seam"></i>
                                    Mis Pedidos
                                </Link>
                                <Link
                                    to="/direcciones"
                                    className="mobile-nav-link"
                                    onClick={() => toggleMobileMenu(false)} // Cerrar menú al navegar
                                >
                                    <i className="bi bi-geo-alt"></i>
                                    Mis Direcciones
                                </Link>
                                {/* AÑADIR BOTÓN CERRAR SESIÓN EN MENÚ MÓVIL */}
                                <button
                                     onClick={handleMobileLogout}
                                     className="mobile-nav-link logout-button" // Puedes usar la clase logout-button para el color rojo
                                >
                                     <i className="bi bi-box-arrow-right"></i>
                                     Cerrar Sesión
                                </button>
                            </>
                        )}
                    </div>

                    {/* Categorías en el menú móvil */}
                    {categories && categories.length > 0 && (
                        <div className="mobile-categories">
                            <h3 className="mobile-section-title">Categorías</h3>
                            <div className="mobile-category-list">
                                {categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        to={`/categoria/${category.id}`}
                                        className="mobile-category-link"
                                        onClick={() => toggleMobileMenu(false)} // Cerrar menú al navegar
                                    >
                                        {category.nombre}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Overlay del menú móvil */}
            {isMobileMenuOpen && (
                <div
                    className="mobile-menu-overlay"
                    onClick={() => toggleMobileMenu(false)} // Cerrar menú al hacer clic en overlay
                ></div>
            )}

            {/* Dropdown de Categorías (Desktop) */}
            {!isMobileMenuOpen && ( // Asegurarse de que no se muestren en mobile
                <CategoryDropdown
                    categories={categories}
                    loading={loadingCategories}
                    error={errorCategories}
                    className={`category-dropdown ${activeDropdown === 'productos' ? 'visible' : ''}`}
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleHeaderMouseLeave}
                    onLinkClick={() => { setActiveDropdown(null); setIsMobileMenuOpen(false); }} // Cerrar dropdowns al hacer clic en link
                />
            )}

            {/* MegaMenu de Ofertas (Desktop) */}
             {!isMobileMenuOpen && menuData && menuData.ofertas && // Asegurarse de que no se muestren en mobile
                <MegaMenu
                    columns={menuData.ofertas}
                    className={`mega-menu ${activeDropdown === 'ofertas' ? 'visible' : ''}`}
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleHeaderMouseLeave}
                    onLinkClick={() => { setActiveDropdown(null); setIsMobileMenuOpen(false); }} // Cerrar dropdowns al hacer clic en link
                />
            }

        </header>
    );
}

export default Header;