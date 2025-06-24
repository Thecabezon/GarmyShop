// resources/colores/index.js
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  required,
} from 'react-admin';

// ✅ Lista de Colores
export const ColorList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit"> {/* Permite navegar al formulario de edición al hacer clic */}
      <TextField source="id" /> {/* Muestra el ID */}
      <TextField source="nombre" label="Nombre del Color" /> {/* Muestra el nombre */}
      <TextField source="codigo_hex" label="Código HEX" /> {/* Muestra el código HEX */}
      <EditButton /> {/* Botón para editar */}
      <DeleteButton /> {/* Botón para eliminar */}
    </Datagrid>
  </List>
);

// ✅ Formulario de Color (usado para crear y editar)
const ColorForm = () => (
  <SimpleForm>
    {/* Campo ID (solo se muestra en edición, deshabilitado) */}
     {/* <TextInput source="id" disabled label="Id" /> */} {/* Opcional mostrar ID en edición */}

    {/* Campo Nombre, obligatorio */}
    <TextInput source="nombre" label="Nombre del Color" validate={required()} fullWidth />
    
    {/* Campo Código HEX */}
    <TextInput source="codigo_hex" label="Código HEX" fullWidth helperText="Ej: #FFFFFF" /> {/* Puedes añadir validación específica para HEX si quieres */}
  </SimpleForm>
);

// ✅ Crear Color
export const ColorCreate = (props) => (
  <Create {...props} redirect="list">
    <ColorForm /> {/* Usa el formulario definido */}
  </Create>
);

// ✅ Editar Color
export const ColorEdit = (props) => (
  <Edit {...props} redirect="list">
    <ColorForm /> {/* Usa el formulario definido */}
  </Edit>
);