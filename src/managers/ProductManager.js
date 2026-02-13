import fs from 'fs/promises';
import path from 'path';

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
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

  // Leer productos del archivo
  async readProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
      return this.products;
    } catch (error) {
      console.error('Error al leer productos:', error);
      throw new Error('Error al leer el archivo de productos');
    }
  }

  // Guardar productos en el archivo
  async saveProducts() {
    try {
      await fs.writeFile(
        this.path,
        JSON.stringify(this.products, null, 2),
        'utf-8'
      );
    } catch (error) {
      console.error('Error al guardar productos:', error);
      throw new Error('Error al guardar el archivo de productos');
    }
  }

  // Generar un ID único para el producto
  generateId() {
    if (this.products.length === 0) {
      return 1;
    }
    const maxId = Math.max(...this.products.map(p => p.id));
    return maxId + 1;
  }

  // Validar que todos los campos requeridos estén presentes
  validateProduct(product) {
    const requiredFields = [
      'title',
      'description',
      'code',
      'price',
      'stock',
      'category'
    ];

    for (const field of requiredFields) {
      if (product[field] === undefined || product[field] === null) {
        throw new Error(`El campo '${field}' es requerido`);
      }
    }

    // Validar tipos de datos
    if (typeof product.title !== 'string' || product.title.trim() === '') {
      throw new Error('El título debe ser un texto válido');
    }

    if (typeof product.description !== 'string' || product.description.trim() === '') {
      throw new Error('La descripción debe ser un texto válido');
    }

    if (typeof product.code !== 'string' || product.code.trim() === '') {
      throw new Error('El código debe ser un texto válido');
    }

    if (typeof product.price !== 'number' || product.price <= 0) {
      throw new Error('El precio debe ser un número mayor a 0');
    }

    if (typeof product.stock !== 'number' || product.stock < 0) {
      throw new Error('El stock debe ser un número mayor o igual a 0');
    }

    if (typeof product.category !== 'string' || product.category.trim() === '') {
      throw new Error('La categoría debe ser un texto válido');
    }

    return true;
  }

  // Agregar un nuevo producto
  async addProduct(productData) {
    try {
      await this.readProducts();

      // Validar los datos del producto
      this.validateProduct(productData);

      // Verificar que el código no esté duplicado
      const codeExists = this.products.some(p => p.code === productData.code);
      if (codeExists) {
        throw new Error(`Ya existe un producto con el código '${productData.code}'`);
      }

      // Crear el nuevo producto con ID autogenerado
      const newProduct = {
        id: this.generateId(),
        title: productData.title,
        description: productData.description,
        code: productData.code,
        price: productData.price,
        status: productData.status !== undefined ? productData.status : true,
        stock: productData.stock,
        category: productData.category,
        thumbnails: productData.thumbnails || []
      };

      // Agregar el producto al array
      this.products.push(newProduct);

      // Guardar en el archivo
      await this.saveProducts();

      return newProduct;
    } catch (error) {
      throw error;
    }
  }

  // Obtener todos los productos
  async getProducts() {
    try {
      await this.readProducts();
      return this.products;
    } catch (error) {
      throw error;
    }
  }

  // Obtener un producto por ID
  async getProductById(id) {
    try {
      await this.readProducts();
      const product = this.products.find(p => p.id === parseInt(id));
      
      if (!product) {
        throw new Error(`Producto con ID ${id} no encontrado`);
      }

      return product;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un producto (NO se debe actualizar el ID)
  async updateProduct(id, updates) {
    try {
      await this.readProducts();

      const index = this.products.findIndex(p => p.id === parseInt(id));

      if (index === -1) {
        throw new Error(`Producto con ID ${id} no encontrado`);
      }

      // Evitar que se actualice el ID
      if (updates.id !== undefined) {
        throw new Error('No se puede actualizar el ID del producto');
      }

      // Validar que el código no esté duplicado (si se está actualizando)
      if (updates.code) {
        const codeExists = this.products.some(
          p => p.code === updates.code && p.id !== parseInt(id)
        );
        if (codeExists) {
          throw new Error(`Ya existe otro producto con el código '${updates.code}'`);
        }
      }

      // Actualizar solo los campos proporcionados
      this.products[index] = {
        ...this.products[index],
        ...updates,
        id: this.products[index].id // Mantener el ID original
      };

      await this.saveProducts();

      return this.products[index];
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un producto
  async deleteProduct(id) {
    try {
      await this.readProducts();

      const index = this.products.findIndex(p => p.id === parseInt(id));

      if (index === -1) {
        throw new Error(`Producto con ID ${id} no encontrado`);
      }

      // Eliminar el producto del array
      const deletedProduct = this.products.splice(index, 1)[0];

      await this.saveProducts();

      return deletedProduct;
    } catch (error) {
      throw error;
    }
  }
}

export default ProductManager;