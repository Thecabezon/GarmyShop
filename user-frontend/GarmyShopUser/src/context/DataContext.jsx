// src/context/DataContext.js

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config/apiConfig';

const DataContext = createContext();

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData debe ser usado dentro de un DataProvider');
    }
    return context;
}

export function DataProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productosPorMarca, setProductosPorMarca] = useState({});

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [productsRes, categoriesRes, marcasRes, colorsRes, sizesRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/productos?size=200`),
                    fetch(`${API_BASE_URL}/api/categorias`),
                    fetch(`${API_BASE_URL}/api/marcas`),
                    fetch(`${API_BASE_URL}/api/colores`),
                    fetch(`${API_BASE_URL}/api/tallas`),
                ]);

                if (!productsRes.ok || !categoriesRes.ok || !marcasRes.ok || !colorsRes.ok || !sizesRes.ok) {
                    throw new Error('Error al cargar los datos iniciales de la aplicación.');
                }

                const productsData = await productsRes.json();
                const categoriesData = await categoriesRes.json();
                const marcasData = await marcasRes.json();
                const colorsData = await colorsRes.json();
                const sizesData = await sizesRes.json();

                const initialProducts = productsData.content || [];
                
                setCategories(categoriesData || []);
                setMarcas(marcasData || []);
                setColors(colorsData || []);
                setSizes(sizesData || []);

                if (initialProducts.length === 0) {
                    setProducts([]);
                    setLoading(false);
                    return;
                }
                
                console.log(`⏳ Enriqueciendo ${initialProducts.length} productos con sus detalles...`);
                
                const detailPromises = initialProducts.map(product =>
                    fetch(`${API_BASE_URL}/api/productos/${product.id}`)
                        .then(res => {
                            if (res.ok) return res.json();
                            console.warn(`Falló la carga de detalles para el producto ID ${product.id}.`);
                            return product;
                        })
                        .catch(err => {
                            console.error(`Error de red para el producto ID ${product.id}`, err);
                            return product;
                        })
                );

                const enrichedProducts = await Promise.all(detailPromises);

                setProducts(enrichedProducts);

                console.log("✅ Datos iniciales y enriquecimiento completados.");

            } catch (err) {
                setError(err.message);
                console.error("❌ Error en DataProvider:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const getProductsByMarcaSlug = useCallback(async (slug) => {
        if (productosPorMarca[slug]) {
            console.log(`⚡️ Devolviendo productos cacheados para la marca: ${slug}`);
            return { productos: productosPorMarca[slug], marca: marcas.find(m => m.slug === slug) };
        }

        console.log(`⏳ Buscando productos en el backend para la marca: ${slug}`);
        
        try {
            const marcaResponse = await fetch(`${API_BASE_URL}/api/marcas/slug/${slug}`);
            if (!marcaResponse.ok) throw new Error(`Marca no encontrada: ${slug}`);
            const marcaData = await marcaResponse.json();

            const productosResponse = await fetch(`${API_BASE_URL}/api/productos/marca/${marcaData.id}?size=20`);
            if (!productosResponse.ok) throw new Error('Error al cargar productos de la marca.');
            const productosData = await productosResponse.json();
            const fetchedProductos = productosData.content || [];

            setProductosPorMarca(prevState => ({
                ...prevState,
                [slug]: fetchedProductos,
            }));
            
            console.log(`✅ Productos para la marca "${slug}" cacheados.`);
            return { productos: fetchedProductos, marca: marcaData };

        } catch (err) {
            console.error(`Error en getProductsByMarcaSlug para "${slug}":`, err);
            throw err; 
        }
    }, [productosPorMarca, marcas]);

    const value = {
        products,
        categories,
        marcas,
        colors,
        sizes,
        loading,
        error,
        getProductsByMarcaSlug,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}