// src/pages/TiendaPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { ProductModal } from '../components/ProductModal';
import { RopaComponente } from '../components/RopaComponente';
import { FilterPanel } from '../components/FilterPanel';
import { FilterProvider, useFilters } from '../context/FilterContext';
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
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    const { filters } = useFilters();

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [productsRes, categoriesRes, colorsRes, sizesRes] = await Promise.all([
                    fetch('http://localhost:8085/api/productos?include=combinacionesDisponibles'),
                    fetch('http://localhost:8085/api/categorias'),
                    fetch('http://localhost:8085/api/colores'),
                    fetch('http://localhost:8085/api/tallas'),
                ]);
                if (!productsRes.ok || !categoriesRes.ok || !colorsRes.ok || !sizesRes.ok) {
                    throw new Error('Error al cargar datos. Revisa que la API esté encendida.');
                }
                const productsData = await productsRes.json();
                const categoriesData = await categoriesRes.json();
                const colorsData = await colorsRes.json();
                const sizesData = await sizesRes.json();
                setAllProducts(productsData.content || productsData);
                setCategories(categoriesData);
                setColors(colorsData);
                setSizes(sizesData);
            } catch (err) {
                setError(err.message);
                console.error("Error al obtener datos:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const filteredProducts = useMemo(() => {
        if (!allProducts.length) return [];
        return allProducts.filter(product => {
            const { selectedCategories, selectedColors, selectedSizes, onlyOnSale } = filters;
            if (selectedCategories.length > 0 && !selectedCategories.includes(product.categoria?.id)) return false;
            if (onlyOnSale && !(product.precioOferta && product.precioOferta < product.precio)) return false;
            if (selectedColors.length > 0 || selectedSizes.length > 0) {
                return product.combinacionesDisponibles?.some(combo => {
                    const colorMatch = selectedColors.length === 0 || selectedColors.includes(combo.color?.id);
                    const sizeMatch = selectedSizes.length === 0 || selectedSizes.includes(combo.talla?.id);
                    return colorMatch && sizeMatch;
                });
            }
            return true;
        });
    }, [allProducts, filters]);

    const optionCounts = useMemo(() => {
        const counts = { categories: {}, colors: {}, sizes: {} };
        if (!allProducts.length) return counts;

        const { onlyOnSale } = filters;
        const preFilteredProducts = allProducts.filter(product => 
            !onlyOnSale || (product.precioOferta && product.precioOferta < product.precio)
        );

        const categoryCounts = {};
        categories.forEach(c => categoryCounts[c.id] = 0);
        preFilteredProducts
            .filter(p => {
                const { selectedColors, selectedSizes } = filters;
                if (selectedColors.length === 0 && selectedSizes.length === 0) return true;
                return p.combinacionesDisponibles?.some(combo => 
                    (selectedColors.length === 0 || selectedColors.includes(combo.color?.id)) &&
                    (selectedSizes.length === 0 || selectedSizes.includes(combo.talla?.id))
                );
            })
            .forEach(p => {
                if (p.categoria?.id) categoryCounts[p.categoria.id]++;
            });

        const finalColorCounts = {};
        colors.forEach(c => finalColorCounts[c.id] = 0);
        preFilteredProducts
            .filter(p => !filters.selectedCategories.length || filters.selectedCategories.includes(p.categoria?.id))
            .forEach(p => {
                const uniqueColors = new Set();
                p.combinacionesDisponibles
                    ?.filter(c => !filters.selectedSizes.length || filters.selectedSizes.includes(c.talla?.id))
                    .forEach(c => uniqueColors.add(c.color?.id));
                uniqueColors.forEach(colorId => {
                    if (colorId) finalColorCounts[colorId]++;
                });
            });

        const finalSizeCounts = {};
        sizes.forEach(s => finalSizeCounts[s.id] = 0);
        preFilteredProducts
            .filter(p => !filters.selectedCategories.length || filters.selectedCategories.includes(p.categoria?.id))
            .forEach(p => {
                const uniqueSizes = new Set();
                p.combinacionesDisponibles
                    ?.filter(c => !filters.selectedColors.length || filters.selectedColors.includes(c.color?.id))
                    .forEach(c => uniqueSizes.add(c.talla?.id));
                uniqueSizes.forEach(sizeId => {
                    if (sizeId) finalSizeCounts[sizeId]++;
                });
            });

        const finalCounts = { categories: categoryCounts, colors: finalColorCounts, sizes: finalSizeCounts };
        
        // --- CONSOLE.LOG PARA DEBUG ---
        console.log('%c[DEBUG] Contadores de opciones recalculados:', 'color: blue; font-weight: bold;', finalCounts);
        
        return finalCounts;
    }, [allProducts, filters, categories, colors, sizes]);

    const handleOpenModal = async (producto) => {
        if (producto.combinacionesDisponibles) {
            setSelectedProduct(producto);
            setIsModalOpen(true);
            return;
        }
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
        return <div className="tienda-page-container"><h2 className="productos-titulo">Cargando productos...</h2></div>;
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