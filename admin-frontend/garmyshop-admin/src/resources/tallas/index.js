// resources/tallas/index.js
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

// ✅ Lista de Tallas
export const TallaList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit"> {/* Permite navegar al formulario de edición al hacer clic */}
      <TextField source="id" /> {/* Muestra el ID */}
      <TextField source="nombre" label="Talla" /> {/* Muestra el nombre de la talla */}
      <EditButton /> {/* Botón para editar */}
      <DeleteButton /> {/* Botón para eliminar */}
    </Datagrid>
  </List>
);

// ✅ Formulario de Talla (usado para crear y editar)
const TallaForm = () => (
  <SimpleForm>
    {/* Campo ID (solo se muestra en edición, deshabilitado) */}
    {/* <TextInput source="id" disabled label="Id" /> */} {/* Opcional mostrar ID en edición */}
    
    {/* Campo Nombre, obligatorio */}
    <TextInput source="nombre" label="Nombre de la Talla" validate={required()} fullWidth />
  </SimpleForm>
);

// ✅ Crear Talla
export const TallaCreate = (props) => (
  <Create {...props} redirect="list">
    <TallaForm /> {/* Usa el formulario definido */}
  </Create>
);

// ✅ Editar Talla
export const TallaEdit = (props) => (
  <Edit {...props} redirect="list">
    <TallaForm /> {/* Usa el formulario definido */}
  </Edit>
);