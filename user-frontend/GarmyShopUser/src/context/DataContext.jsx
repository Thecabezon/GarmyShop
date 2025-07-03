
import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [productsRes, categoriesRes, marcasRes, colorsRes, sizesRes] = await Promise.all([
                    fetch('http://localhost:8085/api/productos?size=200'),
                    fetch('http://localhost:8085/api/categorias'),
                    fetch('http://localhost:8085/api/marcas'),
                    fetch('http://localhost:8085/api/colores'),
                    fetch('http://localhost:8085/api/tallas'),
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

    const value = {
        products,
        categories,
        marcas,
        colors,
        sizes,
        loading,
        error
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