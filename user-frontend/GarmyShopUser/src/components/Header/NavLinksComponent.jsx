// src/components/Header/NavLinksComponent.jsx
import React from 'react';
// Asegúrate de que 'NavLink' se importa aquí si no está ya
import { NavLink } from 'react-router-dom'; 
import DropdownIcon from './DropdownIcon';

// NavLinksComponent recibe el handler del padre (Header.jsx) para notificar hover/click
// ELIMINAMOS: ya no necesitamos activeDropdown aquí para la clase 'active' del link
const NavLinksComponent = ({ onNavLinkHover, activeDropdown }) => { // Mantén activeDropdown si lo usas para otra cosa, pero no para la clase 'active' del link

  // Las funciones handleMouseEnter y handleMouseLeave ahora solo llaman al handler del padre
  const handleMouseEnter = (menuName) => {
    // Solo activa el dropdown si estamos en desktop (Header.jsx ya debería manejar esto con @media queries en CSS)
    // Pero la lógica de activeDropdown en Header.jsx ya tiene la condición !isMobileMenuOpen
     onNavLinkHover(menuName); // Notifica al padre qué menú debe estar activo
  };

   // Función para cerrar dropdowns si haces clic en un Link
   const handleLinkClick = () => {
       // Llama al handler del padre para cerrar cualquier dropdown abierto
       // Esto es útil para links *dentro* de dropdowns. Para los links principales
       // NavLink maneja la navegación, y el efecto de outside click o mouseleave
       // en Header.jsx debería cerrar el dropdown.
       onNavLinkHover(null); // Cerrar dropdowns al navegar
   };

  return (
    <nav className="nav-links">

      {/* Item Inicio */}
      {/* onMouseEnter(null) notifica al padre que ningún dropdown de nav está activo */}
      <div className="nav-item-wrapper" onMouseEnter={() => handleMouseEnter(null)}>
         {/* NavLink manejará la clase 'active' si la ruta es '/' */}
         <NavLink to="/" className="nav-link-item" onClick={handleLinkClick}>Inicio</NavLink>
      </div>

      {/* Item TIENDA con Dropdown de Categorías */}
      <div className="nav-item-wrapper"
           onMouseEnter={() => handleMouseEnter('productos')} // Esto activa el dropdown
           // onMouseLeave -> lo manejará el header padre
      >
        {/* NavLink manejará la clase 'active' si la ruta es '/tienda' */}
        {/* ¡ELIMINA la lógica activeDropdown para la clase 'active'! */}
        <NavLink to="/tienda" className={`nav-link-item`} onClick={handleLinkClick}>
          Tienda <DropdownIcon />
        </NavLink>
      </div>

      {/* Item OFERTAS con MegaMenu */}
      <div className="nav-item-wrapper"
           onMouseEnter={() => handleMouseEnter('ofertas')} // Esto activa el MegaMenu
           // onMouseLeave -> lo manejará el header padre
      >
        {/* ¡AÑADE la prop 'to'! NavLink manejará la clase 'active' si la ruta es '/ofertas' */}
        {/* ¡ELIMINA la lógica activeDropdown para la clase 'active'! */}
        <NavLink to="/ofertas" className={`nav-link-item`} onClick={handleLinkClick}>
          Ofertas <DropdownIcon /> {/* Opcional: si Ofertas tiene dropdown, mantén DropdownIcon */}
        </NavLink>
      </div>

      {/* Item MARCAS (directo) */}
      <div className="nav-item-wrapper" onMouseEnter={() => handleMouseEnter(null)}>
        {/* NavLink manejará la clase 'active' si la ruta es '/marcas' */}
        <NavLink to="/marcas" className="nav-link-item" onClick={handleLinkClick}>Marcas</NavLink>
      </div>

       {/* Item SOBRE NOSOTROS (directo) */}
      <div className="nav-item-wrapper" onMouseEnter={() => handleMouseEnter(null)}>
        {/* NavLink manejará la clase 'active' si la ruta es '/nosotros' */}
        <NavLink to="/nosotros" className="nav-link-item" onClick={handleLinkClick}>Sobre Nosotros</NavLink>
      </div>

      {/* Item AYUDA (directo) */}
      <div className="nav-item-wrapper" onMouseEnter={() => handleMouseEnter(null)}>
        {/* NavLink manejará la clase 'active' si la ruta es '/ayuda' */}
        <NavLink to="/ayuda" className="nav-link-item" onClick={handleLinkClick}>Ayuda</NavLink>
      </div>

    </nav>
  );
};

export default NavLinksComponent;