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
} from 'react-admin';
import { Chip, Box } from '@mui/material';

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

export const OrdenShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Información General">
        <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={2}>
          <TextField source="id" label="ID Orden" />
          <ReferenceField source="usuario" reference="usuarios" label="Cliente">
            <TextField source="username" />
          </ReferenceField>
          <TextField source="direccion_completa" label="Dirección de Envío" sx={{ gridColumn: '1 / -1' }} />
          <NumberField source="total" label="Total" options={{ style: 'currency', currency: 'PEN', locale: 'es-PE' }} />
          <TextField source="cantidad_compra" label="Cantidad de Items" />
          <TextField source="metodo_pago" label="Método de Pago" />
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
          <FunctionField
            label="Estado de Orden"
            render={record => {
              const colores = {
                'pendiente': 'warning', 'enviado': 'primary', 'entregado': 'success', 'cancelado': 'error'
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
        <ArrayField source="items" label="Items de la Orden">
          <Datagrid bulkActionButtons={false}>
            <TextField source="producto_nombre" label="Producto" />
            <TextField source="talla" label="Talla" />
            <TextField source="color" label="Color" />
            <NumberField source="cantidad" label="Cantidad" />
            <NumberField
              source="precio_unitario"
              label="Precio Unitario"
              options={{ style: 'currency', currency: 'PEN', locale: 'es-PE' }}
            />
            <NumberField
              source="subtotal"
              label="Subtotal"
              options={{ style: 'currency', currency: 'PEN', locale: 'es-PE' }}
            />
          </Datagrid>
        </ArrayField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);

export default OrdenShow;
