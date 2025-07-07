import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  EditButton,
  FunctionField,
  ReferenceField,
} from 'react-admin';
import { Chip } from '@mui/material';

const estadosPago = [
  { id: 'pendiente', name: 'Pendiente' },
  { id: 'completado', name: 'Completado' },
  { id: 'fallido', name: 'Fallido' },
  { id: 'cancelado', name: 'Cancelado' },
];

const estadosOrden = [
  { id: 'pendiente', name: 'Pendiente' },
  { id: 'enviado', name: 'Enviado' },
  { id: 'entregado', name: 'Entregado' },
  { id: 'cancelado', name: 'Cancelado' },
];

export const OrdenList = (props) => (
  <List {...props} perPage={25} sort={{ field: 'fecha_creacion', order: 'DESC' }}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <ReferenceField source="usuario" reference="usuarios" label="Cliente">
        <TextField source="username" />
      </ReferenceField>
      <NumberField source="total" label="Total" options={{ style: 'currency', currency: 'PEN', locale: 'es-PE' }} />
      <TextField source="cantidad_compra" label="Cantidad Items" />
      <FunctionField
        label="Estado Pago"
        render={record => {
          const colores = {
            'pendiente': 'warning',
            'completado': 'success',
            'fallido': 'error',
            'cancelado': 'default'
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
      <FunctionField
        label="Estado Orden"
        render={record => {
          const colores = {
            'pendiente': 'warning',
            'enviado': 'primary',
            'entregado': 'success',
            'cancelado': 'error'
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
      <TextField source="metodo_pago" label="Método Pago" />
      <DateField source="fecha_creacion" label="Fecha Creación" showTime locales="es-PE" />
      <EditButton />
    </Datagrid>
  </List>
);

export default OrdenList;
