// src/components/Header/CategoryDropdown.jsx
import React from 'react';
import HeaderCategoryItem from './HeaderCategoryItem';
// Importar el CSS específico de los dropdowns (solo estilos internos)
import '../../styles/HeaderDropdowns.css';


// CategoryDropdown recibe categories, estado de carga/error, y las props de mouse del padre (Header.jsx)
const CategoryDropdown = ({ categories, loading, error, className, onMouseEnter, onMouseLeave }) => {
    // Mensajes de estado dentro del dropdown
    if (loading) return (
        <div className={`category-dropdown ${className || ''}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <p>Cargando categorías...</p>
        </div>
    );
    if (error) return (
        <div className={`category-dropdown ${className || ''}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <p className="error-message">Error al cargar categorías.</p>
        </div>
    );
    // Si no hay categorías, muestra un mensaje dentro del dropdown.
    if (!categories || categories.length === 0) return (
        <div className={`category-dropdown ${className || ''}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
             <p>No hay categorías disponibles.</p>
        </div>
    );

    // Si hay categorías, renderiza el contenido normal
    return (
        // CLAVE: Aplicar className, onMouseEnter, y onMouseLeave a este div raíz
        <div className={`category-dropdown ${className || ''}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <div className="category-list-grid"> {/* Estilo para mostrar los ítems en grid/columnas */}
                {categories.map(category => (
                    <HeaderCategoryItem key={category.id || category.slug} category={category} />
                ))}
            </div>
        </div>
    );
};

export default CategoryDropdown;