// src/components/Header/CategoryDropdown.jsx
import React from 'react';
import HeaderCategoryItem from './HeaderCategoryItem';
// Importar el CSS específico de los dropdowns (solo estilos internos)
import '../../styles/HeaderDropdowns.css'; // Asegúrate de que esta ruta sea correcta


// CategoryDropdown recibe categories, estado de carga/error, y las props de mouse del padre (Header.jsx)
// También recibe la prop className para la visibilidad controlada por el padre
const CategoryDropdown = ({ categories, loading, error, className, onMouseEnter, onMouseLeave }) => {
    // Mensajes de estado dentro del dropdown - Asegúrate de que estos también tengan las props de mouse y clase
    if (loading) return (
        <div className={`category-dropdown ${className || ''}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
             {/* Div para el título/banner */}
             <div className="category-dropdown-header">
                <h3 className="category-dropdown-title">Cargando Categorías...</h3>
             </div>
            <p>...</p>
        </div>
    );
    if (error) return (
        <div className={`category-dropdown ${className || ''}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
             {/* Div para el título/banner */}
             <div className="category-dropdown-header">
                <h3 className="category-dropdown-title error-title">Error</h3> {/* Clase para estilo de error */}
             </div>
            <p className="error-message">Error al cargar categorías.</p>
        </div>
    );
    // Si no hay categorías, muestra un mensaje dentro del dropdown.
    if (!categories || categories.length === 0) return (
        <div className={`category-dropdown ${className || ''}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
             {/* Div para el título/banner */}
             <div className="category-dropdown-header">
                <h3 className="category-dropdown-title">Categorías</h3> {/* Título incluso si vacío */}
             </div>
             <p>No hay categorías disponibles.</p>
        </div>
    );

    // Si hay categorías, renderiza el contenido normal
    return (
        // Aplicar className, onMouseEnter, y onMouseLeave al div raíz
        <div className={`category-dropdown ${className || ''}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {/* NUEVO: Div para el título/banner dentro del dropdown */}
            {/* Puedes añadir estilos específicos para este div en HeaderDropdowns.css */}
            <div className="category-dropdown-header">
                <h3 className="category-dropdown-title"> 🌷Categorías:🌷</h3> {/* El título que quieres */}
                {/* Opcional: Añadir una pequeña descripción o subtítulo */}
                {/* <p className="category-dropdown-subtitle">Encuentra lo que buscas fácilmente.</p> */}
            </div>

            {/* Contenido de la cuadrícula de categorías */}
            <div className="category-list-grid"> 
                {categories.map(category => (
                    <HeaderCategoryItem key={category.id || category.slug} category={category} />
                ))}
            </div>
        </div>
    );
};

export default CategoryDropdown;