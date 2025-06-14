import React from 'react';
import { Admin, Resource, Layout, Loading } from 'react-admin';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { esES } from '@mui/material/locale';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import spanishMessages from 'ra-language-spanish';
//import simpleRestProvider from 'ra-data-simple-rest';
import dataProvider from "./providers/dataProvider";

// Importar recursos
import { CategoriaList, CategoriaEdit, CategoriaCreate } from './resources/categorias';
import { MarcaList, MarcaEdit, MarcaCreate } from './resources/marcas';
import { ProductoList, ProductoEdit, ProductoCreate, ProductoShow } from './resources/productos';
import { OrdenList, OrdenEdit, OrdenShow } from './resources/ordenes';
import Dashboard from './resources/dashboard/index.js';

// Configurar el dataProvider con debugging
/*
const dataProvider = simpleRestProvider('http://localhost:8000/api', {
  // Agregar headers si es necesario
  headers: {
    'Content-Type': 'application/json',
  },
});
*/
// Wrapper del dataProvider para debugging
const debugDataProvider = {
  ...dataProvider,
  getList: (resource, params) => {
    console.log('🔍 getList called:', resource, params);
    return dataProvider.getList(resource, params)
      .then(result => {
        console.log('✅ getList result:', result);
        return result;
      })
      .catch(error => {
        console.error('❌ getList error:', error);
        throw error;
      });
  },
  // Puedes agregar más métodos si necesitas debugging adicional
};

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
}, esES);

// Provider de idioma
const i18nProvider = polyglotI18nProvider(() => spanishMessages, 'es', {
  allowMissing: true,
});

// Componente de loading personalizado
const MyLoading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    flexDirection: 'column'
  }}>
    <Loading />
    <p style={{ marginTop: '20px' }}>Cargando GarmyShop Admin...</p>
  </div>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Admin
        dataProvider={debugDataProvider}
        i18nProvider={i18nProvider}
        dashboard={Dashboard}
        loading={MyLoading}
        title="GarmyShop Admin"
      >
        <Resource
          name="categorias"
          list={CategoriaList}
          edit={CategoriaEdit}
          create={CategoriaCreate}
          options={{ label: 'Categorías' }}
        />
        <Resource
          name="marcas"
          list={MarcaList}
          edit={MarcaEdit}
          create={MarcaCreate}
          options={{ label: 'Marcas' }}
        />
        <Resource
          name="productos"
          list={ProductoList}
          edit={ProductoEdit}
          create={ProductoCreate}
          show={ProductoShow}
          options={{ label: 'Productos' }}
        />
        <Resource
          name="ordenes"
          list={OrdenList}
          edit={OrdenEdit}
          show={OrdenShow}
          options={{ label: 'Órdenes' }}
        />
      </Admin>
    </ThemeProvider>
  );
}

export default App;