import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useGetList } from 'react-admin';

// Componente de tarjeta de estadística
const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card elevation={2}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" color={color} fontWeight="bold">
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box color={color} fontSize="3rem">
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// Componente de órdenes recientes
const RecentOrders = () => {
  const { data: ordenes, isLoading } = useGetList(
    'ordenes',
    {
      pagination: { page: 1, perPage: 5 },
      sort: { field: 'fecha_creacion', order: 'DESC' },
    }
  );

  if (isLoading) return <div>Cargando órdenes...</div>;

  return (
    <Card elevation={2}>
      <CardHeader title="Órdenes Recientes" />
      <CardContent>
        {ordenes?.map((orden) => (
          <Box 
            key={orden.id} 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
            py={1}
            borderBottom="1px solid #eee"
          >
            <Box>
              <Typography variant="body1" fontWeight="medium">
                Orden #{orden.id}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {orden.usuario_nombre} - {new Date(orden.fecha_creacion).toLocaleDateString()}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body1" fontWeight="bold">
                S/. {orden.total}
              </Typography>
              <Chip
                label={orden.estado}
                size="small"
                color={
                  orden.estado === 'entregado' ? 'success' :
                  orden.estado === 'enviado' ? 'info' :
                  orden.estado === 'procesando' ? 'warning' : 'default'
                }
              />
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

// Componente de productos con bajo stock
const LowStockProducts = () => {
  const { data: combinaciones, isLoading } = useGetList(
    'combinaciones-producto',
    {
      pagination: { page: 1, perPage: 10 },
      sort: { field: 'stock', order: 'ASC' },
      filter: { stock__lte: 5 },
    }
  );

  if (isLoading) return <div>Cargando productos...</div>;

  return (
    <Card elevation={2}>
      <CardHeader title="Productos con Bajo Stock" />
      <CardContent>
        {combinaciones?.map((combinacion) => (
          <Box 
            key={combinacion.id} 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
            py={1}
            borderBottom="1px solid #eee"
          >
            <Box>
              <Typography variant="body1" fontWeight="medium">
                {combinacion.producto_nombre || `Producto ${combinacion.producto}`}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {combinacion.talla_nombre} - {combinacion.color_nombre}
              </Typography>
            </Box>
            <Chip
              label={`${combinacion.stock} unidades`}
              size="small"
              color={combinacion.stock === 0 ? 'error' : 'warning'}
            />
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export const Dashboard = () => {
  // Obtener datos para las estadísticas
  const { data: productos } = useGetList('productos', {
    pagination: { page: 1, perPage: 1 },
  });
  
  const { data: ordenes } = useGetList('ordenes', {
    pagination: { page: 1, perPage: 1 },
  });

  const { data: usuarios } = useGetList('usuarios', {
    pagination: { page: 1, perPage: 1 },
  });

  const totalProductos = productos?.length || 0;
  const totalOrdenes = ordenes?.length || 0;
  const totalUsuarios = usuarios?.length || 0;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Dashboard - GarmyShop
      </Typography>
      
      <Grid container spacing={3}>
        {/* Estadísticas principales */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Productos"
            value={totalProductos}
            icon={<InventoryIcon />}
            color="primary.main"
            subtitle="Productos activos"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Órdenes Totales"
            value={totalOrdenes}
            icon={<ShoppingCartIcon />}
            color="success.main"
            subtitle="Todas las órdenes"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Usuarios"
            value={totalUsuarios}
            icon={<PeopleIcon />}
            color="info.main"
            subtitle="Usuarios registrados"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Ventas del Mes"
            value="S/. 12,450"
            icon={<TrendingUpIcon />}
            color="warning.main"
            subtitle="Ingresos mensuales"
          />
        </Grid>

        {/* Órdenes recientes */}
        <Grid item xs={12} md={6}>
          <RecentOrders />
        </Grid>

        {/* Productos con bajo stock */}
        <Grid item xs={12} md={6}>
          <LowStockProducts />
        </Grid>
      </Grid>
    </Box>
  );
};