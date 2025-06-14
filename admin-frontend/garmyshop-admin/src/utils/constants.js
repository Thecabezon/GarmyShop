// Estados para órdenes
export const ESTADOS_ORDEN = {
    PENDIENTE: 'pendiente',
    PROCESANDO: 'procesando',
    ENVIADO: 'enviado',
    ENTREGADO: 'entregado',
    CANCELADO: 'cancelado',
  };
  
  export const ESTADOS_PAGO = {
    PENDIENTE: 'pendiente',
    PAGADO: 'pagado',
    FALLIDO: 'fallido',
    REEMBOLSADO: 'reembolsado',
  };
  
  export const METODOS_PAGO = {
    TARJETA: 'tarjeta',
    TRANSFERENCIA: 'transferencia',
    CONTRA_ENTREGA: 'contra_entrega',
  };
  
  // Opciones para los select
  export const OPCIONES_ESTADOS_ORDEN = [
    { id: 'pendiente', name: 'Pendiente' },
    { id: 'procesando', name: 'Procesando' },
    { id: 'enviado', name: 'Enviado' },
    { id: 'entregado', name: 'Entregado' },
    { id: 'cancelado', name: 'Cancelado' },
  ];
  
  export const OPCIONES_ESTADOS_PAGO = [
    { id: 'pendiente', name: 'Pendiente' },
    { id: 'pagado', name: 'Pagado' },
    { id: 'fallido', name: 'Fallido' },
    { id: 'reembolsado', name: 'Reembolsado' },
  ];
  
  export const OPCIONES_METODOS_PAGO = [
    { id: 'tarjeta', name: 'Tarjeta de Crédito/Débito' },
    { id: 'transferencia', name: 'Transferencia Bancaria' },
    { id: 'contra_entrega', name: 'Contra Entrega' },
  ];
  
  // Colores para los chips de estado
  export const COLORES_ESTADO_ORDEN = {
    pendiente: 'default',
    procesando: 'warning',
    enviado: 'info',
    entregado: 'success',
    cancelado: 'error',
  };
  
  export const COLORES_ESTADO_PAGO = {
    pendiente: 'default',
    pagado: 'success',
    fallido: 'error',
    reembolsado: 'info',
  };