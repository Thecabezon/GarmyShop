// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <-- ¡AÑADIDO useNavigate AQUÍ!

// Importa los componentes hijos
import LogoComponent from './Header/LogoComponent';
import NavLinksComponent from './Header/NavLinksComponent';
import IconsComponent from './Header/IconsComponent';
import TopBarComponent from './Header/TopBarComponent';
import CategoryDropdown from './Header/CategoryDropdown'; // Importa CategoryDropdown
import MegaMenu from './Header/MegaMenu'; // Importa MegaMenu

// Importa los datos del menú para el MegaMenu
import { menuData } from '../data/menuData';

// Importa el CSS principal del header
import '../styles/header.css';
// Importa el CSS de los dropdowns (solo estilos internos)
import '../styles/HeaderDropdowns.css';

// Define la URL del endpoint para categorías
const API_CATEGORIAS_URL = 'http://localhost:8085/api/categorias'; // <-- VERIFICA Y AJUSTA

// El componente Header recibe las props necesarias de App.js
function Header({ cartItems, setCartItems, favoriteItems, setFavoriteItems, handleToggleFavorite }) {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [errorCategories, setErrorCategories] = useState(null);

    // NUEVOS ESTADOS: Controlan la visibilidad del buscador expandido y los dropdowns
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null); 

    // Refs para manejar clics fuera del header para cerrar todo
    const headerRef = useRef(null);
    const searchInputRef = useRef(null); // Ref para el input del buscador expandido

    // Hook de navegación
    const navigate = useNavigate(); // <-- ¡AHORA ESTÁ DEFINIDO!


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
        // Cierra cualquier dropdown abierto al activar el buscador
        setActiveDropdown(null); 
        const newState = !isSearchActive;
        setIsSearchActive(newState);
    };

    // Efecto para enfocar el input del buscador cuando se activa
     useEffect(() => {
       if (isSearchActive && searchInputRef.current) {
         searchInputRef.current.focus();
       }
       // Limpiar el input cuando se desactiva
       if (!isSearchActive) {
            setSearchTerm(''); // Asumiendo que searchTerm se maneja aquí
       }
     }, [isSearchActive]);


    // Función para manejar el mouse enter/leave en links de navegación (llamada por NavLinksComponent)
    // Añadimos un timeout para el mouseleave para que no se cierre el dropdown si pasas rápidamente al dropdown
    let dropdownTimeoutId = null;
    const handleNavLinkHover = (dropdownName) => {
         // Limpia el timeout existente
         if (dropdownTimeoutId) {
             clearTimeout(dropdownTimeoutId);
             dropdownTimeoutId = null;
         }

         // Solo abre/cierra si no estamos en modo búsqueda
         if (!isSearchActive) {
            setActiveDropdown(dropdownName);
         }
    };

     // Función para cerrar dropdown al salir del área del header (con delay)
     const handleHeaderMouseLeave = () => {
          dropdownTimeoutId = setTimeout(() => {
             setActiveDropdown(null);
          }, 200); // Retraso en milisegundos (ajusta si es necesario)
     };

    // Función para mantener el dropdown/megamenu abierto si el mouse entra en él (llamada por ellos)
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
               // Si el clic NO fue dentro del header (usando la ref)
               if (headerRef.current && !headerRef.current.contains(event.target)) {
                    setActiveDropdown(null); // Cierra dropdowns
                    setIsSearchActive(false); // Cierra buscador
               }
          };

           // Solo añadir el listener si algún panel está visible
           if (activeDropdown !== null || isSearchActive) {
               document.addEventListener('mousedown', handleClickOutside);
           } else {
               document.removeEventListener('mousedown', handleClickOutside);
           }

           return () => {
               document.removeEventListener('mousedown', handleClickOutside);
           };

     }, [activeDropdown, isSearchActive]); // Dependencias

     // Lógica para el input de búsqueda expandido (estado del término y submit)
     const [searchTerm, setSearchTerm] = useState('');

     const handleSearchSubmit = () => {
        if (searchTerm.trim()) {
            navigate(`/buscar?query=${encodeURIComponent(searchTerm.trim())}`);
            setIsSearchActive(false); // Cerrar buscador después de buscar
            setSearchTerm(''); // Limpiar término
        }
     };

     const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit();
        } else if (e.key === 'Escape') {
            setIsSearchActive(false);
            // set searchTerm(''); // Opcional: Limpiar al cerrar con Escape
        }
     };


    return (
        // Contenedor principal del header con ref y onMouseLeave
        <header className="main-header" ref={headerRef} onMouseLeave={handleHeaderMouseLeave}>
            {/* La barra superior */}
            <TopBarComponent />
            
            {/* Contenedor para el logo, nav/buscador, y íconos */}
            {/* Añade la clase search-active si el buscador está activo */}
            <div className={`header-content-wrap ${isSearchActive ? 'search-active' : ''}`}>
               {/* Envuelve el LogoComponent en un Link */}
               {/* Cierra todo al hacer clic en el logo */}
               <Link to="/" className="logo-link" onClick={() => {setActiveDropdown(null); setIsSearchActive(false);}}> 
                   <LogoComponent />
               </Link>

               {/* Contenedor para el input de búsqueda expandido */}
               {/* Renderiza siempre, visibilidad controlada por CSS y clase 'visible' */}
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
                    <button className="close-button" onClick={() => setIsSearchActive(false)}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>


               {/* Navegación Principal */}
               {/* Renderiza NavLinksComponent. Su visibilidad es controlada por CSS con la clase search-active */}
               {/* Pasa el handler y estado para que NavLinksComponent notifique y sepa qué link está activo */}
               <NavLinksComponent
                   categories={categories} // Pasa categorías si NavLinksComponent las necesita por alguna razón interna
                   loading={loadingCategories}
                   error={errorCategories}
                   onNavLinkHover={handleNavLinkHover} 
                   activeDropdown={activeDropdown} 
               />

               {/* Iconos */}
               {/* Pasa las props necesarias, incluyendo handlers para buscador y dropdowns */}
               <IconsComponent
                   cartItems={cartItems}
                   setCartItems={setCartItems}
                   favoriteItems={favoriteItems}
                   setFavoriteItems={setFavoriteItems} 
                   handleToggleFavorite={handleToggleFavorite} 
                   // Pasa el handler para togglear el buscador expandido
                   toggleSearch={toggleSearch} 
                   // Pasa el handler para cerrar dropdowns de navegación desde los iconos
                   setActiveDropdown={setActiveDropdown} 
               />
            </div>

            {/* Dropdown de Categorías (renderizado directamente en Header.jsx, hermano de header-content-wrap) */}
            {/* Su visibilidad se controla con la clase 'visible' basada en el estado 'activeDropdown' */}
             <CategoryDropdown 
                 categories={categories}
                 loading={loadingCategories}
                 error={errorCategories}
                 className={`category-dropdown ${activeDropdown === 'productos' ? 'visible' : ''}`} // Añade la clase visible
                 onMouseEnter={handleDropdownMouseEnter} // Mantener abierto si el mouse entra en el dropdown
                 onMouseLeave={handleHeaderMouseLeave} // Cierra con delay al salir
             />

            {/* MegaMenu de Ofertas (renderizado directamente en Header.jsx) - Similar a Categorías */}
             {/* Renderiza solo si activeDropdown es 'ofertas' Y los datos existen */}
             {menuData && menuData.ofertas && 
                <MegaMenu 
                    columns={menuData.ofertas} 
                    className={`mega-menu ${activeDropdown === 'ofertas' ? 'visible' : ''}`} // Añade la clase visible
                    onMouseEnter={handleDropdownMouseEnter} // Mantener abierto si el mouse entra en el dropdown
                    onMouseLeave={handleHeaderMouseLeave} // Cierra con delay al salir
                />
             }

             {/* Otros dropdowns/mega menus aquí de forma similar */}

        </header>
    );
}

export default Header;