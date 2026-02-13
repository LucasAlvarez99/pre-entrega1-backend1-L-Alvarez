import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear instancia de ProductManager
const productManager = new ProductManager(
  path.join(__dirname, '../data/products.json')
);

// GET /api/products - Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).json({
      status: 'success',
      payload: products
    });
  } catch (error) {
    console.error('Error en GET /api/products:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener los productos',
      error: error.message
    });
  }
});

// GET /api/products/:pid - Obtener un producto por ID
router.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    
    res.status(200).json({
      status: 'success',
      payload: product
    });
  } catch (error) {
    console.error(`Error en GET /api/products/${req.params.pid}:`, error);
    
    if (error.message.includes('no encontrado')) {
      res.status(404).json({
        status: 'error',
        message: error.message
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Error al obtener el producto',
        error: error.message
      });
    }
  }
});

// POST /api/products - Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const productData = req.body;

    // Verificar que se haya enviado información
    if (!productData || Object.keys(productData).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Debe proporcionar los datos del producto'
      });
    }

    // El ID no debe venir en el body
    if (productData.id) {
      return res.status(400).json({
        status: 'error',
        message: 'El ID no debe ser proporcionado, se genera automáticamente'
      });
    }

    const newProduct = await productManager.addProduct(productData);

    res.status(201).json({
      status: 'success',
      message: 'Producto creado exitosamente',
      payload: newProduct
    });
  } catch (error) {
    console.error('Error en POST /api/products:', error);
    res.status(400).json({
      status: 'error',
      message: 'Error al crear el producto',
      error: error.message
    });
  }
});

// PUT /api/products/:pid - Actualizar un producto
router.put('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const updates = req.body;

    // Verificar que se haya enviado información
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Debe proporcionar al menos un campo para actualizar'
      });
    }

    // Verificar que no se intente actualizar el ID
    if (updates.id !== undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'No se puede actualizar el ID del producto'
      });
    }

    const updatedProduct = await productManager.updateProduct(pid, updates);

    res.status(200).json({
      status: 'success',
      message: 'Producto actualizado exitosamente',
      payload: updatedProduct
    });
  } catch (error) {
    console.error(`Error en PUT /api/products/${req.params.pid}:`, error);

    if (error.message.includes('no encontrado')) {
      res.status(404).json({
        status: 'error',
        message: error.message
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Error al actualizar el producto',
        error: error.message
      });
    }
  }
});

// DELETE /api/products/:pid - Eliminar un producto
router.delete('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const deletedProduct = await productManager.deleteProduct(pid);

    res.status(200).json({
      status: 'success',
      message: 'Producto eliminado exitosamente',
      payload: deletedProduct
    });
  } catch (error) {
    console.error(`Error en DELETE /api/products/${req.params.pid}:`, error);

    if (error.message.includes('no encontrado')) {
      res.status(404).json({
        status: 'error',
        message: error.message
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Error al eliminar el producto',
        error: error.message
      });
    }
  }
});

export default router;