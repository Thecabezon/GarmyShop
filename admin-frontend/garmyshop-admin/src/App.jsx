// RUTA: frontend/src/App.jsx (CÓDIGO COMPLETO)

import React from 'react';
import { Admin, Resource, Loading } from 'react-admin';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { esES } from '@mui/material/locale';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import spanishMessages from 'ra-language-spanish';

import dataProvider from "./providers/dataProvider";
import authProvider from "./providers/authProvider";

// Importar recursos
import { CategoriaList, CategoriaEdit, CategoriaCreate } from './resources/categorias';
import { MarcaList, MarcaEdit, MarcaCreate } from './resources/marcas';
import { TallaList, TallaCreate, TallaEdit } from './resources/tallas';
import { ColorList, ColorCreate, ColorEdit } from './resources/colores';
import { ProductoList, ProductoEdit, ProductoCreate, ProductoShow } from './resources/productos';
import { CombinacionProductoList, CombinacionProductoCreate, CombinacionProductoEdit } from './resources/combinaciones-producto'; // <-- NUEVA IMPORTACIÓN
import { OrdenList, OrdenEdit, OrdenShow } from './resources/ordenes';
import Dashboard from './resources/dashboard/index.js';

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
}, esES);

// Provider de idioma
const i18nProvider = polyglotI18nProvider(() => spanishMessages, 'es', {
  allowMissing: true,
});

// Componente de loading personalizado
const MyLoading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
    <Loading />
    <p style={{ marginTop: '20px' }}>Cargando GarmyShop Admin...</p>
  </div>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Admin
        dataProvider={dataProvider}
        authProvider={authProvider}
        i18nProvider={i18nProvider}
        dashboard={Dashboard}
        loading={MyLoading}
        title="GarmyShop Admin"
      >
        <Resource name="categorias" list={CategoriaList} edit={CategoriaEdit} create={CategoriaCreate} options={{ label: 'Categorías' }} />
        <Resource name="marcas" list={MarcaList} edit={MarcaEdit} create={MarcaCreate} options={{ label: 'Marcas' }} />
        <Resource name="productos" list={ProductoList} edit={ProductoEdit} create={ProductoCreate} show={ProductoShow} options={{ label: 'Productos' }} />
        
        {/* 👇 NUEVO RECURSO AÑADIDO */}
        <Resource 
          name="combinaciones-producto" 
          list={CombinacionProductoList} 
          create={CombinacionProductoCreate} 
          edit={CombinacionProductoEdit} 
          options={{ label: 'Combinaciones' }}
        />

        <Resource name="ordenes" list={OrdenList} edit={OrdenEdit} show={OrdenShow} options={{ label: 'Órdenes' }} />
        <Resource name="tallas" list={TallaList} create={TallaCreate} edit={TallaEdit} />
        <Resource name="colores" list={ColorList} create={ColorCreate} edit={ColorEdit} />
        <Resource name="usuarios" options={{ label: 'Usuarios (Conteo)' }} />

      </Admin>
    </ThemeProvider>
  );
}

export default App;