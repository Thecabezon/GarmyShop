// RUTA: frontend/src/resources/combinaciones-producto/index.js (CÓDIGO COMPLETO Y CORREGIDO)

import React from 'react';
import { 
    List, 
    Datagrid, 
    TextField, 
    NumberField, 
    EditButton, 
    Create, 
    Edit, 
    SimpleForm, 
    ReferenceInput, 
    SelectInput, 
    NumberInput, 
    TextInput, 
    required, 
    ReferenceField,
    DeleteButton,
    TopToolbar,
    CreateButton,
    FilterButton,
} from 'react-admin';

// Acciones personalizadas para la lista
const ListActions = () => (
    <TopToolbar>
        <FilterButton />
        <CreateButton />
    </TopToolbar>
);

// Filtros para la lista (CORREGIDO)
const combinacionFilters = [
    <ReferenceInput source="producto" label="Filtrar por Producto" reference="productos" alwaysOn>
        <SelectInput optionText="nombre" />
    </ReferenceInput>
];

// LISTA de todas las combinaciones
export const CombinacionProductoList = () => (
    <List actions={<ListActions />} filters={combinacionFilters}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="producto" label="ID Producto" /> 
            <ReferenceField source="producto" reference="productos" label="Producto">
                <TextField source="nombre" />
            </ReferenceField>
            <TextField source="talla_nombre" label="Talla" />
            <TextField source="color_nombre" label="Color" />
            <NumberField source="stock" />
            <TextField source="sku" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

// FORMULARIO para Crear y Editar una combinación
const CombinacionProductoForm = () => (
    <SimpleForm>
        <ReferenceInput source="producto" reference="productos">
            <SelectInput optionText="nombre" validate={required()} />
        </ReferenceInput>
        <ReferenceInput source="talla" reference="tallas">
            <SelectInput optionText="nombre" validate={required()} />
        </ReferenceInput>
        <ReferenceInput source="color" reference="colores">
            <SelectInput optionText="nombre" validate={required()} />
        </ReferenceInput>
        <NumberInput source="stock" validate={required()} />
        <TextInput source="sku" validate={required()} />
    </SimpleForm>
);

export const CombinacionProductoCreate = (props) => (
    <Create {...props} redirect="list">
        <CombinacionProductoForm />
    </Create>
);

export const CombinacionProductoEdit = (props) => (
    <Edit {...props} redirect="list">
        <CombinacionProductoForm />
    </Edit>
);