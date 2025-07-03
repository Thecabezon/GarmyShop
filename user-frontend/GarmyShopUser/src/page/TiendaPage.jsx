// src/page/TiendaPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductModal } from '../components/ProductModal';
import { RopaComponente } from '../components/RopaComponente';
import { FilterPanel } from '../components/FilterPanel';
import { FilterProvider, useFilters } from '../context/FilterContext';
import { useData } from '../context/DataContext'; // 1. Importamos nuestro nuevo hook
import '../styles/Tienda.css';
import '../styles/FilterPanel.css';

const FilterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
);

export function TiendaPage({ handleAddToCart, favoriteItems, handleToggleFavorite }) {
    return (
        <FilterProvider>
            <TiendaContent
                handleAddToCart={handleAddToCart}
                favoriteItems={favoriteItems}
                handleToggleFavorite={handleToggleFavorite}
            />
        </FilterProvider>
    );
}

function TiendaContent({ handleAddToCart, favoriteItems, handleToggleFavorite }) {
    // 2. Tomamos TODOS los datos y el estado de carga desde nuestro almacén central
    const { 
        products: allProducts, 
        categories, 
        colors, 
        sizes, 
        loading, 
        error 
    } = useData();

    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(window.innerWidth > 768);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    const { filters, dispatch } = useFilters();
    const [searchParams] = useSearchParams();

    // 3. ELIMINAMOS el useEffect que hacía el fetch. ¡Ya no es necesario!
    // La carga de datos ahora es manejada por DataProvider.

    useEffect(() => {
        const categoriaIdFromUrl = searchParams.get('categoria');
        if (categoriaIdFromUrl) {
            const categoriaIdNum = parseInt(categoriaIdFromUrl, 10);
            if (!filters.selectedCategories.includes(categoriaIdNum)) {
                dispatch({ type: 'CLEAR_FILTERS' });
                dispatch({ type: 'TOGGLE_CATEGORY', payload: { categoryId: categoriaIdNum } });
            }
        }
    }, [searchParams, dispatch]);

    // La lógica de filtrado y conteo no necesita cambios, ya funciona con los datos del almacén.
    const filteredProducts = useMemo(() => {
        if (loading || !allProducts.length) return [];
        return allProducts.filter(product => {
            const { selectedCategories, selectedColors, selectedSizes, onlyOnSale } = filters;
            
            if (selectedCategories.length > 0 && !selectedCategories.includes(product.categoriaId)) {
                 return false;
            }

            if (onlyOnSale && !(product.precioOferta && product.precioOferta < product.precio)) return false;

            // Para talla y color, necesitaríamos el producto detallado.
            // Por ahora, este filtro no funcionará con los datos de lista. Lo dejaremos para una mejora futura.
            
            return true;
        });
    }, [allProducts, filters, loading]);

    const optionCounts = useMemo(() => {
        // Esta lógica necesitaría una revisión si quisiéramos que los contadores fueran perfectos.
        // Por ahora, la dejamos funcional pero simple.
        const counts = { categories: {}, colors: {}, sizes: {} };
        if (loading || !allProducts.length) return counts;

        filteredProducts.forEach(p => {
            if(p.categoriaId) {
                counts.categories[p.categoriaId] = (counts.categories[p.categoriaId] || 0) + 1;
            }
        });
        return counts;

    }, [filteredProducts, loading]);

    const handleOpenModal = async (producto) => {
        setModalLoading(true);
        setIsModalOpen(true);
        setSelectedProduct({ nombre: "Cargando..." });
        try {
            const response = await fetch(`http://localhost:8085/api/productos/${producto.id}`);
            if (!response.ok) throw new Error('No se pudieron cargar los detalles.');
            const productoCompleto = await response.json();
            setSelectedProduct(productoCompleto);
        } catch (err) {
            alert('Hubo un error al cargar el producto.');
            handleCloseModal();
        } finally {
            setModalLoading(false);
        }
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
        setModalLoading(false);
    };

    if (loading) {
        return <div className="tienda-page-container"><h2 className="productos-titulo">Cargando datos de la tienda...</h2></div>;
    }
    if (error) {
        return <div className="tienda-page-container"><h2 className="productos-titulo" style={{color: 'red'}}>Error: {error}</h2></div>;
    }

    return (
        <div className="tienda-page-container">
            <div className="tienda-header-section">
                <h2 className="productos-titulo">Nuestros Productos</h2>
                <button 
                    className="toggle-filter-btn" 
                    onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                    aria-label={isFilterPanelOpen ? "Cerrar filtros" : "Abrir filtros"}
                    aria-expanded={isFilterPanelOpen}
                >
                    <FilterIcon />
                    Filtrar
                </button>
            </div>

            <div className="tienda-main-content">
                <FilterPanel
                    isOpen={isFilterPanelOpen}
                    categories={categories}
                    colors={colors}
                    sizes={sizes}
                    counts={optionCounts}
                />
                
                <div className={`product-grid-container ${isFilterPanelOpen ? 'filters-open' : ''}`}>
                    {filteredProducts.length > 0 ? (
                        <div className="ropa-lista">
                            {filteredProducts.map((producto) => (
                                <RopaComponente
                                    key={producto.id}
                                    producto={producto}
                                    isLiked={favoriteItems.some(item => item.id === producto.id)}
                                    handleOpenModal={() => handleOpenModal(producto)}
                                    handleToggleFavorite={handleToggleFavorite}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="no-results-message">
                            <h3>No hay resultados</h3>
                            <p>No hay productos que coincidan con tu selección.</p>
                        </div>
                    )}
                </div>
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                producto={selectedProduct}
                onAddToCart={handleAddToCart}
                isLoading={modalLoading}
            />
        </div>
    );
}