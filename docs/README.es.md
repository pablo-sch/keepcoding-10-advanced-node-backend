# Entrega Proyecto de Desarrollo Frontend con JavaScript

**Proyectos KeepCoding - Web 18**  
Consulta la lista completa de repositorios y descripciones en 📁 [repos-kc-web-18.md](https://github.com/pablo-sch/pablo-sch/blob/main/docs/repos-kc-web-18.md)

## Selecciona tu Idioma

- 🇺🇸 [Inglés](README.md)
- 🇩🇪 [Alemán](README.de.md)

<!-- ------------------------------------------------------------------------------------------- -->

## Objetivo del Proyecto

Con el fin de ejercitar y demostrar los conocimientos adquiridos en las clases virtuales, este proyecto tiene como objetivo profundizar en las capacidades del proyecto previamente realizado [keepcoding-05-frontend-javascript](https://github.com/pablo-sch/keepcoding-04-node-backend.git). En esta ocasión, se incorporarán funcionalidades como la internacionalización, la creación de un producto con imagen y la integración de una API REST. Además, como objetivo complementario, se implementará un servicio para la generación de miniaturas (thumbnails) en segundo plano.

<!-- ------------------------------------------------------------------------------------------- -->

## Conocimientos Aprendidos y Trabajados

- Herramientas y desarrollo

  - Utilización del Debugger de VSCode
  - Debugging en entornos IDE
  - Comandos personalizados en NPM (definidos en package.json, sección scripts)
  - Cluster en Node.js

- Subida de archivos

  - Subida de imágenes utilizando multer

- Internacionalización y localización

  - Lectura del idioma preferido desde la cabecera “Accept-Language” en peticiones HTTP
  - Si no se envía esta cabecera, devolver el idioma por defecto
  - Alternativas como la geolocalización por IP (por ejemplo, si la IP es de España, redirigir al sitio en español)
  - La librería i18n-node gestiona esto automáticamente

- API

  - Documentación de API

    - Swagger
      - Especificación, editor y visor de documentación
    - OpenAPI en Express
      - Generación de especificación desde código o archivos YAML

  - Métodos HTTP

    - GET: obtener datos. Es idempotente (ej. listas)
    - POST: crear un recurso (ej. un usuario)
    - PUT: actualizar un recurso. Es idempotente (ej. actualizar un usuario)
    - DELETE: eliminar un recurso. Es idempotente (ej. borrar un usuario)
    - PATCH: actualización parcial de un recurso  
      _Idempotente: si se ejecuta varias veces, el resultado no cambia_

  - Formato de respuesta

    - Las respuestas deben ir en formato JSON
    - Los errores también deben devolverse en formato JSON

  - Autenticación

    - API Key
      - Se envía en todas las peticiones como cabecera o parámetro GET
      - Se proporciona tras el registro del usuario
      - Es única, identifica al usuario y no cambia
    - Tokens JWT (JSON Web Tokens)
      - Estructura de un JWT
      - Ventajas de utilizar JWT

  - Tareas en segundo plano

    - Flujo básico de una petición HTTP
    - Envío de correos desde el back-end
    - Envío programado de correos
    - Envío de correos con tareas en background
    - Tareas en background con RabbitMQ
    - Otros motores para tareas en background

  - WebSockets

- Microservicios

  - Diferencias con una aplicación monolítica
  - Pros y contras de los microservicios
  - Del monolito a los microservicios
  - Cliente-servidor con monolito
  - Conexión directa a microservicios con JWT
  - API Gateway
  - Arquitectura basada en eventos
  - Enfoque Monolith First

- Seguridad y arquitectura

  - HTTPS en entorno local

- Buenas prácticas

  - Buenas prácticas en Node.js
  - Buenas prácticas en diseño de APIs

- Desarrollo guiado por pruebas
  - ¿Qué es TDD? (Test-Driven Development)

<!-- ------------------------------------------------------------------------------------------- -->

## Detalles del Proyecto

### 1. Internacionalización

- El objetivo de este reto es convertir el sitio web de la aplicación Nodepop en multi-idioma.
- Idiomas disponibles:
  - **Español**
  - **Inglés**
- No es necesario internacionalizar el API.
- Debe existir un selector de idioma que permita al usuario cambiar entre inglés y español.

### 2. Creación de un Producto con Imagen

- El sitio web debe incluir:
  - Un enlace en el menú para acceder a la pantalla de creación de productos.
  - Una página para crear productos, que permita subir una imagen.
- Al crear un producto, se debe permitir adjuntar una imagen desde el formulario.

### 3. API REST

- Se debe desarrollar una API con los siguientes _endpoints_:
  - **POST /api/login**: Permite iniciar sesión y retorna un JWT.
  - **GET /api/products**: Devuelve una lista de productos con filtros (por nombre, etc.), paginación, ordenación y selección de campos. Solo devuelve productos del usuario autenticado.
  - **GET /api/products/{productID}**: Devuelve un producto específico.
  - **POST /api/products**: Crea un producto, incluyendo subida de imagen.
  - **PUT /api/products/{productID}>**: Actualiza un producto existente.
  - **DELETE /api/products/{productID}**: Elimina un producto.
- Documentación mínima del API debe incluirse en el `README.md`. Quien lo desee puede usar Swagger (OpenAPI) en Express.
- El API debe tener al menos dos usuarios por defecto:
  - `admin@example.com`, clave `1234`
  - `user1@example.com`, clave `1234`

### 4. Objetivos Opcionales

- Servicio de Creación de Thumbnails
  - Cada imagen subida debe generar un thumbnail (miniatura) de 100x100 píxeles.
  - Se propone desarrollar un microservicio de generación de thumbnails en segundo plano, utilizando **cote.js** o **RabbitMQ**.
  - Flujo sugerido:
  - Al crear un nuevo producto, se envía un mensaje con la ruta de la imagen.
  - Un _worker_ escucha este mensaje y genera el thumbnail.
  - Se recomienda buscar librerías como **jimp** para realizar el redimensionado.
- Crear un Módulo Público
  - Como reto final crear y publicar un módulo en npm con alguna utilidad que pueda ser de interés personal o general. Por ejemplo: `Dhrase`, `RabinstonWabbit`, `Imandom`, `Frine` o `HipoTalculator`.
  - Se debe colocar la URL del módulo publicado en npm al inicio del `README.md` del repositorio entregado.

<!-- ------------------------------------------------------------------------------------------- -->

## Tecnologías Utilizadas

**Lenguajes:** EJS, CSS, JavaScript.
**Dependencias (Node.js):** swagger, express, socket.io, ejs, http-errors, basic-auth, i18n, cookie-parser, nodemon.
**Framework:** Boostrap.

<!-- ------------------------------------------------------------------------------------------- -->

## Instrucciones de Instalación y Uso

### Requisitos de Software

- **[Git](https://git-scm.com/downloads)** (testeado en la versión **2.47.1.windows.1**)
- **[Visual Studio Code](https://code.visualstudio.com/)** (testeado en la versión **1.99.0**)
- **[MongoDB](https://www.mongodb.com/try/download/community)** (probado en la versión 8.0.5)
- **[NoSQLBooster for MongoDB](https://nosqlbooster.com/downloads)** (probado en la versión 9.1.5)

### Clonación del Repositorio

Poyecto

```bash

git clone https://github.com/pablo-sch/keepcoding-05-frontend-javascript.git
```

Demo

![Demo](https://github.com/pablo-sch/pablo-sch/blob/main/etc/clone-tutorial.gif)

### Pasos Para Utilizar Este Proyecto

Asegúrate de tener MongoDB en funcionamiento y haber clonado el repositorio en tu dispositivo local.
Luego, sigue estos pasos:

1. Instala las dependencias del proyecto:

```sh
npm install
```

2. Inicializa la base de datos (solo necesario en el primer despliegue):

```sh
npm run initDB
```

3. Copia el archivo de variables de entorno:

```sh
cp .env.example .env
```

4. Ejecuta el proyecto en modo desarrollo:

```sh
npm run dev
```

<!-- ------------------------------------------------------------------------------------------- -->

## Documentación de la API

Puedes consultar la documentación completa de la API en el siguiente enlace:

[Documentación API](API-DOC.md)

<!-- ------------------------------------------------------------------------------------------- -->

## Vista Previa del Proyecto

### Home

![Home]()

### Index with No logged User

![Index with No logged User](../etc/preview_images/index.png)

### Login

![Login](../etc/preview_images/login.png)

### Create Account

![Create Account](../etc/preview_images/create-account.png)

### My Posts

![My Posts](../etc/preview_images/my-posts.png)

### Edits my Posts

![Edits my Posts](../etc/preview_images/edit-post.png)

### Swagger API

![Swagger API](../etc/preview_images/swagger.png)

<!-- ------------------------------------------------------------------------------------------- -->

## Contribuciones y Licencias

Este proyecto no cuenta con contribuciones externas ni licencias.
