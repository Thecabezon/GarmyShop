// MarcaList.js
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField, // Importa DateField
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
  BooleanInput,
} from 'react-admin';
import { Box, Chip } from '@mui/material';
import SlugInput from '../../providers/SlugInput'; // Asegúrate que la ruta sea correcta

// 🟩 Lista de marcas
export const MarcaList = (props) => (
  <List {...props} perPage={25} sort={{ field: 'nombre', order: 'ASC' }}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="nombre" label="Nombre" />
      <TextField source="slug" label="Slug" />

      {/* ✅ IMAGEN DE MARCA: Apuntando al campo 'imagen_url' del backend */}
      {/* ImageField espera una URL string */}
      <ImageField source="imagen_url" label="Imagen" sx={{ '& img': { maxWidth: 50, maxHeight: 50 } }} /> {/* sx es opcional para tamaño */}

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

      {/* ✅ FECHA DE CREACIÓN (con hora) */}
      {/* Este campo ya estaba presente y debería mostrarse si el backend lo envía */}
      <DateField
        source="creado"
        label="Creado"
        showTime
        locales="es-PE" // Muestra fecha y hora en formato local (Perú)
      />

       {/* ✅ FECHA DE ACTUALIZACIÓN (con hora) - Añadido para mostrar ambos */}
       {/* Asegúrate de que tu Serializer también incluya 'actualizado' */}
       <DateField
         source="actualizado"
         label="Actualizado"
         showTime
         locales="es-PE" // Muestra fecha y hora en formato local (Perú)
       />


      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

// 🟨 Formulario reutilizable
const MarcaForm = () => (
  <SimpleForm>
    <Box display="flex" flexDirection="column" gap={2} width="100%">
      <Box display="flex" gap={2} width="100%">
        <TextInput
          source="nombre"
          label="Nombre"
          validate={required()}
          fullWidth
        />
        {/* Asumiendo que SlugInput es para el campo slug de Marca */}
        <SlugInput
          source="slug"
          label="Slug"
          validate={required()}
          fullWidth
          helperText="URL amigable (ej: nike, adidas)"
        />

      </Box>

      {/* BooleanInput para el campo activo */}
      <BooleanInput source="activo" label="Activo" />

      {/* ImageInput para subir/mostrar imagen en el formulario */}
      {/* Usa 'imagen' que es el nombre del campo del modelo */}
      <ImageInput
        source="imagen" // <-- Usa el nombre del campo del modelo aquí
        label="Logo de marca"
        accept="image/*"
        placeholder={<p>Arrastra una imagen aquí, o haz clic para seleccionar</p>}
      >
         {/* ImageField dentro de ImageInput espera { src, title, rawFile } */}
        <ImageField source="src" title="Imagen seleccionada" />
      </ImageInput>
    </Box>
  </SimpleForm>
);

// 🟦 Crear marca
export const MarcaCreate = (props) => (
  <Create {...props}>
    <MarcaForm />
  </Create>
);

// 🟪 Editar marca
export const MarcaEdit = (props) => (
  <Edit {...props}>
    <MarcaForm />
  </Edit>
);