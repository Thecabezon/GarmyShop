// src/context/FilterContext.jsx

import React, { createContext, useContext, useReducer } from 'react';

// 1. Definir el estado inicial de los filtros
const initialState = {
  selectedCategories: [],
  selectedColors: [],
  selectedSizes: [],
  onlyOnSale: false,
};

// 2. Crear el contexto
const FilterContext = createContext();

// 3. Definir el reducer para manejar las acciones de filtrado
function filterReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_CATEGORY': {
      const { categoryId } = action.payload;
      const isSelected = state.selectedCategories.includes(categoryId);
      return {
        ...state,
        selectedCategories: isSelected
          ? state.selectedCategories.filter(id => id !== categoryId) // Quitar
          : [...state.selectedCategories, categoryId], // Añadir
      };
    }
    case 'TOGGLE_COLOR': {
      const { colorId } = action.payload;
      const isSelected = state.selectedColors.includes(colorId);
      return {
        ...state,
        selectedColors: isSelected
          ? state.selectedColors.filter(id => id !== colorId)
          : [...state.selectedColors, colorId],
      };
    }
    case 'TOGGLE_SIZE': {
      const { sizeId } = action.payload;
      const isSelected = state.selectedSizes.includes(sizeId);
      return {
        ...state,
        selectedSizes: isSelected
          ? state.selectedSizes.filter(id => id !== sizeId)
          : [...state.selectedSizes, sizeId],
      };
    }
    case 'TOGGLE_SALE':
      return {
        ...state,
        onlyOnSale: !state.onlyOnSale,
      };
    case 'CLEAR_FILTERS':
      return initialState; // Resetea al estado inicial
    default:
      throw new Error(`Acción desconocida: ${action.type}`);
  }
}

// 4. Crear el proveedor del contexto que envolverá tu aplicación
export function FilterProvider({ children }) {
  const [state, dispatch] = useReducer(filterReducer, initialState);

  return (
    <FilterContext.Provider value={{ filters: state, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
}

// 5. Crear y EXPORTAR el hook personalizado para usar el contexto fácilmente
//    ¡Esta es la parte que faltaba!
export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters debe ser usado dentro de un FilterProvider');
  }
  return context;
}