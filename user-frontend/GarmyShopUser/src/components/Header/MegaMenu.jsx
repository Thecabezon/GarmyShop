// src/components/Header/MegaMenu.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
// Importar el CSS específico de los dropdowns
import '../../styles/HeaderDropdowns.css'; // Asegúrate de que esta ruta sea correcta

// Asumiendo que 'columns' es un array de objetos { title: string, links: string[] }
// CLAVE: Recibir className, onMouseEnter, onMouseLeave como props
const MegaMenu = ({ columns, className, onMouseEnter, onMouseLeave }) => { 
  return (
    // CLAVE: Aplicar className, onMouseEnter, y onMouseLeave a este div raíz
    <div className={`mega-menu ${className || ''}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}> {/* Estilos para el mega menú */}
      <div className="mega-menu-content"> {/* Estilos para el contenido interno */}
        {columns && columns.map((column, index) => (
          <div key={index} className="dropdown-column"> {/* Estilos para cada columna */}
            <h3 className="column-title">{column.title}</h3> {/* Estilos para el título de la columna */}
            <ul>
              {column.links && column.links.map((linkText, linkIndex) => (
                <li key={linkIndex}>
                  {/* El enlace aquí parece ir a /tienda/slug-del-link. Asegúrate que tu ruta sea correcta */}
                  {/* Puedes añadir onClick para cerrar el mega menú si haces clic */}
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