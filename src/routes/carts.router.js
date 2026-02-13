import { Router } from 'express';
import CartManager from '../managers/CartManager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear instancia de CartManager
const cartManager = new CartManager(
  path.join(__dirname, '../data/carts.json')
);

// POST /api/carts - Crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();

    res.status(201).json({
      status: 'success',
      message: 'Carrito creado exitosamente',
      payload: newCart
    });
  } catch (error) {
    console.error('Error en POST /api/carts:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al crear el carrito',
      error: error.message
    });
  }
});

// GET /api/carts/:cid - Obtener los productos de un carrito específico
router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);

    res.status(200).json({
      status: 'success',
      payload: cart
    });
  } catch (error) {
    console.error(`Error en GET /api/carts/${req.params.cid}:`, error);

    if (error.message.includes('no encontrado')) {
      res.status(404).json({
        status: 'error',
        message: error.message
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Error al obtener el carrito',
        error: error.message
      });
    }
  }
});

// POST /api/carts/:cid/product/:pid - Agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    // Validar que los IDs sean números válidos
    if (isNaN(cid) || isNaN(pid)) {
      return res.status(400).json({
        status: 'error',
        message: 'Los IDs deben ser números válidos'
      });
    }

    const updatedCart = await cartManager.addProductToCart(cid, pid);

    res.status(200).json({
      status: 'success',
      message: 'Producto agregado al carrito exitosamente',
      payload: updatedCart
    });
  } catch (error) {
    console.error(`Error en POST /api/carts/${req.params.cid}/product/${req.params.pid}:`, error);

    if (error.message.includes('no encontrado')) {
      res.status(404).json({
        status: 'error',
        message: error.message
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Error al agregar el producto al carrito',
        error: error.message
      });
    }
  }
});

// GET /api/carts - Obtener todos los carritos (opcional, útil para debugging)
router.get('/', async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.status(200).json({
      status: 'success',
      payload: carts
    });
  } catch (error) {
    console.error('Error en GET /api/carts:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener los carritos',
      error: error.message
    });
  }
});

// DELETE /api/carts/:cid/product/:pid - Eliminar un producto del carrito (opcional)
router.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const updatedCart = await cartManager.removeProductFromCart(cid, pid);

    res.status(200).json({
      status: 'success',
      message: 'Producto eliminado del carrito exitosamente',
      payload: updatedCart
    });
  } catch (error) {
    console.error(`Error en DELETE /api/carts/${req.params.cid}/product/${req.params.pid}:`, error);

    if (error.message.includes('no encontrado')) {
      res.status(404).json({
        status: 'error',
        message: error.message
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Error al eliminar el producto del carrito',
        error: error.message
      });
    }
  }
});

// PUT /api/carts/:cid/product/:pid - Actualizar cantidad de un producto (opcional)
router.put('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || isNaN(quantity)) {
      return res.status(400).json({
        status: 'error',
        message: 'Debe proporcionar una cantidad válida'
      });
    }

    const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);

    res.status(200).json({
      status: 'success',
      message: 'Cantidad actualizada exitosamente',
      payload: updatedCart
    });
  } catch (error) {
    console.error(`Error en PUT /api/carts/${req.params.cid}/product/${req.params.pid}:`, error);

    if (error.message.includes('no encontrado')) {
      res.status(404).json({
        status: 'error',
        message: error.message
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Error al actualizar la cantidad',
        error: error.message
      });
    }
  }
});

// DELETE /api/carts/:cid - Vaciar un carrito (opcional)
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    const clearedCart = await cartManager.clearCart(cid);

    res.status(200).json({
      status: 'success',
      message: 'Carrito vaciado exitosamente',
      payload: clearedCart
    });
  } catch (error) {
    console.error(`Error en DELETE /api/carts/${req.params.cid}:`, error);

    if (error.message.includes('no encontrado')) {
      res.status(404).json({
        status: 'error',
        message: error.message
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Error al vaciar el carrito',
        error: error.message
      });
    }
  }
});

export default router;