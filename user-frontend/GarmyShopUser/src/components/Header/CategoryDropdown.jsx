import React from 'react';
import HeaderCategoryItem from './HeaderCategoryItem';
import '../../styles/HeaderDropdowns.css';


const CategoryDropdown = ({ categories, loading, error, className, onMouseEnter, onMouseLeave }) => {
    if (loading) return (
        <div className={`category-dropdown ${className || ''}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
             <div className="category-dropdown-header">
                <h3 className="category-dropdown-title">Cargando Categorías...</h3>
             </div>
            <p>...</p>
        </div>
    );
    if (error) return (
        <div className={`category-dropdown ${className || ''}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
             <div className="category-dropdown-header">
                <h3 className="category-dropdown-title error-title">Error</h3>
             </div>
            <p className="error-message">Error al cargar categorías.</p>
        </div>
    );
    if (!categories || categories.length === 0) return (
        <div className={`category-dropdown ${className || ''}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
             <div className="category-dropdown-header">
                <h3 className="category-dropdown-title">Categorías</h3>
             </div>
             <p>No hay categorías disponibles.</p>
        </div>
    );

    return (
        <div className={`category-dropdown ${className || ''}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <div className="category-dropdown-header">
                <h3 className="category-dropdown-title"> 🌷Categorías:🌷</h3>
            </div>

            <div className="category-list-grid"> 
                {categories.map(category => (
                    <HeaderCategoryItem key={category.id || category.slug} category={category} />
                ))}
            </div>
        </div>
    );
};

export default CategoryDropdown;