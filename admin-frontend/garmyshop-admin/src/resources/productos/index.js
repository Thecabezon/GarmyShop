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
  Show,
  SimpleForm,
  TextInput,
  NumberInput,
  SelectInput,
  NumberField,
  ReferenceInput,
  ReferenceField,
  ImageField,
  ImageInput,
  required,
  FunctionField,
  BooleanInput,
  BooleanField,
  TabbedForm,
  FormTab,
  TabbedShowLayout,
  Tab,
  SimpleShowLayout,
  ArrayField,
  SingleFieldList,
  ChipField,
} from 'react-admin';
import { Box, Chip } from '@mui/material';

// 🟩 Lista de productos
export const ProductoList = (props) => (
  <List {...props} perPage={25} sort={{ field: 'nombre', order: 'ASC' }}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="nombre" label="Nombre" />
      <TextField source="sku" label="SKU" />
      
      {/* Marca */}
      <ReferenceField source="marca" reference="marcas" label="Marca">
        <TextField source="nombre" />
      </ReferenceField>
      
      {/* Categoría */}
      <ReferenceField source="categoria" reference="categorias" label="Categoría">
        <TextField source="nombre" />
      </ReferenceField>
      
      <NumberField 
        source="precio" 
        label="Precio" 
        options={{ style: 'currency', currency: 'PEN' }} 
      />
      
      <NumberField 
        source="precio_oferta" 
        label="P. Oferta" 
        options={{ style: 'currency', currency: 'PEN' }} 
      />
      
      {/* Estado activo */}
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
      
      {/* Destacado */}
      <FunctionField
        label="Destacado"
        render={record => (
          <Chip
            label={record.destacado ? 'Sí' : 'No'}
            color={record.destacado ? 'primary' : 'default'}
            size="small"
            variant={record.destacado ? 'filled' : 'outlined'}
          />
        )}
      />
      
      <DateField source="creado" label="Creado" showTime />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

// 🟨 Formulario de producto
const ProductoForm = () => (
  <TabbedForm>
    {/* Pestaña: Información General */}
    <FormTab label="Información General">
      <Box display="flex" flexDirection="column" gap={2} width="100%">
        <Box display="flex" gap={2} width="100%">
          <TextInput 
            source="nombre" 
            label="Nombre del Producto"
            validate={required()}
            fullWidth
          />
          <TextInput 
            source="sku" 
            label="SKU"
            validate={required()}
            fullWidth
            helperText="Código único del producto"
          />
        </Box>
        
        <Box display="flex" gap={2} width="100%">
          <ReferenceInput source="marca" reference="marcas" label="Marca">
            <SelectInput optionText="nombre" validate={required()} fullWidth />
          </ReferenceInput>
          
          <ReferenceInput source="categoria" reference="categorias" label="Categoría">
            <SelectInput optionText="nombre" validate={required()} fullWidth />
          </ReferenceInput>
        </Box>
        
        <TextInput 
          source="descripcion" 
          label="Descripción"
          multiline
          rows={4}
          fullWidth
        />
        
        <Box display="flex" gap={2} width="100%">
          <BooleanInput source="activo" label="Producto Activo" />
          <BooleanInput source="destacado" label="Producto Destacado" />
        </Box>
      </Box>
    </FormTab>
    
    {/* Pestaña: Precios e Inventario */}
    <FormTab label="Precios e Inventario">
      <Box display="flex" flexDirection="column" gap={2} width="100%">
        <Box display="flex" gap={2} width="100%">
          <NumberInput 
            source="precio" 
            label="Precio Regular"
            validate={required()}
            min={0}
            step={0.01}
            fullWidth
          />
          <NumberInput 
            source="precio_oferta" 
            label="Precio de Oferta"
            min={0}
            step={0.01}
            fullWidth
            helperText="Opcional - Precio promocional"
          />
        </Box>
        
        <Box display="flex" gap={2} width="100%">
          <NumberInput 
            source="stock_total" 
            label="Stock Total"
            min={0}
            fullWidth
          />
          <NumberInput 
            source="stock_minimo" 
            label="Stock Mínimo"
            min={0}
            fullWidth
            helperText="Alerta cuando esté por debajo"
          />
        </Box>
        
        <Box display="flex" gap={2} width="100%">
          <NumberInput 
            source="peso" 
            label="Peso (gramos)"
            min={0}
            fullWidth
          />
          <TextInput 
            source="dimensiones" 
            label="Dimensiones"
            fullWidth
            helperText="Ej: 20x15x5 cm"
          />
        </Box>
      </Box>
    </FormTab>
    
    {/* Pestaña: Imágenes */}
    <FormTab label="Imágenes">
      <ImageInput 
        source="imagen_principal" 
        label="Imagen Principal"
        accept="image/*"
        placeholder={<p>Arrastra la imagen principal aquí</p>}
      >
        <ImageField source="src" title="Imagen Principal" />
      </ImageInput>
      
      <ImageInput 
        source="imagenes" 
        label="Imágenes Adicionales"
        accept="image/*"
        multiple
        placeholder={<p>Arrastra imágenes adicionales aquí</p>}
      >
        <ImageField source="src" title="Imagen" />
      </ImageInput>
    </FormTab>
  </TabbedForm>
);

// 🟦 Crear producto
export const ProductoCreate = (props) => (
  <Create {...props}>
    <ProductoForm />
  </Create>
);

// 🟪 Editar producto
export const ProductoEdit = (props) => (
  <Edit {...props}>
    <ProductoForm />
  </Edit>
);

// 🟫 Mostrar producto
export const ProductoShow = (props) => (
  <Show {...props}>
    <TabbedShowLayout>
      <Tab label="Información General">
        <TextField source="id" />
        <TextField source="nombre" label="Nombre" />
        <TextField source="sku" label="SKU" />
        <TextField source="slug" label="Slug" />
        
        <ReferenceField source="marca" reference="marcas" label="Marca">
          <TextField source="nombre" />
        </ReferenceField>
        
        <ReferenceField source="categoria" reference="categorias" label="Categoría">
          <TextField source="nombre" />
        </ReferenceField>
        
        <TextField source="descripcion" label="Descripción" />
        
        <BooleanField source="activo" label="Activo" />
        <BooleanField source="destacado" label="Destacado" />
        
        <DateField source="creado" label="Fecha de Creación" showTime />
        <DateField source="actualizado" label="Última Actualización" showTime />
      </Tab>
      
      <Tab label="Precios e Inventario">
        <NumberField 
          source="precio" 
          label="Precio Regular" 
          options={{ style: 'currency', currency: 'PEN' }} 
        />
        <NumberField 
          source="precio_oferta" 
          label="Precio de Oferta" 
          options={{ style: 'currency', currency: 'PEN' }} 
        />
        
        <NumberField source="stock_total" label="Stock Total" />
        <NumberField source="stock_minimo" label="Stock Mínimo" />
        <NumberField source="peso" label="Peso (gramos)" />
        <TextField source="dimensiones" label="Dimensiones" />
        
        {/* Alerta de stock bajo */}
        <FunctionField
          label="Estado de Stock"
          render={record => {
            if (record.stock_total <= record.stock_minimo) {
              return (
                <Chip
                  label="Stock Bajo"
                  color="error"
                  size="small"
                />
              );
            }
            return (
              <Chip
                label="Stock OK"
                color="success"
                size="small"
              />
            );
          }}
        />
      </Tab>
      
      <Tab label="Imágenes">
        <ImageField source="imagen_principal.src" label="Imagen Principal" />
        
        <ArrayField source="imagenes" label="Imágenes Adicionales">
          <SingleFieldList>
            <ImageField source="src" />
          </SingleFieldList>
        </ArrayField>
      </Tab>
      
      <Tab label="Variaciones">
        <ArrayField source="tallas_disponibles" label="Tallas Disponibles">
          <SingleFieldList>
            <ChipField source="nombre" />
          </SingleFieldList>
        </ArrayField>
        
        <ArrayField source="colores_disponibles" label="Colores Disponibles">
          <SingleFieldList>
            <ChipField source="nombre" />
          </SingleFieldList>
        </ArrayField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);

