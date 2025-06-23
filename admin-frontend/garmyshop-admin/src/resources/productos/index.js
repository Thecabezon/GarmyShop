// RUTA: frontend/src/resources/productos/index.js (CÓDIGO COMPLETO)

import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  EditButton,
  DeleteButton,
  Create,
  Edit,
  Show,
  TabbedForm,
  FormTab,
  TextInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  BooleanInput,
  ImageInput,
  ImageField,
  ArrayInput, // Lo mantenemos por si lo usas en otro lado
  SimpleFormIterator, // Lo mantenemos por si lo usas en otro lado
  required,
  ReferenceField,
  FunctionField,
  BooleanField,
  TabbedShowLayout,
  Tab,
  ArrayField,
  SingleFieldList,
} from 'react-admin';
import { Box, Chip } from '@mui/material';

import SlugInput from '../../providers/SlugInput';

// 🟩 LISTA DE PRODUCTOS (Sin cambios)
export const ProductoList = (props) => (
  <List {...props} perPage={25} sort={{ field: 'nombre', order: 'ASC' }}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="nombre" label="Nombre" />
      <TextField source="sku" label="SKU" />
      <ImageField source="imagen_principal_url" label="Imagen Ppal." sx={{ '& img': { maxWidth: 50, maxHeight: 50 } }} />
      <ReferenceField source="marca" reference="marcas" label="Marca">
        <TextField source="nombre" />
      </ReferenceField>
      <ReferenceField source="categoria" reference="categorias" label="Categoría">
        <TextField source="nombre" />
      </ReferenceField>
      <NumberField source="precio" label="Precio" options={{ style: 'currency', currency: 'PEN' }} />
      <NumberField source="precio_oferta" label="P. Oferta" options={{ style: 'currency', currency: 'PEN' }} />
      <FunctionField
        label="Activo"
        render={record => (<Chip label={record.activo ? 'Activo' : 'Inactivo'} color={record.activo ? 'success' : 'default'} size="small" />)}
      />
      <FunctionField
        label="Destacado"
        render={record => (<Chip label={record.es_destacado ? 'Sí' : 'No'} color={record.es_destacado ? 'primary' : 'default'} size="small" variant={record.es_destacado ? 'filled' : 'outlined'} />)}
      />
      <DateField source="creado" label="Creado" showTime locales="es-PE" />
      <DateField source="actualizado" label="Actualizado" showTime locales="es-PE" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

// 🟨 FORMULARIO DE CREAR / EDITAR PRODUCTO (SIMPLIFICADO)
const ProductoForm = () => (
  <TabbedForm>
    <FormTab label="Información General">
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" gap={2}>
          <TextInput source="nombre" label="Nombre del Producto" validate={required()} fullWidth />
          <TextInput source="sku" label="SKU" validate={required()} fullWidth />
        </Box>
        <Box display="flex" gap={2}>
          <ReferenceInput source="marca" reference="marcas" label="Marca">
            <SelectInput optionText="nombre" validate={required()} fullWidth />
          </ReferenceInput>
          <ReferenceInput source="categoria" reference="categorias" label="Categoría">
            <SelectInput optionText="nombre" validate={required()} fullWidth />
          </ReferenceInput>
        </Box>
        <TextInput source="descripcion" label="Descripción" multiline rows={4} fullWidth />
        <SlugInput source="slug" label="Slug" validate={required()} fullWidth />
        <Box display="flex" gap={2}>
          <BooleanInput source="activo" label="Producto Activo" />
          <BooleanInput source="es_destacado" label="Producto Destacado" />
        </Box>
      </Box>
    </FormTab>

    <FormTab label="Precios">
      <Box display="flex" gap={2}>
        <NumberInput source="precio" label="Precio Regular" validate={required()} min={0} step={0.01} fullWidth />
        <NumberInput source="precio_oferta" label="Precio de Oferta" min={0} step={0.01} fullWidth />
      </Box>
    </FormTab>

    <FormTab label="Imágenes">
      <ImageInput source="imagen_principal" label="Imagen Principal" accept="image/*" placeholder={<p>Arrastra la imagen principal aquí</p>}>
        <ImageField source="src" title="Imagen Principal" />
      </ImageInput>
      <ImageInput source="imagenes" label="Imágenes Adicionales" accept="image/*" multiple placeholder={<p>Arrastra imágenes adicionales aquí</p>}>
        <ImageField source="src" title="Imagen" />
      </ImageInput>
    </FormTab>

    {/* LA PESTAÑA DE VARIACIONES HA SIDO ELIMINADA */}
    
  </TabbedForm>
);

// 🟦 CREAR PRODUCTO (Sin cambios)
export const ProductoCreate = (props) => (
  <Create {...props}>
    <ProductoForm />
  </Create>
);

// 🟪 EDITAR PRODUCTO (Sin cambios)
export const ProductoEdit = (props) => (
  <Edit {...props}>
    <ProductoForm />
  </Edit>
);

// 🟫 MOSTRAR PRODUCTO (Simplificado)
// He quitado la pestaña de variaciones de aquí también para ser consistentes.
export const ProductoShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Información General">
        <TextField source="id" />
        <TextField source="nombre" />
        <TextField source="sku" />
        <TextField source="slug" />
        <ReferenceField source="marca" reference="marcas" link="show"><TextField source="nombre" /></ReferenceField>
        <ReferenceField source="categoria" reference="categorias" link="show"><TextField source="nombre" /></ReferenceField>
        <TextField source="descripcion" />
        <BooleanField source="activo" />
        <BooleanField source="es_destacado" />
        <DateField source="creado" label="Creado" showTime locales="es-PE" />
        <DateField source="actualizado" label="Actualizado" showTime locales="es-PE" />
      </Tab>
      <Tab label="Precios">
        <NumberField source="precio" label="Precio Regular" options={{ style: 'currency', currency: 'PEN' }} />
        <NumberField source="precio_oferta" label="Precio de Oferta" options={{ style: 'currency', currency: 'PEN' }} />
      </Tab>
      <Tab label="Imágenes">
        <ImageField source="imagen_principal_url" label="Imagen Principal" sx={{ '& img': { maxWidth: 100, maxHeight: 100 } }} />
        <ArrayField source="imagenes" label="Imágenes Adicionales">
          <SingleFieldList>
            <ImageField source="imagen_url" sx={{ '& img': { maxWidth: 80, maxHeight: 80 } }} />
          </SingleFieldList>
        </ArrayField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);