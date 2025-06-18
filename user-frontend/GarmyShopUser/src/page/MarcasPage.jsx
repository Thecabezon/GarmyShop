// src/page/MarcasPage.jsx
import React, { useState, useEffect } from 'react'; // Importa useEffect
// ELIMINA esta línea (ya no usaremos datos estáticos):
// import { marcasDestacadas } from '../data/datosProducto';
import MarcasSection from '../components/MarcasSection';
import '../styles/MarcasPage.css';

const MarcasPage = () => {
  const [busqueda, setBusqueda] = useState(''); // Mantenemos el estado de búsqueda local
  const [marcas, setMarcas] = useState([]); // Estado para almacenar las marcas cargadas del backend
  const [loading, setLoading] = useState(true); // Estado para indicar si está cargando datos
  const [error, setError] = useState(null); // Estado para manejar errores de la petición

  // **¡IMPORTANTE!** Define la URL de tu endpoint de backend para marcas activas.
  // Basado en tu controlador de categorías, asumimos '/api/marcas' para todas las activas.
  // Asegúrate de que la URL y el puerto coincidan con tu backend.
  // Es altamente recomendable usar variables de entorno (.env) para esto.
  const API_URL = 'http://localhost:8085/api/marcas'; // <--- **VERIFICA Y AJUSTA ESTA URL**

  // useEffect para fetchear las marcas cuando el componente se monta
  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        setLoading(true); // Inicia el estado de carga
        const response = await fetch(API_URL);

        // Manejar respuesta 204 No Content si el backend no tiene marcas activas
        if (response.status === 204) {
          setMarcas([]); // Si no hay contenido, la lista de marcas está vacía
          return; // Terminamos la función fetch
        }

        if (!response.ok) {
          // Si la respuesta no fue exitosa (y no fue 204)
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parseamos la respuesta JSON
        setMarcas(data); // Actualiza el estado con los datos recibidos

      } catch (err) {
        setError(err); // Captura cualquier error (conexión, parsing, etc.)
        console.error("Error fetching brands:", err);
      } finally {
        setLoading(false); // Finaliza el estado de carga en cualquier caso
      }
    };

    fetchMarcas(); // Ejecuta la función de fetching al montar

  }, []); // Array de dependencias vacío: se ejecuta solo una vez al montar

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
  };

  // Filtramos las marcas cargadas del backend (`marcas`) basándonos en la búsqueda.
  // NOTA: Según tu entidad `Marca` proporcionada, NO tiene campo `descripcion`.
  // Filtraremos solo por `nombre`. Si tu DTO *sí* tiene `descripcion`, ajusta aquí.
  const marcasFiltradas = marcas.filter(marca =>
    // Asegúrate que 'nombre' existe antes de llamar a toLowerCase()
    marca.nombre && marca.nombre.toLowerCase().includes(busqueda.toLowerCase())
    // Si tu DTO tuviera descripcion, sería:
    // (marca.nombre && marca.nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
    // (marca.descripcion && marca.descripcion.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="marcas-page">
      {/* Hero Section */}
      <section className="marcas-hero">
        <div className="hero-content">
          <h1 className="hero-title">NUESTRAS MARCAS</h1>
          <p className="hero-subtitle">
            Descubre las mejores marcas de moda internacional que hemos seleccionado especialmente para ti
          </p>
        </div>
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
      </section>

      {/* Solo Búsqueda */}
      <section className="marcas-filters">
        <div className="filters-container">
          <div className="search-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar marcas..."
                value={busqueda}
                onChange={handleBusquedaChange}
                className="search-input"
              />
              <div className="search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resultados - Renderizado Condicional basado en estados */}
      <section className="marcas-results">
         {/* Muestra mensaje de carga si está cargando */}
        {loading && <p>Cargando marcas...</p>}

        {/* Muestra mensaje de error si hay un error */}
        {error && <p className="error-message">Error al cargar las marcas: {error.message}</p>}

        {/* Muestra mensaje si no se encontraron marcas (después de cargar y sin error) */}
        {/* Casos: 1) No se cargó nada y búsqueda vacía, 2) Se cargó algo pero el filtro no encontró nada */}
        {!loading && !error && marcasFiltradas.length === 0 && (
            // Si la búsqueda está vacía Y la lista original está vacía -> No hay marcas disponibles en general
            busqueda === '' && marcas.length === 0 ? (
                <div className="no-results">
                   <p>No hay marcas disponibles en este momento.</p>
                </div>
            ) : ( // Si la búsqueda tiene contenido o la lista original no estaba vacía pero el filtro no encontró nada
                <div className="no-results">
                    <div className="no-results-icon">😔</div>
                    <h3>No se encontraron marcas con esa búsqueda</h3>
                    <p>Intenta con otros términos.</p>
                    {/* Muestra el botón de limpiar solo si hay algo en la búsqueda */}
                    {busqueda !== '' && (
                       <button
                         className="reset-btn"
                         onClick={() => setBusqueda('')}
                       >
                         Limpiar búsqueda
                       </button>
                    )}
                </div>
            )
        )}


        {/* Renderiza MarcasSection solo si no está cargando, no hay error, Y hay marcas filtradas */}
        {!loading && !error && marcasFiltradas.length > 0 && (
          <MarcasSection
            marcas={marcasFiltradas} // Pasamos las marcas F I L T R A D A S a MarcasSection
            // Eliminamos 'titulo' ya que el título principal está en la sección hero de esta página
            // titulo=""
          />
        )}
      </section>
    </div>
  );
};

export default MarcasPage;