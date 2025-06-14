import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  Edit,
  Show,
  SimpleForm,
  TextInput,
  SelectInput,
  ReferenceField,
  NumberField,
  FunctionField,
  SimpleShowLayout,
  ArrayField,
  SingleFieldList,
  ChipField,
  ReferenceManyField,
  TabbedShowLayout,
  Tab,
} from 'react-admin';
import { Box, Chip } from '@mui/material';

// Estados de pago disponibles
const estadosPago = [
  { id: 'pendiente', name: 'Pendiente' },
  { id: 'completado', name: 'Completado' },
  { id: 'fallido', name: 'Fallido' },
  { id: 'cancelado', name: 'Cancelado' },
];

// Estados de orden disponibles
const estadosOrden = [
  { id: 'pendiente', name: 'Pendiente' },
  { id: 'procesando', name: 'Procesando' },
  { id: 'enviado', name: 'Enviado' },
  { id: 'entregado', name: 'Entregado' },
  { id: 'cancelado', name: 'Cancelado' },
];

// Métodos de pago disponibles
const metodosPago = [
  { id: 'tarjeta', name: 'Tarjeta de Crédito/Débito' },
  { id: 'yape', name: 'Yape' },
  { id: 'plin', name: 'PLIN' },
  { id: 'transferencia', name: 'Transferencia Bancaria' },
  { id: 'contra_entrega', name: 'Contra Entrega' },
];

// 🟩 Lista de órdenes
export const OrdenList = (props) => (
  <List {...props} perPage={25} sort={{ field: 'fecha_creacion', order: 'DESC' }}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <ReferenceField source="usuario" reference="usuarios" label="Cliente">
        <TextField source="username" />
      </ReferenceField>
      <NumberField source="total" label="Total" options={{ style: 'currency', currency: 'PEN' }} />
      <TextField source="cantidad_compra" label="Cantidad Items" />
      
      {/* Estado de pago */}
      <FunctionField
        label="Estado Pago"
        render={record => {
          const colores = {
            'pendiente': 'warning',
            'completado': 'success',
            'fallido': 'error',
            'cancelado': 'default'
          };
          return (
            <Chip
              label={record.estado_pago}
              color={colores[record.estado_pago] || 'default'}
              size="small"
            />
          );
        }}
      />
      
      {/* Estado de orden */}
      <FunctionField
        label="Estado Orden"
        render={record => {
          const colores = {
            'pendiente': 'warning',
            'procesando': 'info',
            'enviado': 'primary',
            'entregado': 'success',
            'cancelado': 'error'
          };
          return (
            <Chip
              label={record.estado}
              color={colores[record.estado] || 'default'}
              size="small"
            />
          );
        }}
      />
      
      <TextField source="metodo_pago" label="Método Pago" />
      <DateField source="fecha_creacion" label="Fecha" showTime />
      <EditButton />
    </Datagrid>
  </List>
);

// 🟨 Formulario de edición de orden
const OrdenForm = () => (
  <SimpleForm>
    <Box display="flex" flexDirection="column" gap={2} width="100%">
      <Box display="flex" gap={2} width="100%">
        <SelectInput
          source="estado_pago"
          label="Estado de Pago"
          choices={estadosPago}
          fullWidth
        />
        <SelectInput
          source="estado"
          label="Estado de Orden"
          choices={estadosOrden}
          fullWidth
        />
      </Box>
      
      <SelectInput
        source="metodo_pago"
        label="Método de Pago"
        choices={metodosPago}
        fullWidth
      />
    </Box>
  </SimpleForm>
);

// 🟪 Editar orden
export const OrdenEdit = (props) => (
  <Edit {...props}>
    <OrdenForm />
  </Edit>
);

// 🟫 Mostrar orden
export const OrdenShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Información General">
        <TextField source="id" />
        <ReferenceField source="usuario" reference="usuarios" label="Cliente">
          <TextField source="username" />
        </ReferenceField>
        <TextField source="direccion_completa" label="Dirección de Envío" />
        <NumberField source="total" label="Total" options={{ style: 'currency', currency: 'PEN' }} />
        <TextField source="cantidad_compra" label="Cantidad de Items" />
        <TextField source="metodo_pago" label="Método de Pago" />
        
        {/* Estado de pago */}
        <FunctionField
          label="Estado de Pago"
          render={record => (
            <Chip
              label={record.estado_pago}
              color={record.estado_pago === 'completado' ? 'success' : 'warning'}
              size="small"
            />
          )}
        />
        
        {/* Estado de orden */}
        <FunctionField
          label="Estado de Orden"
          render={record => (
            <Chip
              label={record.estado}
              color={record.estado === 'entregado' ? 'success' : 'primary'}
              size="small"
            />
          )}
        />
        
        <DateField source="fecha_creacion" label="Fecha de Creación" showTime />
        <DateField source="fecha_actualizacion" label="Última Actualización" showTime />
      </Tab>
      
      <Tab label="Items de la Orden">
        <ReferenceManyField
          reference="orden-items"
          source="id"
          target="orden"
          label="Productos"
        >
          <Datagrid>
            <TextField source="producto_nombre" label="Producto" />
            <TextField source="talla" label="Talla" />
            <TextField source="color" label="Color" />
            <NumberField source="cantidad" label="Cantidad" />
            <NumberField 
              source="precio_unitario" 
              label="Precio Unitario" 
              options={{ style: 'currency', currency: 'PEN' }} 
            />
            <NumberField 
              source="subtotal" 
              label="Subtotal" 
              options={{ style: 'currency', currency: 'PEN' }} 
            />
          </Datagrid>
        </ReferenceManyField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);

