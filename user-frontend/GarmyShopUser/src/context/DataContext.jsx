// src/context/DataContext.jsx (MEJORADO)

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8085/api';

const DataContext = createContext();

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
            try {
                const [productsRes, categoriesRes, marcasRes, colorsRes, sizesRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/productos?size=200`),
                    fetch(`${API_BASE_URL}/categorias`),
                    fetch(`${API_BASE_URL}/marcas`),
                    fetch(`${API_BASE_URL}/colores`),
                    fetch(`${API_BASE_URL}/tallas`),
                ]);

                if (!productsRes.ok || !categoriesRes.ok || !marcasRes.ok || !colorsRes.ok || !sizesRes.ok) {
                    throw new Error('Error al cargar los datos iniciales de la aplicación.');
                }

                const productsData = await productsRes.json();
                const categoriesData = await categoriesRes.json();
                const marcasData = await marcasRes.json();
                const colorsData = await colorsRes.json();
                const sizesData = await sizesRes.json();

                setProducts(productsData.content || []);
                setCategories(categoriesData || []);
                setMarcas(marcasData || []);
                setColors(colorsData || []);
                setSizes(sizesData || []);

                console.log("✅ Datos iniciales cargados y cacheados en el cliente.");
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
            const marcaResponse = await fetch(`${API_BASE_URL}/marcas/slug/${slug}`);
            if (!marcaResponse.ok) throw new Error(`Marca no encontrada: ${slug}`);
            const marcaData = await marcaResponse.json();

            const productosResponse = await fetch(`${API_BASE_URL}/productos/marca/${marcaData.id}?size=20`);
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
        // Exponemos la nueva función en el contexto
        getProductsByMarcaSlug, 
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData debe ser usado dentro de un DataProvider');
    }
    return context;
}