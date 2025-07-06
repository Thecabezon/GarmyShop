import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LogoComponent from './Header/LogoComponent';
import NavLinksComponent from './Header/NavLinksComponent';
import IconsComponent from './Header/IconsComponent';
import TopBarComponent from './Header/TopBarComponent';
import CategoryDropdown from './Header/CategoryDropdown';
import MegaMenu from './Header/MegaMenu';
import { API_BASE_URL } from '../config/apiConfig';

import { menuData } from '../data/menuData';

import '../styles/header.css';
import '../styles/HeaderDropdowns.css';
import '../styles/mobileMenu.css';

import authService from './Auth/authService';


const API_CATEGORIAS_URL = `${API_BASE_URL}/api/categorias`;


function Header({
    cartItems,
    setCartItems,
    favoriteItems,
    setFavoriteItems,
    handleToggleFavorite,
    currentUser,
    isAuthenticated,
    onAuthChange
}) {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [errorCategories, setErrorCategories] = useState(null);

    const [isSearchActive, setIsSearchActive] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const headerRef = useRef(null);
    const searchInputRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();

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
                console.error("Header: Error fetching categories:", err);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!isSearchActive) {
            return;
        }
        if (searchTerm.trim() === '') {
            if (location.pathname === '/buscar' && location.search !== '') {
                 navigate('/buscar', { replace: true });
            }
            return;
        }
        const handler = setTimeout(() => {
            navigate(`/buscar?query=${encodeURIComponent(searchTerm)}`);
        }, 400);
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm, isSearchActive, navigate, location]);

    const toggleSearch = () => {
        const newState = !isSearchActive;
        setIsSearchActive(newState);

        if (newState) {
            setActiveDropdown(null);
            setIsMobileMenuOpen(false);
            setTimeout(() => searchInputRef.current?.focus(), 100);
        } else {
            setSearchTerm('');
        }
    };

    const closeSearch = () => {
        if(isSearchActive) {
            setIsSearchActive(false);
            setSearchTerm('');
        }
    }

    const toggleMobileMenu = (forceState = null) => {
        const newState = forceState !== null ? forceState : !isMobileMenuOpen;
        setIsMobileMenuOpen(newState);

        if (newState) {
            setActiveDropdown(null);
            setIsSearchActive(false);
        }
    };

    useEffect(() => {
        if (isSearchActive && searchInputRef.current) {
            searchInputRef.current.focus();
        }
        if (!isSearchActive) {
            setSearchTerm('');
        }
    }, [isSearchActive]);

    let dropdownTimeoutId = null;
    const handleNavLinkHover = (dropdownName) => {
        if (dropdownTimeoutId) {
            clearTimeout(dropdownTimeoutId);
            dropdownTimeoutId = null;
        }
        if (!isSearchActive && !isMobileMenuOpen) {
            setActiveDropdown(dropdownName);
        }
    };

    const handleHeaderMouseLeave = () => {
        dropdownTimeoutId = setTimeout(() => {
            setActiveDropdown(null);
            dropdownTimeoutId = null;
        }, 200);
    };

    const handleDropdownMouseEnter = () => {
        if (dropdownTimeoutId) {
            clearTimeout(dropdownTimeoutId);
            dropdownTimeoutId = null;
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (headerRef.current && !headerRef.current.contains(event.target)) {
                if (activeDropdown !== null || isSearchActive) {
                    setActiveDropdown(null);
                    setIsSearchActive(false);
                }
            }
        };
        if (activeDropdown !== null || isSearchActive) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeDropdown, isSearchActive, isMobileMenuOpen]);

    const handleMobileLogout = () => {
        authService.logout();
        if (onAuthChange) {
            onAuthChange();
        }
        toggleMobileMenu(false);
        navigate('/');
    };

    return (
        <header className="main-header" ref={headerRef} onMouseLeave={handleHeaderMouseLeave}>
            <TopBarComponent />

            <div className={`header-content-wrap ${isSearchActive ? 'search-active' : ''}`}>
                <Link to="/" className="logo-link" onClick={() => {
                    setActiveDropdown(null);
                    closeSearch();
                    toggleMobileMenu(false);
                }}>
                    <LogoComponent />
                </Link>

                <div className={`search-input-container ${isSearchActive ? 'visible' : ''}`}>
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="¿Qué producto estás buscando?"
                        className="search-input"
                    />
                    <button className="search-button" disabled>
                        <i className="bi bi-search"></i>
                    </button>
                    <button className="close-button" onClick={toggleSearch}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <NavLinksComponent
                    categories={categories}
                    loading={loadingCategories}
                    error={errorCategories}
                    onNavLinkHover={handleNavLinkHover}
                    activeDropdown={activeDropdown}
                />

                <IconsComponent
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    favoriteItems={favoriteItems}
                    setFavoriteItems={setFavoriteItems}
                    handleToggleFavorite={handleToggleFavorite}
                    toggleSearch={toggleSearch}
                    closeSearch={closeSearch}
                    setActiveDropdown={setActiveDropdown}
                    toggleMobileMenu={toggleMobileMenu}
                    currentUser={currentUser}
                    isAuthenticated={isAuthenticated}
                    onAuthChange={onAuthChange}
                />
            </div>

            <div className={`mobile-menu ${isMobileMenuOpen ? 'visible' : ''}`}>
                <div className="mobile-menu-content">
                    <div className="mobile-menu-header">
                        <Link to="/" className="mobile-logo-link" onClick={() => toggleMobileMenu(false)}>
                            <LogoComponent />
                        </Link>
                        <button className="mobile-menu-close-btn" onClick={() => toggleMobileMenu(false)}>
                             <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div className="mobile-user-section">
                        {isAuthenticated ? (
                            <div className="mobile-user-info">
                                <div className="mobile-user-avatar">
                                    {currentUser?.firstName?.charAt(0).toUpperCase() || currentUser?.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="mobile-user-details">
                                    <p className="mobile-user-name">¡Hola, {currentUser?.firstName || currentUser?.username || 'Usuario'}!</p>
                                    <p className="mobile-user-email">{currentUser?.email}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="mobile-auth-buttons">
                                <Link to="/login" className="mobile-login-btn" onClick={() => toggleMobileMenu(false)}>Iniciar Sesión</Link>
                                <Link to="/registro" className="mobile-register-btn" onClick={() => toggleMobileMenu(false)}>Registrarse</Link>
                            </div>
                        )}
                    </div>
                    <div className="mobile-nav-links">
                        <Link to="/" className="mobile-nav-link" onClick={() => toggleMobileMenu(false)}>🌸Inicio</Link>
                        <Link to="/tienda" className="mobile-nav-link" onClick={() => toggleMobileMenu(false)}>🌸Tienda</Link>
                        <Link to="/marcas" className="mobile-nav-link" onClick={() => toggleMobileMenu(false)}>🌸Marcas</Link>
                        <Link to="/nosotros" className="mobile-nav-link" onClick={() => toggleMobileMenu(false)}>🌸Sobre Nosotros</Link>
                        <Link to="/contacto" className="mobile-nav-link" onClick={() => toggleMobileMenu(false)}>🌸Contacto</Link>
                        {isAuthenticated && (
                            <>
                                <div className="mobile-nav-divider"></div>
                                <Link to="/mis-pedidos" className="mobile-nav-link" onClick={() => toggleMobileMenu(false)}><i className="bi bi-box-seam"></i> Mis Pedidos</Link>
                                <button onClick={handleMobileLogout} className="mobile-nav-link logout-button"><i className="bi bi-box-arrow-right"></i> Cerrar Sesión</button>
                            </>
                        )}
                    </div>
                    {categories && categories.length > 0 && (
                        <div className="mobile-categories">
                            <h3 className="mobile-section-title">Categorías</h3>
                            <div className="mobile-category-list">
                                {categories.map((category) => (
                                    <Link key={category.id} to={`/tienda?categoria=${category.id}`} className="mobile-category-link" onClick={() => toggleMobileMenu(false)}>{category.nombre}</Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isMobileMenuOpen && <div className="mobile-menu-overlay" onClick={() => toggleMobileMenu(false)}></div>}
            {!isMobileMenuOpen && <CategoryDropdown categories={categories} loading={loadingCategories} error={errorCategories} className={`category-dropdown ${activeDropdown === 'productos' ? 'visible' : ''}`} onMouseEnter={handleDropdownMouseEnter} onMouseLeave={handleHeaderMouseLeave} onLinkClick={() => { setActiveDropdown(null); setIsMobileMenuOpen(false); }} />}
            {!isMobileMenuOpen && menuData && menuData.ofertas && <MegaMenu columns={menuData.ofertas} className={`mega-menu ${activeDropdown === 'ofertas' ? 'visible' : ''}`} onMouseEnter={handleDropdownMouseEnter} onMouseLeave={handleHeaderMouseLeave} onLinkClick={() => { setActiveDropdown(null); setIsMobileMenuOpen(false); }} />}
        </header>
    );
}

export default Header;