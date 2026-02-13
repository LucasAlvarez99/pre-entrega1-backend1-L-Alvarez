import express from 'express';
import productsRouter from './src/routes/products.router.js';
import cartsRouter from './src/routes/carts.router.js';

// Crear la aplicación Express
const app = express();
const PORT = 8080;

// Middlewares
app.use(express.json()); // Para parsear JSON en el body de las peticiones
app.use(express.urlencoded({ extended: true })); // Para parsear datos de formularios

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de E-commerce',
    endpoints: {
      products: {
        getAll: 'GET /api/products',
        getById: 'GET /api/products/:pid',
        create: 'POST /api/products',
        update: 'PUT /api/products/:pid',
        delete: 'DELETE /api/products/:pid'
      },
      carts: {
        getAll: 'GET /api/carts',
        create: 'POST /api/carts',
        getById: 'GET /api/carts/:cid',
        addProduct: 'POST /api/carts/:cid/product/:pid',
        removeProduct: 'DELETE /api/carts/:cid/product/:pid',
        updateQuantity: 'PUT /api/carts/:cid/product/:pid',
        clearCart: 'DELETE /api/carts/:cid'
      }
    }
  });
});

// Rutas principales
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error en la aplicación:', err);
  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor',
    error: err.message
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`╔════════════════════════════════════════╗`);
  console.log(`║  🚀 Servidor corriendo en el puerto ${PORT}  ║`);
  console.log(`╚════════════════════════════════════════╝`);
  console.log(`\n📍 URL: http://localhost:${PORT}`);
  console.log(`\n📦 Endpoints disponibles:`);
  console.log(`   • Productos: http://localhost:${PORT}/api/products`);
  console.log(`   • Carritos:  http://localhost:${PORT}/api/carts`);
  console.log(`\n💡 Usa Postman o Thunder Client para probar la API\n`);
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Error no capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Promesa rechazada no manejada:', error);
  process.exit(1);
});

export default app;