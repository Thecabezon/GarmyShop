import React from 'react';
import { NavLink } from 'react-router-dom'; 
import DropdownIcon from './DropdownIcon';

const NavLinksComponent = ({ onNavLinkHover, activeDropdown }) => { 
  const handleMouseEnter = (menuName) => {
     onNavLinkHover(menuName); 
  };

   // Función para cerrar dropdowns si haces clic en un Link
   const handleLinkClick = () => {
       
       onNavLinkHover(null); 
   };

  return (
    <nav className="nav-links">

      {/* Item Inicio */}
      <div className="nav-item-wrapper" onMouseEnter={() => handleMouseEnter(null)}>
         <NavLink to="/" className="nav-link-item" onClick={handleLinkClick}>Inicio</NavLink>
      </div>

      {/* Item TIENDA con Dropdown de Categorías */}
      <div className="nav-item-wrapper"
           onMouseEnter={() => handleMouseEnter('productos')} // Esto activa el dropdown
           
      >
        {/* NavLink manejará la clase 'active' si la ruta es '/tienda' */}
        <NavLink to="/tienda" className={`nav-link-item`} onClick={handleLinkClick}>
          Tienda <DropdownIcon />
        </NavLink>
      </div>

      {/* Item OFERTAS con MegaMenu */}
      <div className="nav-item-wrapper"
           onMouseEnter={() => handleMouseEnter('ofertas')} // Esto activa el MegaMenu
      >
        {/* ¡AÑADE la prop 'to'! NavLink manejará la clase 'active' si la ruta es '/ofertas' */}
        <NavLink to="/ofertas" className={`nav-link-item`} onClick={handleLinkClick}>
          Ofertas <DropdownIcon /> 
        </NavLink>
      </div>

      {/* Item MARCAS */}
      <div className="nav-item-wrapper" onMouseEnter={() => handleMouseEnter(null)}>
        {/* NavLink manejará la clase 'active' si la ruta es '/marcas' */}
        <NavLink to="/marcas" className="nav-link-item" onClick={handleLinkClick}>Marcas</NavLink>
      </div>

       {/* Item SOBRE NOSOTROS  */}
      <div className="nav-item-wrapper" onMouseEnter={() => handleMouseEnter(null)}>
        {/* NavLink manejará la clase 'active' si la ruta es '/nosotros' */}
        <NavLink to="/nosotros" className="nav-link-item" onClick={handleLinkClick}>Sobre Nosotros</NavLink>
      </div>

      {/* Item AYUDA  */}
      <div className="nav-item-wrapper" onMouseEnter={() => handleMouseEnter(null)}>
        {/* NavLink manejará la clase 'active' si la ruta es '/ayuda' */}
        <NavLink to="/ayuda" className="nav-link-item" onClick={handleLinkClick}>Ayuda</NavLink>
      </div>

    </nav>
  );
};

export default NavLinksComponent;