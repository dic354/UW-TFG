# UrbanWear — Backend API REST

REST API for the UrbanWear urban fashion e-commerce platform. Built with NestJS, Prisma ORM and MySQL.

**Repository:** `https://github.com/dic354/urbanwear-backend`

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Data Validation](#data-validation)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Docker](#docker)
- [Project Structure](#project-structure)
- [Author](#author)

---

## Overview

UrbanWear Backend is a monolithic REST API built with NestJS that centralizes all business logic for the e-commerce platform. It handles product catalog management, role-based authentication, shopping cart, orders, discount codes and product reviews.

The architecture follows a Client-Server pattern where the Angular frontend consumes the API endpoints via HTTP requests. All internal communication between modules is handled through dependency injection managed by the NestJS IoC container.

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| NestJS | ^11.0 | Main backend framework |
| TypeScript | ^5.0 | Programming language |
| Prisma ORM | ^6.0 | Data access layer and schema management |
| MySQL | 8.0 | Relational database |
| JWT | — | Stateless authentication |
| Passport.js | — | Authentication middleware and strategies |
| bcrypt | — | Secure password hashing |
| class-validator | — | Declarative DTO validation |
| class-transformer | — | Object transformation and serialization |
| Swagger / OpenAPI | — | Interactive API documentation |
| Docker | — | MySQL and phpMyAdmin containers for local development |

---

## Architecture

### Module structure

NestJS organizes the application into modules. Each module encapsulates a business domain and is composed of three layers:

```
Controller
    Receives the HTTP request, extracts parameters and delegates
    to the service. Contains no business logic.

Service
    Contains all business logic. Interacts with the database
    through PrismaService. Injected into the controller.

DTO (Data Transfer Object)
    Defines and validates the structure of data entering and
    leaving each endpoint. Uses class-validator decorators.
```

### HTTP request lifecycle

```
Incoming HTTP Request
        |
        v
main.ts — ValidationPipe (global)
    Validates and transforms the request body against the DTO
        |
        v
JwtAuthGuard
    Verifies the JWT token in the Authorization header
    Returns 401 Unauthorized if invalid or expired
        |
        v
RolesGuard
    Checks that the user role matches the @Roles() decorator
    Returns 403 Forbidden if insufficient permissions
        |
        v
Controller
    Extracts URL params, query params and body
    Calls the corresponding Service method
        |
        v
Service
    Executes business logic
    Interacts with PrismaService to query MySQL
        |
        v
PrismaService
    Executes the query against MySQL
    Returns typed data to the Service
        |
        v
HTTP Response
```

### Global PrismaModule

`PrismaModule` is decorated with `@Global()`, making `PrismaService` available across all modules without needing to import it explicitly. All services receive it via dependency injection in their constructor.

```typescript
constructor(private prisma: PrismaService) {}
```

### Authentication flow

```
AuthService
    Handles registration (hashes password with bcrypt) and login
    (compares hash with bcrypt, generates JWT token on success).

JwtStrategy
    Runs on every protected request. Extracts the token from the
    Authorization: Bearer <token> header, verifies its signature
    with JWT_SECRET and looks up the user in the database.
    If valid, attaches the user to the request as req.user.

JwtAuthGuard
    Intercepts the request before reaching the controller.
    Activates JwtStrategy automatically.
    Returns 401 Unauthorized if the token is invalid or expired.

RolesGuard
    Runs after JwtAuthGuard. Reads the @Roles() decorator from
    the endpoint and compares the user role (req.user.rol) with
    the required roles. Returns 403 Forbidden if they do not match.
```

### Order creation transaction flow

The orders module is the most complex as it orchestrates multiple models within a single database transaction:

```
1.  Client sends POST /pedidos with shipping data and payment method
2.  PedidosService fetches the user's cart items from the database
3.  Validates that the cart is not empty
4.  Validates available stock for each product in the cart
5.  If a discount code is provided, verifies its validity and expiry
6.  Calculates the total applying the discount if applicable
7.  Executes a Prisma $transaction that atomically:
    a. Creates the Pedido record
    b. Creates DetallePedido records for each cart item
    c. Decrements stock for each product
    d. Increments usosActuales of the discount if one was applied
    e. Deletes all cart items for the user
8.  If any step fails, the transaction rolls back automatically
    and no changes are persisted in the database
9.  Returns the created order with all its details
```

---

## Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- Docker Desktop installed and running
- NestJS CLI: `npm install -g @nestjs/cli`

---

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/dic354/urbanwear-backend.git
cd urbanwear-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root. See [Environment Variables](#environment-variables).

### 4. Start Docker containers

```bash
docker compose up -d
```

This starts:
- MySQL 8.0 at `localhost:3306`
- phpMyAdmin at `localhost:8080`

### 5. Push schema to database and generate client

```bash
npx prisma db push
npx prisma generate
```

`db push` applies the schema defined in `prisma/schema.prisma` to the database, creating all tables and relations. `generate` produces the typed Prisma client based on the schema.

### 6. Start the development server

```bash
npm run start:dev
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="mysql://urbanwear_user:urbanwear_pass@localhost:3306/urbanwear"

# Authentication
JWT_SECRET="your-strong-secret-key"
```

For production on the VPS, these variables are set directly in the server environment or via a process manager like PM2.

| Variable | Description |
|---|---|
| `DATABASE_URL` | MySQL connection string |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens |

The `.env` file is listed in `.gitignore` and must never be committed to the repository.

---

## Database

The database schema is defined in `prisma/schema.prisma` and contains the following entities:

| Entity | Table | Description |
|---|---|---|
| Usuario | `usuarios` | Platform clients and administrators |
| Categoria | `categorias` | Product classification categories |
| Producto | `productos` | Full catalog of clothing and accessories |
| ProductoImagen | `producto_imagenes` | Additional images per product |
| Carrito | `carritos` | Shopping cart items per user |
| Pedido | `pedidos` | Confirmed purchase orders |
| DetallePedido | `detalle_pedidos` | Line items for each order |
| Descuento | `descuentos` | Discount codes with percentage and validity |
| Resena | `resenas` | Product ratings and reviews |

### Entity relationships

```
Categoria   (1) ---- (N) Producto
Producto    (1) ---- (N) ProductoImagen
Producto    (1) ---- (N) DetallePedido
Producto    (1) ---- (N) Carrito
Producto    (1) ---- (N) Resena
Usuario     (1) ---- (N) Pedido
Usuario     (1) ---- (N) Carrito
Usuario     (1) ---- (N) Resena
Pedido      (1) ---- (N) DetallePedido
Descuento   (1) ---- (N) Pedido
```

### Enumerations

```
Rol          -> cliente | administrador
Talla        -> XS | S | M | L | XL | XXL
EstadoPedido -> pendiente | procesando | enviado | entregado | cancelado
MetodoPago   -> tarjeta | paypal | transferencia
```

---

## API Endpoints

### Auth

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Sign in and receive JWT token | Public |

### Categorias

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/categorias` | List all categories | Public |
| GET | `/categorias/:id` | Get category with its products | Public |
| POST | `/categorias` | Create category | Admin |
| PUT | `/categorias/:id` | Update category | Admin |
| DELETE | `/categorias/:id` | Delete category | Admin |

### Productos

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/productos` | List products with filters | Public |
| GET | `/productos/:id` | Get product with reviews and images | Public |
| POST | `/productos` | Create product | Admin |
| PUT | `/productos/:id` | Update product | Admin |
| DELETE | `/productos/:id` | Deactivate product | Admin |

Available query parameters for `GET /productos`:

| Parameter | Type | Description |
|---|---|---|
| `nombre` | string | Partial name search |
| `categoriaId` | number | Filter by category |
| `precioMin` | number | Minimum price |
| `precioMax` | number | Maximum price |
| `talla` | string | XS, S, M, L, XL or XXL |
| `color` | string | Partial color search |
| `pagina` | number | Page number, default 1 |
| `limite` | number | Results per page, default 12 |

### Carrito

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/carrito` | View cart with calculated total | User |
| POST | `/carrito` | Add product to cart | User |
| PUT | `/carrito/:id` | Update item quantity | User |
| DELETE | `/carrito/:id` | Remove item from cart | User |
| DELETE | `/carrito` | Clear entire cart | User |

### Pedidos

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/pedidos` | Create order from cart | User |
| GET | `/pedidos/mis-pedidos` | View my orders | User |
| GET | `/pedidos/:id` | View order detail | User or Admin |
| GET | `/pedidos` | List all orders | Admin |
| PUT | `/pedidos/:id/estado` | Update order status | Admin |

### Descuentos

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/descuentos/validar` | Validate discount code | User |
| GET | `/descuentos` | List all discounts | Admin |
| GET | `/descuentos/:id` | Get discount | Admin |
| POST | `/descuentos` | Create discount | Admin |
| PUT | `/descuentos/:id` | Update discount | Admin |
| DELETE | `/descuentos/:id` | Delete discount | Admin |

### Resenas

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/resenas/producto/:id` | Get product reviews | Public |
| POST | `/resenas` | Create review | User (must have purchased) |
| PUT | `/resenas/:id` | Edit review | Review author |
| DELETE | `/resenas/:id` | Delete review | Author or Admin |

### Usuarios

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/usuarios/me` | View my profile | User |
| PUT | `/usuarios/me` | Update my data | User |
| PUT | `/usuarios/me/password` | Change password | User |
| GET | `/usuarios` | List all users | Admin |
| GET | `/usuarios/:id` | View user with order history | Admin |

### Producto Imagenes

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/producto-imagen/producto/:id` | Get product images | Public |
| POST | `/producto-imagen` | Add image to product | Admin |
| PUT | `/producto-imagen/:id` | Update image | Admin |
| DELETE | `/producto-imagen/:id` | Delete image | Admin |

---

## Authentication

The API uses JSON Web Tokens with a 7-day expiration. The token payload contains the user `id`, `email` and `rol`. Include it in requests via the HTTP header:

```
Authorization: Bearer <token>
```

### Roles

| Role | Description |
|---|---|
| `cliente` | Can purchase, manage cart, view own orders and review purchased products |
| `administrador` | Full access to catalog management, orders, discounts and users |

All registered users receive the `cliente` role by default. The `administrador` role must be assigned manually in the database.

### Guards

`JwtAuthGuard` verifies the token is valid and not expired. Applied at controller or method level.

`RolesGuard` verifies the user has the role required by the `@Roles()` decorator. Always used together with `JwtAuthGuard` since it depends on `req.user` being available.

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('administrador')
@Post()
create(@Body() dto: CreateCategoriaDto) {}
```

---

## Data Validation

All endpoints that receive data use DTOs validated with `class-validator`. The global `ValidationPipe` configured in `main.ts` enables the following options:

| Option | Effect |
|---|---|
| `whitelist: true` | Automatically strips fields not declared in the DTO |
| `forbidNonWhitelisted: true` | Returns 400 Bad Request if undeclared fields are received |
| `transform: true` | Automatically converts received data to the DTO types |

---

## API Documentation

Interactive Swagger documentation for all endpoints is available at:

```
https://api.urbanwear.es/api
```

To test protected endpoints from Swagger:

1. Call `POST /auth/login` and copy the `access_token` from the response
2. Click the `Authorize` button in the top right corner
3. Enter the token and confirm
4. All subsequent protected requests will include the token automatically

---

## Deployment

The API is deployed on a Linux VPS (Ubuntu 22.04 LTS) running NestJS via PM2 with NGINX as a reverse proxy and Let's Encrypt for SSL.

### Server stack

```
Internet
    |
    v
NGINX (reverse proxy, SSL termination)
    |
    v
PM2 (process manager, keeps NestJS alive)
    |
    v
NestJS API (port 3000, internal)
    |
    v
MySQL 8.0 (port 3306, internal only)
```

### Deployment steps

```bash
# 1. Clone repository on the VPS
git clone https://github.com/dic354/urbanwear-backend.git
cd urbanwear-backend

# 2. Install dependencies
npm install

# 3. Set environment variables on the server
export DATABASE_URL="mysql://user:pass@localhost:3306/urbanwear"
export JWT_SECRET="your-production-secret"

# 4. Push schema to production database
npx prisma db push
npx prisma generate

# 5. Build for production
npm run build

# 6. Start with PM2
pm2 start dist/main.js --name urbanwear-api
pm2 save
pm2 startup
```

## Docker

The `docker-compose.yml` file is used for local development only and defines the following services:

| Service | Image | Port | Description |
|---|---|---|---|
| mysql | mysql:8.0 | 3306 | Main database |
| phpmyadmin | phpmyadmin/phpmyadmin | 8080 | Visual database administration |

```bash
# Start containers
docker compose up -d

# Stop containers
docker compose down

# Check container status
docker ps

# View service logs
docker compose logs mysql
```

---

## Project Structure

```
urbanwear-backend/
|-- prisma/
|   `-- schema.prisma
|-- src/
|   |-- auth/
|   |   |-- dto/
|   |   |   |-- register.dto.ts
|   |   |   `-- login.dto.ts
|   |   |-- auth.controller.ts
|   |   |-- auth.module.ts
|   |   |-- auth.service.ts
|   |   |-- jwt-auth.guard.ts
|   |   `-- jwt.strategy.ts
|   |-- categorias/
|   |   |-- dto/
|   |   |-- categorias.controller.ts
|   |   |-- categorias.module.ts
|   |   `-- categorias.service.ts
|   |-- carrito/
|   |   |-- dto/
|   |   |-- carrito.controller.ts
|   |   |-- carrito.module.ts
|   |   `-- carrito.service.ts
|   |-- common/
|   |   |-- roles.decorator.ts
|   |   `-- roles.guard.ts
|   |-- descuentos/
|   |   |-- dto/
|   |   |-- descuentos.controller.ts
|   |   |-- descuentos.module.ts
|   |   `-- descuentos.service.ts
|   |-- pedidos/
|   |   |-- dto/
|   |   |-- pedidos.controller.ts
|   |   |-- pedidos.module.ts
|   |   `-- pedidos.service.ts
|   |-- prisma/
|   |   |-- prisma.module.ts
|   |   `-- prisma.service.ts
|   |-- producto-imagen/
|   |   |-- dto/
|   |   |-- producto-imagen.controller.ts
|   |   |-- producto-imagen.module.ts
|   |   `-- producto-imagen.service.ts
|   |-- productos/
|   |   |-- dto/
|   |   |-- productos.controller.ts
|   |   |-- productos.module.ts
|   |   `-- productos.service.ts
|   |-- resenas/
|   |   |-- dto/
|   |   |-- resenas.controller.ts
|   |   |-- resenas.module.ts
|   |   `-- resenas.service.ts
|   |-- usuarios/
|   |   |-- dto/
|   |   |-- usuarios.controller.ts
|   |   |-- usuarios.module.ts
|   |   `-- usuarios.service.ts
|   |-- app.module.ts
|   `-- main.ts
|-- docker-compose.yml
|-- tsconfig.json
|-- nest-cli.json
|-- package.json
`-- .env.example
```

---

## Author

David Iguino Cortes and Jesus Gonzalvez Garcia   
Almeria, Spain, 2026
