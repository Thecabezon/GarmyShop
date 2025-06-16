// src/resources/ordenes/OrdenList.js
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  EditButton,
  FunctionField,
  ReferenceField, // Necesario para ReferenceField a 'usuarios'
} from 'react-admin';
import { Chip } from '@mui/material';

// Estados de pago (copiados para consistencia local, podrías centralizarlos si quieres)
const estadosPago = [
  { id: 'pendiente', name: 'Pendiente' },
  { id: 'completado', name: 'Completado' },
  { id: 'fallido', name: 'Fallido' },
  { id: 'cancelado', name: 'Cancelado' },
];

// Estados de orden (copiados para consistencia local)
const estadosOrden = [
  { id: 'pendiente', name: 'Pendiente' },
  { id: 'procesando', name: 'Procesando' },
  { id: 'enviado', name: 'Enviado' },
  { id: 'entregado', name: 'Entregado' },
  { id: 'cancelado', name: 'Cancelado' },
];


export const OrdenList = (props) => (
  <List {...props} perPage={25} sort={{ field: 'fecha_creacion', order: 'DESC' }}>
    <Datagrid rowClick="show"> {/* Mantener rowClick="show" */}
      <TextField source="id" />
      {/* Usar ReferenceField si el campo en el modelo es la FK al usuario */}
      {/* Asegúrate que tienes <Resource name="usuarios" .../> en App.jsx */}
      <ReferenceField source="usuario" reference="usuarios" label="Cliente">
        <TextField source="username" /> {/* Mostrar el username del usuario relacionado */}
      </ReferenceField>
      {/* O usa TextField si tu serializer ya pone el username en un campo plano como usuario_nombre */}
      {/* <TextField source="usuario_nombre" label="Cliente" /> */}

      {/* Mostrar el total como moneda. Ajusta el locale y currency según necesites */}
      <NumberField source="total" label="Total" options={{ style: 'currency', currency: 'PEN', locale: 'es-PE' }} />

       {/* Mostrar la cantidad de items (si el serializer lo incluye) */}
       <TextField source="cantidad_compra" label="Cantidad Items" />


      {/* Estado de pago (usando mapeo más completo para colores) */}
      <FunctionField
        label="Estado Pago"
        render={record => {
          const colores = {
            'pendiente': 'warning',
            'completado': 'success',
            'fallido': 'error',
            'cancelado': 'default'
             // Asegúrate que estos coinciden con los 'id' de estadosPago
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
        label="Estado Orden"
        render={record => {
          const colores = {
            'pendiente': 'warning',
            'procesando': 'info',
            'enviado': 'primary',
            'entregado': 'success',
            'cancelado': 'error'
            // Asegúrate que estos coinciden con los 'id' de estadosOrden
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

      <TextField source="metodo_pago" label="Método Pago" /> {/* Si es el ID, considera usar un SelectField con choices */}

      <DateField source="fecha_creacion" label="Fecha Creación" showTime locales="es-PE" />
      {/* <DateField source="fecha_actualizacion" label="Fecha Actualización" showTime locales="es-PE" /> {/* Opcional */}

      <EditButton />
      {/* No se suele permitir borrar órdenes */}
      {/* <DeleteButton /> */}
    </Datagrid>
  </List>
);