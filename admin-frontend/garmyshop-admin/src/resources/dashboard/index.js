import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import {
  TrendingUp,
  ShoppingCart,
  People,
  Inventory,
  Category,
  BrandingWatermark,
  AttachMoney,
  LocalShipping,
} from '@mui/icons-material';

const Dashboard = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        📊 Dashboard - GarmyShop
      </Typography>
      
      <Grid container spacing={3}>
        {/* Estadísticas principales */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" component="div">
                    150
                  </Typography>
                  <Typography variant="body2">
                    Productos Totales
                  </Typography>
                </Box>
                <Inventory sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" component="div">
                    85
                  </Typography>
                  <Typography variant="body2">
                    Órdenes Activas
                  </Typography>
                </Box>
                <ShoppingCart sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" component="div">
                    $12,450
                  </Typography>
                  <Typography variant="body2">
                    Ventas del Mes
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(45deg, #FF9800 30%, #FFC107 90%)',
            color: 'white',
            '&:hover': { transform: 'translateY(-2px)', transition: 'all 0.3s' }
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" component="div">
                    1,250
                  </Typography>
                  <Typography variant="body2">
                    Clientes Registrados
                  </Typography>
                </Box>
                <People sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Estadísticas secundarias */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '200px' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Category sx={{ mr: 2, color: '#1976d2' }} />
                <Typography variant="h6">
                  Categorías
                </Typography>
              </Box>
              <Typography variant="h3" color="primary" gutterBottom>
                25
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Categorías activas en el sistema
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '200px' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <BrandingWatermark sx={{ mr: 2, color: '#1976d2' }} />
                <Typography variant="h6">
                  Marcas
                </Typography>
              </Box>
              <Typography variant="h3" color="primary" gutterBottom>
                18
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Marcas registradas y activas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '200px' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <LocalShipping sx={{ mr: 2, color: '#1976d2' }} />
                <Typography variant="h6">
                  Envíos Pendientes
                </Typography>
              </Box>
              <Typography variant="h3" color="primary" gutterBottom>
                32
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Órdenes listas para envío
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de tendencias */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <TrendingUp sx={{ mr: 2, color: '#1976d2' }} />
                <Typography variant="h6">
                  Resumen de Actividad
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="success.main">
                      ↗️ +12%
                    </Typography>
                    <Typography variant="body2">
                      Ventas vs mes anterior
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="info.main">
                      ↗️ +8%
                    </Typography>
                    <Typography variant="body2">
                      Nuevos clientes
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h4" color="warning.main">
                      ↘️ -3%
                    </Typography>
                    <Typography variant="body2">
                      Productos devueltos
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// IMPORTANTE: Export por defecto
export default Dashboard;