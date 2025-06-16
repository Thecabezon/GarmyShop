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
  ArrayInput,
  SimpleFormIterator,
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

import SlugInput from '../../providers/SlugInput'; // Ajusta la ruta si es necesario

// 🟩 LISTA DE PRODUCTOS
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
        render={record => (
          <Chip label={record.activo ? 'Activo' : 'Inactivo'} color={record.activo ? 'success' : 'default'} size="small" />
        )}
      />
      <FunctionField
        label="Destacado"
        render={record => (
          <Chip label={record.es_destacado ? 'Sí' : 'No'} color={record.es_destacado ? 'primary' : 'default'} size="small" variant={record.es_destacado ? 'filled' : 'outlined'} />
        )}
      />

      <DateField source="creado" label="Creado" showTime locales="es-PE" />
      <DateField source="actualizado" label="Actualizado" showTime locales="es-PE" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

// 🟨 FORMULARIO DE CREAR / EDITAR PRODUCTO
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

    <FormTab label="Variaciones">
      <ArrayInput source="combinaciones" label="Variaciones">
        <SimpleFormIterator>
          <ReferenceInput source="talla" reference="tallas" label="Talla">
            <SelectInput optionText="nombre" validate={required()} />
          </ReferenceInput>
          <ReferenceInput source="color" reference="colores" label="Color">
            <SelectInput optionText="nombre" validate={required()} />
          </ReferenceInput>
          <NumberInput source="stock" label="Stock" validate={required()} min={0} />
          <TextInput source="sku" label="SKU Variación" validate={required()} />
        </SimpleFormIterator>
      </ArrayInput>
    </FormTab>
  </TabbedForm>
);

// 🟦 CREAR PRODUCTO
export const ProductoCreate = (props) => (
  <Create {...props}>
    <ProductoForm />
  </Create>
);

// 🟪 EDITAR PRODUCTO
export const ProductoEdit = (props) => (
  <Edit {...props}>
    <ProductoForm />
  </Edit>
);

// 🟫 MOSTRAR PRODUCTO
export const ProductoShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Información General">
        <TextField source="id" />
        <TextField source="nombre" />
        <TextField source="sku" />
        <TextField source="slug" />
        <ReferenceField source="marca" reference="marcas" link="show">
          <TextField source="nombre" />
        </ReferenceField>
        <ReferenceField source="categoria" reference="categorias" link="show">
          <TextField source="nombre" />
        </ReferenceField>
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

      <Tab label="Variaciones">
        <ArrayField source="combinaciones" label="Detalle de Variaciones">
          <Datagrid isRowSelectable={() => false}>
            <TextField source="talla_nombre" label="Talla" />
            <TextField source="color_nombre" label="Color" />
            <NumberField source="stock" label="Stock" />
            <TextField source="sku" label="SKU Variación" />
          </Datagrid>
        </ArrayField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
