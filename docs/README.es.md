# Entrega Proyecto de Backend Avanzado con Node.js

**Proyectos KeepCoding - Web 18**  
Consulta la lista completa de repositorios y descripciones en 📁 [repos-kc-web-18.md](https://github.com/pablo-sch/pablo-sch/blob/main/docs/repos-kc-web-18.md)

## Selecciona tu Idioma

- 🇺🇸 [Inglés](README.md)
- 🇩🇪 [Alemán](README.de.md)

<!-- ------------------------------------------------------------------------------------------- -->

## Objetivo del Proyecto

Con el fin de ejercitar y demostrar los conocimientos adquiridos en las clases virtuales, este proyecto tiene como objetivo profundizar en las capacidades del proyecto previamente realizado [keepcoding-04-node-backend](https://github.com/pablo-sch/keepcoding-04-node-backend.git). En esta ocasión, se incorporarán funcionalidades como la internacionalización, la creación de un producto con imagen y la integración de una API REST. Además, como objetivo complementario, se implementará un servicio para la generación de miniaturas (thumbnails) en segundo plano.

<!-- ------------------------------------------------------------------------------------------- -->

## Conocimientos Aprendidos y Trabajados

### Herramientas y Desarrollo

- Uso del debugger en VSCode y entornos IDE.
- Comandos personalizados con NPM.
- Manejo de clústeres en Node.js.

### Subida de Archivos

- Gestión de imágenes con `multer`.

### Internacionalización (i18n)

- Detección del idioma desde la cabecera `Accept-Language`.
- Idioma por defecto y geolocalización opcional.
- Uso de la librería `i18n-node`.

### API REST

- Métodos HTTP: GET, POST, PUT, DELETE, PATCH.
- Respuestas y errores en formato JSON.
- Documentación con Swagger/OpenAPI.
- Autenticación con API Key y JWT.
- Prácticas idempotentes y estructura segura.

### Tareas en Segundo Plano

- Envío y programación de correos.
- Uso de colas (RabbitMQ) para tareas en background.

### WebSockets

- Comunicación en tiempo real.

### Microservicios

- Comparativa con monolitos.
- API Gateway y JWT para microservicios.
- Arquitectura basada en eventos.

### Seguridad y Arquitectura

- Configuración de HTTPS en local.

### Buenas Prácticas

- Diseño de APIs y desarrollo en Node.js.
- Enfoque TDD (Test-Driven Development).

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
  - **PUT /api/products/{productID}**: Actualiza un producto existente.
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
**Dependencias a destacar (Node.js):** swagger, express, socket.io, ejs, http-errors, basic-auth, i18n, cookie-parser, nodemon.
**Framework:** Bootstrap.

<!-- ------------------------------------------------------------------------------------------- -->

## Instrucciones de Instalación y Uso

### Requisitos de Software

- **[Git](https://git-scm.com/downloads)** (testeado en la versión **2.47.1.windows.1**)
- **[Visual Studio Code](https://code.visualstudio.com/)** (testeado en la versión **1.99.0**)
- **[MongoDB](https://www.mongodb.com/try/download/community)** (probado en la versión 8.0.5)
- **[NoSQLBooster for MongoDB](https://nosqlbooster.com/downloads)** (probado en la versión 9.1.5)

### Clonación del Repositorio

Proyecto

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

[Vista Previa del Proyecto](demo.md)

<!-- ------------------------------------------------------------------------------------------- -->

## Contribuciones y Licencias

Este proyecto no cuenta con contribuciones externas ni licencias.
