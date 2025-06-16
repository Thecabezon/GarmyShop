import React, { useEffect } from 'react';
import { TextInput } from 'react-admin';
import { useFormContext, useWatch } from 'react-hook-form';

// Función para convertir texto a slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Reemplaza espacios por guiones
    .replace(/[^\w\-]+/g, '')       // Elimina caracteres no alfanuméricos
    .replace(/\-\-+/g, '-');        // Reemplaza múltiples guiones por uno solo
};

const SlugInput = (props) => {
  const { control, setValue } = useFormContext(); // setValue viene de aquí

  // Observar el campo 'nombre'
  const nombre = useWatch({ control, name: 'nombre' });

  // Actualizar slug cuando cambia nombre
  useEffect(() => {
    if (nombre) {
      setValue('slug', slugify(nombre), { shouldValidate: true, shouldDirty: true });
    }
  }, [nombre, setValue]);

  return <TextInput {...props} />;
};

export default SlugInput;