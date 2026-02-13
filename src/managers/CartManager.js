import fs from 'fs/promises';
import path from 'path';

class CartManager {
  constructor(filePath) {
    this.path = filePath;
    this.carts = [];
    this.init();
  }

  // Inicializar el archivo si no existe
  async init() {
    try {
      await fs.access(this.path);
    } catch (error) {
      // Si el archivo no existe, crearlo con un array vacío
      await fs.writeFile(this.path, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  // Leer carritos del archivo
  async readCarts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.carts = JSON.parse(data);
      return this.carts;
    } catch (error) {
      console.error('Error al leer carritos:', error);
      throw new Error('Error al leer el archivo de carritos');
    }
  }

  // Guardar carritos en el archivo
  async saveCarts() {
    try {
      await fs.writeFile(
        this.path,
        JSON.stringify(this.carts, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.error('Error al guardar carritos:', error);
      throw new Error('Error al guardar el archivo de carritos');
    }
  }

  // Generar un ID único para el carrito
  generateId() {
    if (this.carts.length === 0) {
      return 1;
    }
    const maxId = Math.max(...this.carts.map(c => c.id));
    return maxId + 1;
  }

  // Crear un nuevo carrito vacío
  async createCart() {
    try {
      await this.readCarts();

      const newCart = {
        id: this.generateId(),
        products: []
      };

      this.carts.push(newCart);
      await this.saveCarts();

      return newCart;
    } catch (error) {
      throw error;
    }
  }

  // Obtener todos los carritos
  async getCarts() {
    try {
      await this.readCarts();
      return this.carts;
    } catch (error) {
      throw error;
    }
  }

  // Obtener un carrito por ID
  async getCartById(id) {
    try {
      await this.readCarts();
      const cart = this.carts.find(c => c.id === parseInt(id));

      if (!cart) {
        throw new Error(`Carrito con ID ${id} no encontrado`);
      }

      return cart;
    } catch (error) {
      throw error;
    }
  }

  // Agregar un producto al carrito
  async addProductToCart(cartId, productId) {
    try {
      await this.readCarts();

      const cartIndex = this.carts.findIndex(c => c.id === parseInt(cartId));

      if (cartIndex === -1) {
        throw new Error(`Carrito con ID ${cartId} no encontrado`);
      }

      // Buscar si el producto ya existe en el carrito
      const productIndex = this.carts[cartIndex].products.findIndex(
        p => p.product === parseInt(productId)
      );

      if (productIndex !== -1) {
        // Si el producto ya existe, incrementar la cantidad
        this.carts[cartIndex].products[productIndex].quantity += 1;
      } else {
        // Si el producto no existe, agregarlo con cantidad 1
        this.carts[cartIndex].products.push({
          product: parseInt(productId),
          quantity: 1
        });
      }

      await this.saveCarts();

      return this.carts[cartIndex];
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un producto del carrito (opcional, útil para futuras entregas)
  async removeProductFromCart(cartId, productId) {
    try {
      await this.readCarts();

      const cartIndex = this.carts.findIndex(c => c.id === parseInt(cartId));

      if (cartIndex === -1) {
        throw new Error(`Carrito con ID ${cartId} no encontrado`);
      }

      const productIndex = this.carts[cartIndex].products.findIndex(
        p => p.product === parseInt(productId)
      );

      if (productIndex === -1) {
        throw new Error(`Producto ${productId} no encontrado en el carrito`);
      }

      // Eliminar el producto del carrito
      this.carts[cartIndex].products.splice(productIndex, 1);

      await this.saveCarts();

      return this.carts[cartIndex];
    } catch (error) {
      throw error;
    }
  }

  // Actualizar la cantidad de un producto en el carrito (opcional)
  async updateProductQuantity(cartId, productId, quantity) {
    try {
      await this.readCarts();

      const cartIndex = this.carts.findIndex(c => c.id === parseInt(cartId));

      if (cartIndex === -1) {
        throw new Error(`Carrito con ID ${cartId} no encontrado`);
      }

      const productIndex = this.carts[cartIndex].products.findIndex(
        p => p.product === parseInt(productId)
      );

      if (productIndex === -1) {
        throw new Error(`Producto ${productId} no encontrado en el carrito`);
      }

      if (quantity <= 0) {
        throw new Error('La cantidad debe ser mayor a 0');
      }

      // Actualizar la cantidad
      this.carts[cartIndex].products[productIndex].quantity = quantity;

      await this.saveCarts();

      return this.carts[cartIndex];
    } catch (error) {
      throw error;
    }
  }

  // Vaciar un carrito (opcional)
  async clearCart(cartId) {
    try {
      await this.readCarts();

      const cartIndex = this.carts.findIndex(c => c.id === parseInt(cartId));

      if (cartIndex === -1) {
        throw new Error(`Carrito con ID ${cartId} no encontrado`);
      }

      // Vaciar el array de productos
      this.carts[cartIndex].products = [];

      await this.saveCarts();

      return this.carts[cartIndex];
    } catch (error) {
      throw error;
    }
  }
}

export default CartManager;