import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { menuData } from '../../data/menuData'; // Asegúrate que la ruta al archivo sea correcta

const DropdownIcon = () => (
  <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '6px', transform: 'translateY(1px)' }}>
    <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
  </svg>
);

const MegaMenu = ({ columns }) => {
  return (
    <div className="mega-menu">
      <div className="mega-menu-content">
        {columns.map((column, index) => (
          <div key={index} className="dropdown-column">
            <h3 className="column-title">{column.title}</h3>
            <ul>
              {column.links.map((linkText, linkIndex) => (
                <li key={linkIndex}>
                  <NavLink to={`/tienda/${linkText.toLowerCase().replace(/ /g, '-')}`}>{linkText}</NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const NavLinksComponent = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMouseEnter = (menuName) => {
    setActiveMenu(menuName);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
    <nav className="nav-links" onMouseLeave={handleMouseLeave}>
      
      <div className="nav-item-wrapper" onMouseEnter={() => handleMouseEnter(null)}> {/* Oculta otros menús al pasar por aquí */}
         <NavLink to="/" className="nav-link-item">
            Inicio
         </NavLink>
      </div>

      <div className="nav-item-wrapper" onMouseEnter={() => handleMouseEnter('ropa')}>
        <NavLink to="/tienda" className="nav-link-item">
          Productos <DropdownIcon />
        </NavLink>
        {activeMenu === 'ropa' && <MegaMenu columns={menuData.ropa} />}
      </div>


      <div className="nav-item-wrapper" onMouseEnter={() => handleMouseEnter('ofertas')}>
        <NavLink to="/ofertas" className="nav-link-item">
          Ofertas <DropdownIcon />
        </NavLink>
        {activeMenu === 'ofertas' && <MegaMenu columns={menuData.ofertas} />}
      </div>

      <div className="nav-item-wrapper" onMouseEnter={() => handleMouseEnter(null)}>
        <NavLink to="/marcas" className="nav-link-item">
          Marcas
        </NavLink>
      </div>
    </nav>
  );
};

export default NavLinksComponent;