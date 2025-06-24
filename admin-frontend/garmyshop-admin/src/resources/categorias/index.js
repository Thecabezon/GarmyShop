// CategoriaList.js
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  DeleteButton,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  ImageField,
  ImageInput,
  BooleanInput,
  required,
  FunctionField,
} from 'react-admin';
import { Box, Chip } from '@mui/material';

import SlugInput from '../../providers/SlugInput'; // Ruta ajustada según estructura

// ✅ LISTA DE CATEGORÍAS
export const CategoriaList = (props) => (
  <List {...props} perPage={25} sort={{ field: 'nombre', order: 'ASC' }}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="nombre" label="Nombre" />
      <TextField source="slug" label="Slug" />

      {/* ✅ IMAGEN DE CATEGORÍA: Apuntando al campo 'imagen_url' que debe traer la URL completa */}
      {/* ImageField espera una URL string */}
      <ImageField source="imagen_url" label="Imagen" sx={{ '& img': { maxWidth: 50, maxHeight: 50 } }} />

      {/* ✅ FECHA DE ACTUALIZACIÓN (con hora) */}
      <DateField
        source="actualizado"
        label="Actualizado"
        showTime
        locales="es-PE"
      />

      {/* ✅ INDICADOR ACTIVO/INACTIVO */}
      <FunctionField
        label="Activo"
        render={record => (
          <Chip
            label={record.activo ? 'Activo' : 'Inactivo'}
            color={record.activo ? 'success' : 'default'}
            size="small"
          />
        )}
      />

      {/* ✅ FECHA DE CREACIÓN (con hora) */}
      <DateField
        source="creado"
        label="Creado"
        showTime
        locales="es-PE"
      />

      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

// ✅ FORMULARIO REUTILIZABLE PARA CREAR Y EDITAR CATEGORÍAS
const CategoriaForm = () => (
  <SimpleForm>
    <Box display="flex" flexDirection="column" gap={2} width="100%">
      <Box display="flex" gap={2} width="100%">
        <TextInput
          source="nombre"
          label="Nombre"
          validate={required()}
          fullWidth
        />
        <SlugInput
          source="slug"
          label="Slug"
          validate={required()}
          fullWidth
          helperText="URL amigable (ej: vestidos-casuales)"
        />
      </Box>

      {/* ImageInput para subir/mostrar imagen en el formulario */}
      {/* Este SÍ debe usar 'imagen' porque es el nombre del campo del MODELO
          donde React Admin pone el archivo { rawFile, src } o la data existente { src, title }.
          El dataProvider se encargará de enviar esto al backend. */}
      <ImageInput
        source="imagen" // <-- Usa el nombre del campo del modelo aquí
        label="Imagen de categoría"
        accept="image/*"
        placeholder={<p>Arrastra una imagen aquí o haz clic</p>}
      >
         {/* ImageField dentro de ImageInput espera { src, title, rawFile } */}
        <ImageField source="src" title="Imagen seleccionada" />
      </ImageInput>

      <BooleanInput source="activo" label="Activo" />
    </Box>  </SimpleForm>
);

// ✅ CREAR CATEGORÍA
export const CategoriaCreate = (props) => (
  <Create {...props} redirect="list">
    <CategoriaForm />
  </Create>
);

// ✅ EDITAR CATEGORÍA
export const CategoriaEdit = (props) => (
  <Edit {...props} redirect="list">
    <CategoriaForm />
  </Edit>
);