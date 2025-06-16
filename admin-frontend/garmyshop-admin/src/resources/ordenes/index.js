

// Importa los componentes que has creado en archivos separados
import { OrdenList } from './OrdenList';
import { OrdenEdit } from './OrdenEdit';
import { OrdenShow } from './OrdenShow'; // Asegúrate de exportar e importar OrdenShow


// Define el objeto de recurso que React Admin espera
// Aquí mapeamos los nombres de las vistas (list, edit, show)
// a los componentes de React correspondientes
const resource = {
    list: OrdenList,  // Componente para la vista de lista
    edit: OrdenEdit,  // Componente para la vista de edición
    show: OrdenShow,  // Componente para la vista de mostrar detalle
    // create: OrdenCreate, // Si tuvieras un componente para crear órdenes, lo añadirías aquí
};

// Exporta este objeto como la exportación por defecto del archivo
export default resource;