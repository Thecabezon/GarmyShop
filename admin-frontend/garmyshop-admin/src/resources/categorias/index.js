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
  required,
  FunctionField,
} from 'react-admin';
import { Box, Chip } from '@mui/material';


// 🟩 Lista de categorías
export const CategoriaList = (props) => (
  <List {...props} perPage={25} sort={{ field: 'nombre', order: 'ASC' }}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="nombre" label="Nombre" />
      <TextField source="slug" label="Slug" />
      <ImageField source="imagen.src" label="Imagen" />
      
      {/* Chip personalizado para estado activo/inactivo */}
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

      <DateField source="creado" label="Creado" showTime />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);


// 🟨 Formulario reutilizable
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
        <TextInput 
          source="slug" 
          label="Slug" 
          validate={required()}
          fullWidth
          helperText="URL amigable (ej: vestidos-casuales)"
        />
      </Box>

      <ImageInput 
        source="imagen" 
        label="Imagen de categoría"
        accept="image/*"
        placeholder={<p>Arrastra una imagen aquí, o haz clic para seleccionar</p>}
      >
        <ImageField source="src" title="Imagen seleccionada" />
      </ImageInput>
    </Box>
  </SimpleForm>
);


// 🟦 Crear categoría
export const CategoriaCreate = (props) => (
  <Create {...props}>
    <CategoriaForm />
  </Create>
);


// 🟪 Editar categoría
export const CategoriaEdit = (props) => (
  <Edit {...props}>
    <CategoriaForm />
  </Edit>
);
