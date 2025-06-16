// src/resources/ordenes/OrdenEdit.js
import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  Box,
} from 'react-admin';

// Estados de pago (copiados)
const estadosPago = [
  { id: 'pendiente', name: 'Pendiente' },
  { id: 'completado', name: 'Completado' },
  { id: 'fallido', name: 'Fallido' },
  { id: 'cancelado', name: 'Cancelado' },
];

// Estados de orden (copiados)
const estadosOrden = [
  { id: 'pendiente', name: 'Pendiente' },
  { id: 'procesando', name: 'Procesando' },
  { id: 'enviado', name: 'Enviado' },
  { id: 'entregado', name: 'Entregado' },
  { id: 'cancelado', name: 'Cancelado' },
];

// Métodos de pago (copiados)
const metodosPago = [
  { id: 'tarjeta', name: 'Tarjeta de Crédito/Débito' },
  { id: 'yape', name: 'Yape' },
  { id: 'plin', name: 'PLIN' },
  { id: 'transferencia', name: 'Transferencia Bancaria' },
  { id: 'contra_entrega', name: 'Contra Entrega' },
];


// 🟨 Formulario de edición de orden
const OrdenForm = () => (
  <SimpleForm> {/* No Toolbar por defecto, SubmitButton al pie */}
    <Box display="flex" flexDirection="column" gap={2} width="100%">
      {/* Solo campos que quieres editar */}
      <Box display="flex" gap={2} flexWrap="wrap"> {/* Usar flexWrap para responsividad */}
        <SelectInput
          source="estado_pago"
          label="Estado de Pago"
          choices={estadosPago}
          fullWidth // Considera false si usas flexWrap
          sx={{ minWidth: 200 }} // Ancho mínimo
        />
        <SelectInput
          source="estado"
          label="Estado de Orden"
          choices={estadosOrden}
          fullWidth // Considera false si usas flexWrap
           sx={{ minWidth: 200 }}
        />
         {/* Si método de pago fuera editable */}
        {/* <SelectInput
           source="metodo_pago"
           label="Método de Pago"
           choices={metodosPago}
           fullWidth
           sx={{ minWidth: 200 }}
         /> */}
      </Box>

      {/* Puedes añadir campos de solo lectura si quieres verlos en el formulario de edición */}
      {/* <TextField source="total" label="Total" /> */}
      {/* <DateField source="fecha_creacion" label="Fecha Creación" showTime locales="es-PE"/> */}

    </Box>
  </SimpleForm>
);


// 🟪 Editar orden
export const OrdenEdit = (props) => (
  <Edit {...props}>
    <OrdenForm />
  </Edit>
);