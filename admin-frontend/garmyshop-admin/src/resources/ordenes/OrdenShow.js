// src/resources/ordenes/OrdenShow.js
import React from 'react';
import {
  Show,
  TextField,
  DateField,
  NumberField,
  ReferenceField,
  FunctionField,
  TabbedShowLayout,
  Tab,
  ArrayField,
  Datagrid,
  // ✅ Eliminar Box de aquí
  // Box, // <--- ELIMINA O COMENTA ESTA LÍNEA
} from 'react-admin';
// Importaciones de MUI (donde sí están Box, Typography, Divider, Chip)
import { Typography, Divider, Chip, Box } from '@mui/material'; // <-- ASEGÚRATE DE QUE LA IMPORTACIÓN DE MUI ESTÁ CORRECTA

// ... (El resto de tu código de OrdenShow.js) ...

// Estados de pago (copiados)
const estadosPago = [
  { id: 'pendiente', name: 'Pendiente' },
  { id: 'completado', name: 'Completado' },
  { id: 'fallido', name: 'Fallido' },
  { id: 'cancelado', name: 'Cancelado' },
];

// Estados de orden (copiados)
const estadosOrden = [
  { id: 'pendiente', name: 'Pendiente' },
  { id: 'procesando', name: 'Procesando' },
  { id: 'enviado', name: 'Enviado' },
  { id: 'entregado', name: 'Entregado' },
  { id: 'cancelado', name: 'Cancelado' },
];


// 🟫 Mostrar orden
export const OrdenShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Información General">
        {/* Usar Box para organizar campos si es necesario */}
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={2}>

            <TextField source="id" label="ID Orden" />

             {/* Usar ReferenceField si el campo en el modelo es la FK al usuario */}
             {/* Asegúrate que tienes <Resource name="usuarios" .../> en App.jsx */}
            <ReferenceField source="usuario" reference="usuarios" label="Cliente">
                 <TextField source="username" /> {/* Mostrar el username del usuario relacionado */}
            </ReferenceField>
            {/* O usa TextField si tu serializer ya pone el username en un campo plano como usuario_nombre */}
            {/* <TextField source="usuario_nombre" label="Cliente" /> */}


             {/* Usar ReferenceField si el campo en el modelo es la FK a la dirección */}
             {/* <ReferenceField source="direccion_envio" reference="direcciones" label="Dirección de Envío">
                  <TextField source="id" /> // Mostrar el ID o algún otro campo simple de la dirección
             </ReferenceField> */}
             {/* Si tu serializer incluye la dirección completa en un campo plano */}
            <TextField source="direccion_completa" label="Dirección de Envío" sx={{ gridColumn: '1 / -1' }} /> {/* Ocupa todo el ancho */}


            <NumberField source="total" label="Total" options={{ style: 'currency', currency: 'PEN', locale: 'es-PE' }} />
            <TextField source="cantidad_compra" label="Cantidad de Items" />
            <TextField source="metodo_pago" label="Método de Pago" />


            {/* Estado de pago (usando mapeo más completo para colores) */}
            <FunctionField
              label="Estado de Pago"
               render={record => {
                const colores = {
                  'pendiente': 'warning', 'completado': 'success', 'fallido': 'error', 'cancelado': 'default'
                };
                 const estadoLabel = estadosPago.find(e => e.id === record.estado_pago)?.name || record.estado_pago;
                return (
                  <Chip
                    label={estadoLabel}
                    color={colores[record.estado_pago] || 'default'}
                    size="small"
                  />
                );
              }}
            />

            {/* Estado de orden (usando mapeo más completo para colores) */}
            <FunctionField
              label="Estado de Orden"
              render={record => {
                const colores = {
                  'pendiente': 'warning', 'procesando': 'info', 'enviado': 'primary', 'entregado': 'success', 'cancelado': 'error'
                };
                const estadoLabel = estadosOrden.find(e => e.id === record.estado)?.name || record.estado;
                return (
                  <Chip
                    label={estadoLabel}
                    color={colores[record.estado] || 'default'}
                    size="small"
                  />
                );
              }}
            />

            <DateField source="fecha_creacion" label="Fecha de Creación" showTime locales="es-PE" />
            <DateField source="fecha_actualizacion" label="Última Actualización" showTime locales="es-PE" />

        </Box>

      </Tab>

      <Tab label="Items de la Orden">
        {/* ✅ USANDO ArrayField porque los items ya están incrustados en la respuesta JSON de la orden */}
        {/* Asegúrate que tu OrdenSerializer en Django incluye 'items = OrdenItemSerializer(many=True, read_only=True)' */}
        <ArrayField source="items" label="Items de la Orden">
          {/* Datagrid para mostrar cada item en una fila */}
          <Datagrid bulkActionButtons={false}> {/* Deshabilita botones de acción masiva para items */}
            {/* Campos del OrdenItemSerializer */}
            {/* Estos deben coincidir con los nombres de campo en tu OrdenItemSerializer */}
            <TextField source="producto_nombre" label="Producto" />
            <TextField source="talla" label="Talla" />
            <TextField source="color" label="Color" />
            <NumberField source="cantidad" label="Cantidad" />
            <NumberField
              source="precio_unitario"
              label="Precio Unitario"
              options={{ style: 'currency', currency: 'PEN', locale: 'es-PE' }} // Añadido locale
            />
            <NumberField
              source="subtotal"
              label="Subtotal"
              options={{ style: 'currency', currency: 'PEN', locale: 'es-PE' }} // Añadido locale
            />
            {/* Puedes añadir otros campos si tu OrdenItemSerializer los incluye */}
            {/* <TextField source="id" label="ID Item" /> */}
            {/* <ReferenceField source="combinacion" reference="combinaciones-producto" label="Combinación ID">
                 <TextField source="id" />
            </ReferenceField> */}
          </Datagrid>
        </ArrayField>

      </Tab>
    </TabbedShowLayout>
  </Show>
);

// **Normalmente NO crearías órdenes desde el admin. Se crean en el flujo de compra del usuario.**
// Si necesitas esta funcionalidad, requeriría un serializador de Orden que acepte escrituras anidadas para los items
// y un formulario complejo en el frontend.
// export const OrdenCreate = (props) => (
//     <Create {...props}>
//         <SimpleForm>
//             {/* ... campos de la orden ... */}
//             {/* ... un ArrayInput o lógica personalizada para añadir items ... */}
//         </SimpleForm>
//     </Create>
// );