# 🛒 Primera Entrega - Backend E-commerce

**Servidor backend con Node.js y Express para gestionar productos y carritos de compra**

---

## 📋 Descripción

API REST desarrollada para gestionar un sistema de e-commerce que permite:
- ✅ Crear, leer, actualizar y eliminar productos
- ✅ Gestionar carritos de compra
- ✅ Agregar productos a los carritos
- ✅ Persistencia de datos mediante archivos JSON

---

## 🚀 Instalación

### Requisitos Previos
- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

### Pasos

1. **Clonar o descargar el repositorio**

2. **Instalar las dependencias**
```bash
npm install
```

3. **Ejecutar el servidor**
```bash
npm start
```

El servidor estará disponible en: `http://localhost:8080`

---

## 📡 Endpoints de la API

### 🏷️ Productos (`/api/products`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Obtener todos los productos |
| GET | `/api/products/:pid` | Obtener un producto por ID |
| POST | `/api/products` | Crear un nuevo producto |
| PUT | `/api/products/:pid` | Actualizar un producto existente |
| DELETE | `/api/products/:pid` | Eliminar un producto |

#### Crear Producto (POST)
**URL:** `POST /api/products`


**Campos:**
- `title` (string, requerido): Nombre del producto
- `description` (string, requerido): Descripción del producto
- `code` (string, requerido): Código único del producto
- `price` (number, requerido): Precio (mayor a 0)
- `stock` (number, requerido): Cantidad disponible (mayor o igual a 0)
- `category` (string, requerido): Categoría del producto
- `status` (boolean, opcional): Estado del producto (default: true)
- `thumbnails` (array, opcional): Imágenes del producto (default: [])

**Nota:** El campo `id` se genera automáticamente y NO debe enviarse.

---

### 🛒 Carritos (`/api/carts`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/carts` | Crear un carrito vacío |
| GET | `/api/carts/:cid` | Obtener un carrito por ID |
| POST | `/api/carts/:cid/product/:pid` | Agregar producto al carrito |

#### Crear Carrito (POST)
**URL:** `POST /api/carts`

**Respuesta:**
```json
{
  "status": "success",
  "message": "Carrito creado exitosamente",
  "payload": {
    "id": 1,
    "products": []
  }
}
```

#### Agregar Producto al Carrito (POST)
**URL:** `POST /api/carts/:cid/product/:pid`

**Ejemplo:** `POST /api/carts/1/product/5`

**Comportamiento:**
- Si el producto NO existe en el carrito → Se agrega con `quantity: 1`
- Si el producto YA existe en el carrito → Se incrementa `quantity` en 1

**Respuesta:**
```json
{
  "status": "success",
  "message": "Producto agregado al carrito exitosamente",
  "payload": {
    "id": 1,
    "products": [
      {
        "product": 5,
        "quantity": 2
      }
    ]
  }
}
```

---

## 🔧 Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución de JavaScript
- **Express.js** - Framework web minimalista
- **File System (fs/promises)** - Persistencia de datos en archivos JSON
- **ES Modules** - Sintaxis moderna (import/export)

---

## 🧪 Pruebas con Postman

### Flujo de Prueba Básico

1. **Crear un producto:**
```
POST http://localhost:8080/api/products
Body:
{
  "title": "Mouse Logitech",
  "description": "Mouse inalámbrico",
  "code": "MOU001",
  "price": 1500,
  "stock": 25,
  "category": "Periféricos"
}
```

2. **Listar todos los productos:**
```
GET http://localhost:8080/api/products
```

3. **Crear un carrito:**
```
POST http://localhost:8080/api/carts
```

4. **Agregar producto al carrito:**
```
POST http://localhost:8080/api/carts/1/product/1
```

5. **Ver el carrito:**
```
GET http://localhost:8080/api/carts/1
```

---

## ✨ Características Implementadas

### Validaciones
- ✅ Todos los campos requeridos son validados
- ✅ El código del producto debe ser único
- ✅ El precio debe ser mayor a 0
- ✅ El stock debe ser mayor o igual a 0
- ✅ No se permite actualizar el ID de un producto
- ✅ Validación de tipos de datos

### Funcionalidades
- ✅ IDs autogenerados (productos y carritos)
- ✅ Operaciones CRUD completas para productos
- ✅ Gestión de carritos de compra
- ✅ Incremento automático de quantity en carritos
- ✅ Persistencia en archivos JSON
- ✅ Manejo robusto de errores
- ✅ Códigos de estado HTTP apropiados

---

## 📊 Códigos de Estado HTTP

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Operación exitosa (GET, PUT, DELETE) |
| 201 | Created | Recurso creado exitosamente (POST) |
| 400 | Bad Request | Datos inválidos o faltantes |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error del servidor |

---

## 🐛 Solución de Problemas

### El servidor no inicia
- Verifica que Node.js esté instalado: `node --version`
- Asegúrate de haber ejecutado: `npm install`

### Error "Cannot find module"
- Ejecuta: `npm install`
- Verifica que `package.json` tenga `"type": "module"`

### Los datos no se guardan
- Verifica que la carpeta `src/data/` exista
- Comprueba los permisos de escritura en la carpeta

### Error al crear producto
- Asegúrate de enviar todos los campos requeridos
- Verifica que el código del producto sea único
- Revisa que los tipos de datos sean correctos

---

## 📝 Scripts Disponibles

```bash
# Iniciar el servidor
npm start

# Iniciar con auto-reload (Node.js 18+)
npm run dev
```

---

## 👨‍💻 Autor

**Lucas Alvarez**

---

## 📄 Licencia

ISC

---

## 🎯 Requisitos Cumplidos

- ✅ Servidor en puerto 8080
- ✅ Rutas `/api/products` y `/api/carts` implementadas
- ✅ ProductManager con persistencia
- ✅ CartManager con persistencia
- ✅ IDs autogenerados
- ✅ Validaciones completas
- ✅ Manejo de errores
- ✅ Sin carpeta node_modules en el repositorio

---

**¡Proyecto listo para producción! 🚀**