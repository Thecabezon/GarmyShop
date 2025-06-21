// src/components/Header/NavLinksComponent.jsx
import React from 'react'; 
import { NavLink } from 'react-router-dom';
import DropdownIcon from './DropdownIcon';
// REMOVIDO: Importaciones de MegaMenu, CategoryDropdown, menuData, HeaderDropdowns.css


// NavLinksComponent recibe el handler del padre (Header.jsx) para notificar hover/click
// También recibe el estado activo para marcar el enlace (opcional pero recomendado)
const NavLinksComponent = ({ onNavLinkHover, activeDropdown }) => {

  // Las funciones handleMouseEnter y handleMouseLeave ahora solo llaman al handler del padre
  const handleMouseEnter = (menuName) => {
    onNavLinkHover(menuName); // Notifica al padre qué menú debe estar activo
  };

   // Función para cerrar dropdowns si haces clic en un Link
   const handleLinkClick = () => {
       // Llama al handler del padre para cerrar cualquier dropdown abierto
       onNavLinkHover(null);
   };

  return (
    
    <nav className="nav-links"> 

      {/* Item Inicio */}
      {/* onMouseEnter(null) notifica al padre que ningún dropdown de nav está activo */}
      <div className="nav-item-wrapper" onMouseEnter={() => handleMouseEnter(null)}>
         <NavLink to="/" className="nav-link-item" onClick={handleLinkClick}>Inicio</NavLink>
      </div>

      {/* Item PRODUCTOS con Dropdown de Categorías */}
      {/* onMouseLeave de este wrapper no es estrictamente necesario si el onMouseLeave del <header> padre es suficiente */}
      <div className="nav-item-wrapper"
           onMouseEnter={() => handleMouseEnter('productos')}
      >
        {/* Marca el link como activo si el dropdown correspondiente está abierto */}
        <NavLink to="/tienda" className={`nav-link-item ${activeDropdown === 'productos' ? 'active' : ''}`} onClick={handleLinkClick}> 
          Productos <DropdownIcon />
        </NavLink>
        {/* REMOVIDO: El componente <CategoryDropdown /> YA NO VA AQUÍ */}
      </div>

      {/* Item OFERTAS con MegaMenu */}
      {/* onMouseLeave de este wrapper es opcional */}
      <div className="nav-item-wrapper"
           onMouseEnter={() => handleMouseEnter('ofertas')}
      >
        <NavLink to="/ofertas" className={`nav-link-item ${activeDropdown === 'ofertas' ? 'active' : ''}`} onClick={handleLinkClick}>
          Ofertas <DropdownIcon />
        </NavLink>
        {/* REMOVIDO: El componente <MegaMenu /> YA NO VA AQUÍ */}
      </div>

      {/* Item MARCAS (directo) */}
      {/* onMouseEnter(null) notifica al padre que ningún dropdown de nav está activo */}
      <div className="nav-item-wrapper" onMouseEnter={() => handleMouseEnter(null)}>
        <NavLink to="/marcas" className="nav-link-item" onClick={handleLinkClick}>Marcas</NavLink>
      </div>
      
    


    </nav>
  );
};

export default NavLinksComponent;