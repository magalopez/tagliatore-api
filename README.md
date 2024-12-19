# Tagliatore API

Tagliatore API es una API RESTful para la gestión de un restaurante, que incluye funcionalidades para manejar órdenes, clientes, meseros, platillos, categorías y chats en tiempo real.

## Requisitos

- Node.js
- MongoDB

## Instalación

1. Clona el repositorio:
   ```sh
   git clone https://github.com/tu-usuario/tagliatore-api.git
   cd tagliatore-api
2. Instala las dependencias:
   ```sh
   npm install
3. Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
   ```sh
    NODE_ENV=development
    PORT=5001
    MONGODB_URI=mongodb://localhost:27017/restaurant_db
    JWT_SECRET=your_jwt_secret_here_123
    FRONTEND_URL=http://localhost:5173/

## Uso

### Iniciar el servidor

- Para iniciar el servidor en modo desarrollo:
   ```sh
    npm run dev

## Endpoints

#### Autenticación
  ```sh
  POST /api/auth/register: Registrar un nuevo usuario.
  POST /api/auth/login: Iniciar sesión.
  GET /api/auth/me: Obtener información del usuario autenticado.
  PUT /api/auth/profile: Actualizar perfil del usuario autenticado.
  ```

#### Categorías
  ```sh
  GET /api/categories: Obtener todas las categorías.
  GET /api/categories/active: Obtener categorías activas.
  GET /api/categories/:id: Obtener una categoría por ID.
  POST /api/categories: Crear una nueva categoría.
  PUT /api/categories/:id: Actualizar una categoría.
  DELETE /api/categories/:id: Eliminar una categoría.
  ```

#### Clientes
  ```sh
  GET /api/clients: Obtener todos los clientes.
  GET /api/clients/:id: Obtener un cliente por ID.
  POST /api/clients: Crear un nuevo cliente.
  PUT /api/clients/:id: Actualizar un cliente.
  DELETE /api/clients/:id: Eliminar un cliente.
  ```

#### Platillos
  ```sh
  GET /api/dishes: Obtener todos los platillos.
  GET /api/dishes/:id: Obtener un platillo por ID.
  POST /api/dishes: Crear un nuevo platillo.
  PUT /api/dishes/:id: Actualizar un platillo.
  DELETE /api/dishes/:id: Eliminar un platillo.
  GET /api/dishes/category/:categoryId: Obtener platillos por categoría.
  ```

#### Órdenes
  ```sh
  GET /api/orders: Obtener todas las órdenes.
  GET /api/orders/status/:status: Obtener órdenes por estado.
  GET /api/orders/waiter/:waiterId: Obtener órdenes por mesero.
  POST /api/orders: Crear una nueva orden.
  PUT /api/orders/:id/status: Actualizar estado de una orden.
  PUT /api/orders/:id: Actualizar una orden.
  DELETE /api/orders/:id: Cancelar una orden.
  ```

#### Meseros
  ```sh
  GET /api/waiters: Obtener todos los meseros.
  GET /api/waiters/:id: Obtener un mesero por ID.
  POST /api/waiters: Crear un nuevo mesero.
  PUT /api/waiters/:id: Actualizar un mesero.
  DELETE /api/waiters/:id: Eliminar un mesero.
  ```

### Chats
  ```sh
  GET /api/chats: Obtener todos los chats.
  POST /api/chats: Crear un nuevo chat.
  POST /api/chats/message: Agregar un mensaje a un chat.
  ```
