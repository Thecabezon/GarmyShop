
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/HeaderDropdowns.css'; 

const MegaMenu = ({ columns, className, onMouseEnter, onMouseLeave }) => { 
  return (
    <div className={`mega-menu ${className || ''}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}> {/* Estilos para el mega menú */}
      <div className="mega-menu-content"> 
        {columns && columns.map((column, index) => (
          <div key={index} className="dropdown-column"> 
            <h3 className="column-title">{column.title}</h3>
            <ul>
              {column.links && column.links.map((linkText, linkIndex) => (
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

export default MegaMenu;