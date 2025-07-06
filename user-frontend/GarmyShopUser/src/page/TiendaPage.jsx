import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductModal } from '../components/ProductModal';
import { RopaComponente } from '../components/RopaComponente';
import { FilterPanel } from '../components/FilterPanel';
import { FilterProvider, useFilters } from '../context/FilterContext';
import { useData } from '../context/DataContext';
import '../styles/Tienda.css';
import '../styles/FilterPanel.css';
import { API_BASE_URL } from '../config/apiConfig';

const FilterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
);

export function TiendaPage({ handleAddToCart, favoriteItems, handleToggleFavorite, isAuthenticated }) {
    return (
        <FilterProvider>
            <TiendaContent
                handleAddToCart={handleAddToCart}
                favoriteItems={favoriteItems}
                handleToggleFavorite={handleToggleFavorite}
                isAuthenticated={isAuthenticated}
            />
        </FilterProvider>
    );
}

function TiendaContent({ handleAddToCart, favoriteItems, handleToggleFavorite, isAuthenticated }) {
    const {
        products: allProducts,
        categories,
        colors,
        sizes,
        loading,
        error
    } = useData();

    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    const { filters, dispatch } = useFilters();
    const [searchParams] = useSearchParams();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleOpenModal = async (producto) => {
        setIsModalOpen(true);
        setModalLoading(true);
        setSelectedProduct({ nombre: "Cargando..." }); 

        try {
            const response = await fetch(`${API_BASE_URL}/api/productos/${producto.id}`);
            if (!response.ok) {
                throw new Error('No se pudieron cargar los detalles del producto.');
            }
            const productoCompleto = await response.json();

            setSelectedProduct(productoCompleto);

        } catch (error) {
            console.error("Error al obtener detalles del producto para el modal:", error);
            alert('Hubo un error al cargar el producto. Por favor, inténtalo de nuevo.');
            setIsModalOpen(false);
            setSelectedProduct(null);
        } finally {
            setModalLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    useEffect(() => {
        const categoriaIdFromUrl = searchParams.get('categoria');
        if (categoriaIdFromUrl) {
            const categoriaIdNum = parseInt(categoriaIdFromUrl, 10);
            if (!filters.selectedCategories.includes(categoriaIdNum)) {
                dispatch({ type: 'CLEAR_FILTERS' });
                dispatch({ type: 'TOGGLE_CATEGORY', payload: { categoryId: categoriaIdNum } });
                setCurrentPage(1);
            }
        }
    }, [searchParams, dispatch, filters]);

    const optionCounts = useMemo(() => {
        const counts = { categories: {}, colors: {}, sizes: {} };
        if (loading || !allProducts.length) return counts;

        const tempCounts = { colors: {}, sizes: {} };

        allProducts.forEach(p => {
            const categoriaId = p.categoriaId || (p.categoria && p.categoria.id);
            if (categoriaId) {
                counts.categories[categoriaId] = (counts.categories[categoriaId] || 0) + 1;
            }

            if (p.combinacionesDisponibles) {
                const productColors = new Set();
                const productSizes = new Set();

                p.combinacionesDisponibles.forEach(combinacion => {
                    if (combinacion.color && combinacion.color.id) productColors.add(combinacion.color.id);
                    if (combinacion.talla && combinacion.talla.id) productSizes.add(combinacion.talla.id);
                });

                productColors.forEach(colorId => {
                    tempCounts.colors[colorId] = (tempCounts.colors[colorId] || 0) + 1;
                });
                productSizes.forEach(sizeId => {
                    tempCounts.sizes[sizeId] = (tempCounts.sizes[sizeId] || 0) + 1;
                });
            }
        });

        counts.colors = tempCounts.colors;
        counts.sizes = tempCounts.sizes;

        return counts;
    }, [allProducts, loading]);

    const filteredProducts = useMemo(() => {
        if (loading || !allProducts.length) return [];

        const result = allProducts.filter(product => {
            const { selectedCategories, selectedColors, selectedSizes, onlyOnSale } = filters;

            const categoriaId = product.categoriaId || (product.categoria && product.categoria.id);
            if (selectedCategories.length > 0 && !selectedCategories.includes(categoriaId)) return false;

            if (onlyOnSale && !(product.precioOferta && product.precioOferta < product.precio)) return false;

            if (selectedColors.length > 0) {
                const hasSelectedColor = product.combinacionesDisponibles?.some(c =>
                    selectedColors.includes(c.color.id)
                );
                if (!hasSelectedColor) return false;
            }
            if (selectedSizes.length > 0) {
                const hasSelectedSize = product.combinacionesDisponibles?.some(c =>
                    selectedSizes.includes(c.talla.id)
                );
                if (!hasSelectedSize) return false;
            }

            return true;
        });

        const totalPagesAfterFilter = Math.ceil(result.length / itemsPerPage);
        if (currentPage > totalPagesAfterFilter && totalPagesAfterFilter > 0) {
            setCurrentPage(totalPagesAfterFilter);
        } else if (result.length > 0 && currentPage === 0) {
            setCurrentPage(1);
        } else if (result.length === 0 && currentPage !== 1) {
            setCurrentPage(1);
        }

        return result;
    }, [allProducts, filters, loading, currentPage, itemsPerPage]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredProducts.length / itemsPerPage);
    }, [filteredProducts.length, itemsPerPage]);

    const productsForPage = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredProducts.slice(startIndex, endIndex);
    }, [filteredProducts, currentPage, itemsPerPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo(0, 0);
        }
    };

    const pageNumbers = useMemo(() => {
        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    }, [totalPages, currentPage, itemsPerPage]);

    if (loading) {
        return <div className="tienda-page-container"><h2 className="productos-titulo">Cargando...</h2></div>;
    }
    if (error) {
        return <div className="tienda-page-container"><h2 className="productos-titulo" style={{ color: 'red' }}>Error: {error.message || 'Error al cargar productos.'}</h2></div>;
    }

    return (
        <div className="tienda-page-container">
            <div className="tienda-header-section">
                <h2 className="productos-titulo"> 🌸Nuestros Productos:</h2>
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
                    {productsForPage.length > 0 ? (
                        <div className="ropa-lista">
                            {productsForPage.map((producto) => (
                                <RopaComponente
                                    key={producto.id}
                                    producto={producto}
                                    isLiked={favoriteItems.some(item => item.id === producto.id)}
                                    handleOpenModal={handleOpenModal}
                                    handleToggleFavorite={handleToggleFavorite}
                                    isAuthenticated={isAuthenticated} 
                                />
                            ))}
                        </div>
                    ) : (
                        filteredProducts.length === 0 && (
                            <div className="no-results-message">
                                <h3>No hay resultados</h3>
                                <p>No hay productos que coincidan con tu selección.</p>
                            </div>
                        )
                    )}

                    {totalPages > 1 && filteredProducts.length > 0 && (
                        <div className="pagination-controls">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="pagination-button"
                            >
                                Anterior
                            </button>

                            {pageNumbers.map(page => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="pagination-button"
                            >
                                Siguiente
                            </button>
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
