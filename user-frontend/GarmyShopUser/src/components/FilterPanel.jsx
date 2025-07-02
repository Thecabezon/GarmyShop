// src/components/FilterPanel.jsx

import React from 'react';
import { useFilters } from '../context/FilterContext';

export function FilterPanel({ isOpen, categories, colors, sizes, counts }) {
  const { filters, dispatch } = useFilters();
  const panelClasses = `filter-panel-static ${isOpen ? 'open' : 'closed'}`;

  const handleClearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  return (
    <aside className={panelClasses}>
      <div className="filter-panel-header">
        <h3>Filtrar Por</h3>
      </div>

      <div className="filter-panel-body">
        <section className="filter-section">
          <h4>Categoría</h4>
          {categories.map(category => {
            const count = counts.categories[category.id] || 0;
            const isChecked = filters.selectedCategories.includes(category.id);
            const isDisabled = !isChecked && count === 0;
            return (
              <label key={category.id} className={`filter-option ${isDisabled ? 'disabled' : ''}`}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => dispatch({ type: 'TOGGLE_CATEGORY', payload: { categoryId: category.id } })}
                  disabled={isDisabled}
                />
                {category.nombre}
                <span className="filter-badge">{count}</span>
              </label>
            );
          })}
        </section>

        <section className="filter-section">
          <h4>Talla</h4>
          {sizes.map(size => {
            const count = counts.sizes[size.id] || 0;
            const isChecked = filters.selectedSizes.includes(size.id);
            const isDisabled = !isChecked && count === 0;
            return (
              <label key={size.id} className={`filter-option ${isDisabled ? 'disabled' : ''}`}>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => dispatch({ type: 'TOGGLE_SIZE', payload: { sizeId: size.id } })}
                  disabled={isDisabled}
                />
                {size.nombre}
                <span className="filter-badge">{count}</span>
              </label>
            );
          })}
        </section>

        <section className="filter-section">
          <h4>Color</h4>
          <div className="color-options">
            {colors.map(color => {
              const count = counts.colors[color.id] || 0;
              const isChecked = filters.selectedColors.includes(color.id);
              const isDisabled = !isChecked && count === 0;
              return (
                <label key={color.id} className={`filter-option-color ${isDisabled ? 'disabled' : ''}`} title={`${color.nombre} (${count})`}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => dispatch({ type: 'TOGGLE_COLOR', payload: { colorId: color.id } })}
                    disabled={isDisabled}
                  />
                  <span className="color-chip" style={{ backgroundColor: color.codigoHex, border: `1px solid ${color.codigoHex === '#FFFFFF' ? '#ddd' : 'transparent'}` }}></span>
                  {color.nombre}
                </label>
              );
            })}
          </div>
        </section>

        <section className="filter-section">
           <h4>Otros</h4>
           <label className="filter-option switch">
              Solo ofertas
              <input
                  type="checkbox"
                  checked={filters.onlyOnSale}
                  onChange={() => dispatch({ type: 'TOGGLE_SALE' })}
              />
              <span className="slider round"></span>
           </label>
           
           <button onClick={handleClearFilters} className="clear-filters-btn-inline">
             Limpiar filtros
           </button>
        </section>
      </div>
      
      {/* Puedes eliminar este div por completo */}
      <div className="filter-panel-footer"></div>
    </aside>
  );
}