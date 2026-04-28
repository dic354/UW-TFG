# UrbanWear Backend - API REST para E-commerce de Moda Urbana

API RESTful construida con NestJS para una plataforma de e-commerce. Implementa una arquitectura modular que proporciona servicios robustos para gestión de productos, carritos de compra, procesamiento de pedidos y autenticación de usuarios. [1](#0-0) 

## 🛠 Stack Tecnológico

- **Framework**: [NestJS](https://nestjs.com/) (v11.0.1) - Framework progresivo Node.js para aplicaciones servidor eficientes y escalables [2](#0-1) 
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) - Seguridad de tipos en toda la capa de dominio [3](#0-2) 
- **ORM**: [Prisma](https://www.prisma.io/) (v6.19.3) - Acceso a base de datos con seguridad de tipos y gestión de esquemas [4](#0-3) 
- **Autenticación**: [Passport.js](https://www.passportjs.org/) con JWT (JSON Web Tokens) [5](#0-4) 
- **Documentación**: [Swagger (OpenAPI)](https://swagger.io/) - Documentación interactiva disponible en `/api` [6](#0-5) 

## 🏗 Arquitectura del Sistema

UrbanWear sigue un enfoque modular donde cada dominio de negocio está encapsulado en su propio módulo NestJS. Todos los módulos se agregan en el `AppModule`. [7](#0-6) 

### Módulos Principales

```mermaid
graph TD
    subgraph "Infraestructura Core"
        ["PrismaModule"]
        ["AuthModule"]
    end

    subgraph "Catálogo de Productos"
        ["CategoriasModule"]
        ["ProductosModule"]
        ["ProductoImagenModule"]
    end

    subgraph "Ventas y Logística"
        ["CarritoModule"]
        ["PedidosModule"]
        ["DescuentosModule"]
    end

    subgraph "Experiencia de Usuario"
        ["UsuariosModule"]
        ["ResenasModule"]
    end

    ["AppModule"] --> ["PrismaModule"]
    ["AppModule"] --> ["AuthModule"]
    ["AppModule"] --> ["CategoriasModule"]
    ["AppModule"] --> ["ProductosModule"]
    ["AppModule"] --> ["CarritoModule"]
    ["AppModule"] --> ["PedidosModule"]
    ["AppModule"] --> ["DescuentosModule"]
    ["AppModule"] --> ["ResenasModule"]
    ["AppModule"] --> ["UsuariosModule"]
    ["AppModule"] --> ["ProductoImagenModule"]
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (v18 o superior)
- npm o yarn
- Base de datos (PostgreSQL recomendado)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/dic354/UW-backend.git
   cd UW-backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   Configurar las siguientes variables:
   - `DATABASE_URL`: URL de conexión a la base de datos
   - `JWT_SECRET`: Secreto para firmar tokens JWT

4. **Generar cliente Prisma**
   ```bash
   npx prisma generate
   ```

5. **Ejecutar migraciones de base de datos**
   ```bash
   npx prisma migrate dev
   ```

## 🏃‍♂️ Ejecución de la Aplicación

### Desarrollo

```bash
# Modo desarrollo con recarga automática
npm run start:dev
```

### Producción

```bash
# Compilar para producción
npm run build

# Ejecutar en modo producción
npm run start:prod
```

### Testing

```bash
# Ejecutar pruebas unitarias
npm run test

# Ejecutar pruebas e2e
npm run test:e2e

# Generar reporte de cobertura
npm run test:cov
``` [8](#0-7) 

## 📚 Documentación API

La API cuenta con documentación interactiva mediante Swagger/OpenAPI:

- **URL**: `http://localhost:3000/api`
- **Autenticación**: Se requiere token JWT (obtenido en `/auth/login`) [9](#0-8) 

### Endpoints Principales

| Módulo | Endpoints | Descripción |
|--------|-----------|-------------|
| **Autenticación** | `/auth/login`, `/auth/register` | Gestión de usuarios y tokens JWT |
| **Usuarios** | `/usuarios/me`, `/usuarios/me/password` | Perfil y gestión de cuenta |
| **Productos** | `/productos`, `/productos/:id` | Catálogo con filtros avanzados |
| **Categorías** | `/categorias`, `/categorias/:id` | Gestión de categorías |
| **Carrito** | `/carrito`, `/carrito/add` | Gestión del carrito de compras |
| **Pedidos** | `/pedidos`, `/pedidos/:id` | Procesamiento de órdenes |
| **Descuentos** | `/descuentos/validar`, `/descuentos` | Códigos de descuento |

## 🔐 Flujo de Autenticación

La API utiliza una combinación de Guards y Strategies para asegurar los endpoints:

```mermaid
sequenceDiagram
    participant Client
    participant "main.ts (ValidationPipe)" as VP
    participant "AuthGuard (JWT)" as AG
    participant "RolesGuard" as RG
    participant "Controller" as CTRL
    participant "PrismaService" as DB

    Client->>VP: HTTP Request (JSON Payload)
    VP->>VP: Validate DTOs
    VP->>AG: Pass validated data
    AG->>AG: Verify JWT Token
    AG->>RG: Check User Role
    RG->>CTRL: Execute Handler
    CTRL->>DB: Query Database
    DB-->>CTRL: Return Model
    CTRL-->>Client: HTTP Response
``` [10](#0-9) 

## 📁 Estructura del Proyecto

```
src/
├── app.module.ts          # Módulo raíz
├── main.ts                # Punto de entrada
├── auth/                  # Módulo de autenticación
├── usuarios/              # Gestión de usuarios
├── productos/             # Catálogo de productos
├── categorias/            # Gestión de categorías
├── carrito/               # Carrito de compras
├── pedidos/               # Procesamiento de pedidos
├── descuentos/            # Sistema de descuentos
├── producto-imagen/       # Gestión de imágenes
├── resenas/               # Sistema de reseñas
├── common/                # Utilidades compartidas
└── prisma/                # Configuración de Prisma
```

## 🔧 Configuración Global

La aplicación configura pipes globales de validación usando `ValidationPipe`, asegurando que los payloads entrantes coincidan con los DTOs definidos. [10](#0-9) 

## 📝 Licencia

Este proyecto es privado y no está licenciado para distribución pública. [11](#0-10) 

---

## Notas

- El README actual muestra un conflicto de merge entre la plantilla estándar de NestJS y el contenido personalizado del proyecto [12](#0-11) 
- La configuración de Swagger incluye autenticación Bearer JWT con persistencia de autorización [13](#0-12) 
- Todos los módulos siguen el patrón estándar de NestJS con Controller, Service y DTOs correspondientes

Wiki pages you might want to explore:
- [UrbanWear Backend — Overview (dic354/UW-backend)](/wiki/dic354/UW-backend#1)
- [Users Service & Controller (dic354/UW-backend)](/wiki/dic354/UW-backend#5.1)

### Citations

**File:** src/main.ts (L10-14)
```typescript
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
```

**File:** src/main.ts (L17-20)
```typescript
  const config = new DocumentBuilder()
    .setTitle('UrbanWear API')
    .setDescription('API REST para la tienda online de moda urbana UrbanWear')
    .setVersion('1.0')
```

**File:** src/main.ts (L21-30)
```typescript
    .addBearerAuth(
      {
        // Configuración del token JWT en Swagger
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Introduce el token JWT obtenido en /auth/login',
      },
      'JWT', // Nombre del esquema de seguridad
    )
```

**File:** src/main.ts (L34-43)
```typescript
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Mantiene el token al recargar
    },
  });

  await app.listen(3000);

  console.log('Servidor corriendo en: http://localhost:3000');
  console.log('Documentación Swagger: http://localhost:3000/api');
```

**File:** package.json (L7-7)
```json
  "license": "UNLICENSED",
```

**File:** package.json (L8-21)
```json
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
```

**File:** package.json (L23-24)
```json
    "@nestjs/common": "^11.0.1",
    "@nestjs/core": "^11.0.1",
```

**File:** package.json (L25-36)
```json
    "@nestjs/jwt": "^11.0.2",
    "@nestjs/passport": "^11.0.5",
    "@nestjs/platform-express": "^11.0.1",
    "@nestjs/swagger": "^11.4.2",
    "@prisma/client": "^6.19.3",
    "bcrypt": "^6.0.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.15.1",
    "dotenv": "^17.4.2",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "prisma": "^6.19.3",
```

**File:** package.json (L65-65)
```json
    "typescript": "^5.9.3",
```

**File:** README.md (L1-103)
```markdown
<<<<<<< HEAD
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
=======
# UW-TFG
Repositorio para el desarrollo de un ecommerce con IA integrada
>>>>>>> 45464941f9ed451b7449e65d11dff230a48b4aa7
```
