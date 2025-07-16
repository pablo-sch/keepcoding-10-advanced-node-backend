# Entrega Proyecto de Backend Avanzado con Node.js

`>` **Proyectos KeepCoding - Web 18:** 📁 [repos-kc-web-18.md](https://github.com/pablo-sch/pablo-sch/blob/main/docs/repos-kc-web-18.md)

`>` **Selecciona tu Idioma:** [Inglés](README.md) 🔄 [Alemán](README.de.md)

<!-- ------------------------------------------------------------------------------------------- -->

## Objetivo del Proyecto

Con el fin de ejercitar y demostrar los conocimientos adquiridos en las clases virtuales, este proyecto tiene como objetivo profundizar en las capacidades del proyecto previamente realizado [keepcoding-04-node-backend](https://github.com/pablo-sch/keepcoding-04-node-backend.git). En esta ocasión, se incorporarán funcionalidades como la internacionalización, la creación de un producto con imagen y la integración de una API REST. Además, como objetivo complementario, se implementará un servicio para la generación de miniaturas (thumbnails) en segundo plano.

<!-- ------------------------------------------------------------------------------------------- -->

## Conocimientos Aprendidos y Trabajados

1. Herramientas y Desarrollo

   - Uso del debugger en VSCode y entornos IDE.
   - Comandos personalizados con NPM.
   - Manejo de clústeres en Node.js.

2. Subida de Archivos

   - Gestión de imágenes con `multer`.

3. Internacionalización (i18n)

   - Detección del idioma desde la cabecera `Accept-Language`.
   - Idioma por defecto y geolocalización opcional.
   - Uso de la librería `i18n-node`.

4. API REST

   - Métodos HTTP: GET, POST, PUT, DELETE, PATCH.
   - Respuestas y errores en formato JSON.
   - Documentación con Swagger/OpenAPI.
   - Autenticación con API Key y JWT.
   - Prácticas idempotentes y estructura segura.

5. Tareas en Segundo Plano

   - Envío y programación de correos.
   - Uso de colas (RabbitMQ) para tareas en background.

6. WebSockets

   - Comunicación en tiempo real.

7. Microservicios

   - Comparativa con monolitos.
   - API Gateway y JWT para microservicios.
   - Arquitectura basada en eventos.

8. Seguridad y Arquitectura

   - Configuración de HTTPS en local.

9. Buenas Prácticas

   - Diseño de APIs y desarrollo en Node.js.
   - Enfoque TDD (Test-Driven Development).

<!-- ------------------------------------------------------------------------------------------- -->

## Detalles del Proyecto

1. Internacionalización

   - Convertir la web de Nodepop en multi-idioma (español e inglés).
   - Selector de idioma para cambiar entre ambos.
   - No es necesario internacionalizar la API.

2. Creación de Producto con Imagen

   - Añadir enlace y página para crear productos con formulario que permita subir imagen.
   - La imagen debe guardarse y asociarse al producto.

3. API REST

   - Endpoints clave:
   - POST /api/login (login y JWT)
   - GET /api/products (lista con filtros, paginación y usuario autenticado)
   - GET /api/products/{id} (producto específico)
   - POST /api/products (crear producto con imagen)
   - PUT /api/products/{id} (actualizar)
   - DELETE /api/products/{id} (eliminar)
   - Documentación mínima en README (opcional Swagger).
   - Usuarios por defecto: `admin@example.com` y `user1@example.com` (clave: 1234).

4. Objetivos Opcionales

   - Servicio en segundo plano para crear thumbnails 100x100 con cote.js o RabbitMQ.
   - Crear y publicar un módulo npm útil y agregar la URL en el README.

<!-- ------------------------------------------------------------------------------------------- -->

## Tecnologías Utilizadas

- **Lenguajes:** EJS, CSS, JavaScript.
- **Dependencias a destacar (Node.js):** swagger, express, socket.io, ejs, http-errors, basic-auth, i18n, cookie-parser, nodemon.
- **Framework:** Bootstrap.

<!-- ------------------------------------------------------------------------------------------- -->

## Instrucciones de Instalación y Uso

### 1. Requisitos de Software

- **[Node.js](https://nodejs.org/en/download/)** (testeado en la versión **v22.15.1**)
- **[Git](https://git-scm.com/downloads)** (testeado en la versión **2.47.1.windows.1**)
- **[Visual Studio Code](https://code.visualstudio.com/)** (testeado en la versión **1.99.0**)
- **[MongoDB](https://www.mongodb.com/try/download/community)** (probado en la versión **8.0.5**)
- **[NoSQLBooster for MongoDB](https://nosqlbooster.com/downloads)** (probado en la versión **9.1.5**)

### 2. Clonación del Repositorio

```bash
git clone https://github.com/pablo-sch/keepcoding-10-advanced-node-backend.git
```

`>` **Ver Demo de Clonanción en VSCode:** 🎥 [Gif Demo](https://github.com/pablo-sch/pablo-sch/blob/main/etc/clone-tutorial.gif)

### 3. Comandos

Asegúrate de tener MongoDB en funcionamiento y haber clonado el repositorio en tu dispositivo local.
Luego, sigue estos pasos:

```sh
# Instala las dependencias del proyecto.
npm install

# Inicializa la base de datos (solo necesario en el primer despliegue).
npm run initDB

# Copia el archivo de variables de entorno (Windows, Linux y Mac).
cp .env.example .env

# Ejecuta el proyecto en modo desarrollo.
npm run dev
```

**Nota:** Se crearan dos Usuarios por el cual podras iniciar sesión:

- `admin@example.com`, clave 1234 (no poseerá ningún post).
- `user1@example.com`, clave 1234 (poseerá seis posts).

<!-- ------------------------------------------------------------------------------------------- -->

## Recursos del Proyecto

`>` **Documentación de la API:** 📄 [Documentación](api-doc.md)

`>` **Vista Previa del Proyecto:** 👀 [Vista Previa](preview.md)

<!-- ------------------------------------------------------------------------------------------- -->

## Contribuciones y Licencias

Proyecto bajo licencia MIT. Uso y distribución libres con atribución. No se aceptan contribuciones externas, pero las sugerencias son bienvenidas.
