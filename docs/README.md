# Advanced Backend Project Submission with Node.js

`>` **KeepCoding Projects - Web 18:** 📁 [repos-kc-web-18.md](https://github.com/pablo-sch/pablo-sch/blob/main/docs/repos-kc-web-18.md)

`>` **Select your Language:** [Spanish](README.es.md) 🔄 [German](README.de.md)

<!-- ------------------------------------------------------------------------------------------- -->

## Project Objective

In order to practice and demonstrate the knowledge acquired in the virtual classes, this project aims to deepen the capabilities of the previously completed project [keepcoding-04-node-backend](https://github.com/pablo-sch/keepcoding-04-node-backend.git). This time, features such as internationalization, product creation with image upload, and integration of a REST API will be included. Additionally, as a complementary goal, a service for generating thumbnails in the background will be implemented.

<!-- ------------------------------------------------------------------------------------------- -->

## Knowledge Learned and Applied

1. Tools and Development

   - Using the debugger in VSCode and IDE environments.
   - Managing clusters in Node.js.

2. File Upload

   - Handling images with `multer`.

3. Internationalization (i18n)

   - Detecting language from the `Accept-Language` header.
   - Default language and optional geolocation.
   - Using the `i18n-node` library.

4. REST API

   - HTTP methods: GET, POST, PUT, DELETE, PATCH.
   - Responses and errors in JSON format.
   - Documentation with Swagger/OpenAPI.
   - Authentication with API Key and JWT.
   - Idempotent practices and secure structure.

5. Background Tasks

   - Sending and scheduling emails.
   - Using queues (RabbitMQ) for background tasks.

6. WebSockets

   - Real-time communication.

7. Microservices

   - Comparison with monoliths.
   - API Gateway and JWT for microservices.
   - Event-based architecture.

8. Security and Architecture

   - HTTPS configuration locally.

9. Best Practices

   - API design and Node.js development.
   - TDD approach (Test-Driven Development).

<!-- ------------------------------------------------------------------------------------------- -->

## Project Details

1. Internationalization

   - Convert the Nodepop web to multi-language (Spanish and English).
   - Language selector to switch between both.
   - API does not require internationalization.

2. Product Creation with Image

   - Add a link and page to create products with a form that allows image upload.
   - The image must be saved and associated with the product.

3. REST API

   - Key endpoints:
     - POST /api/login (login and JWT)
     - GET /api/products (list with filters, pagination, and authenticated user)
     - GET /api/products/{id} (specific product)
     - POST /api/products (create product with image)
     - PUT /api/products/{id} (update)
     - DELETE /api/products/{id} (delete)
   - Minimum documentation in README (optional Swagger).
   - Default users: `admin@example.com` and `user1@example.com` (password: 1234).

4. Optional Goals

   - Background service to create 100x100 thumbnails with cote.js or RabbitMQ.
   - Create and publish a useful npm module and add the URL in the README.

<!-- ------------------------------------------------------------------------------------------- -->

## Technologies Used

- **Languages:** EJS, CSS, JavaScript.
- **Key Dependencies (Node.js):** swagger, express, socket.io, ejs, http-errors, basic-auth, i18n, cookie-parser, nodemon.
- **Framework:** Bootstrap.

<!-- ------------------------------------------------------------------------------------------- -->

## Installation and Usage Instructions

### 1. Software Requirements

- **[Git](https://git-scm.com/downloads)** (tested on version **2.47.1.windows.1**)
- **[Visual Studio Code](https://code.visualstudio.com/)** (tested on version **1.99.0**)
- **[MongoDB](https://www.mongodb.com/try/download/community)** (tested on version **8.0.5**)
- **[NoSQLBooster for MongoDB](https://nosqlbooster.com/downloads)** (tested on version **9.1.5**)

### 2. Clone the Repository

Clone the repository from:

```bash
https://github.com/pablo-sch/keepcoding-10-advanced-node-backend.git

```

`>` **See Cloning Demo in VSCode:** 🎥 [Gif Demo](https://github.com/pablo-sch/pablo-sch/blob/main/etc/clone-tutorial.gif)

### 3. Steps to Use This Project

Make sure MongoDB is running and you have cloned the repository locally. Then, follow these steps:

1. Install the project dependencies:

   ```sh
   npm install
   ```

2. Initializes the database (only necessary for the first deployment).

   - Two Users will be created by which you will be able to log in:

     - `admin@example.com`, password 1234 (will own no posts).
     - `user1@example.com`, password 1234 (will own six posts).

   ```sh
   npm run initDB
   ```

3. Copy the environment variables file (Windows, Linux and Mac):

   ```sh
   cp .env.example .env
   ```

4. Run the project in development mode:

   ```sh
   npm run dev
   ```

<!-- ------------------------------------------------------------------------------------------- -->

## Project Resources

`>` **API Documentation:** 📄 [Documentation](api-doc.md)

`>` **Project Preview:** 👀 [Preview](preview.md)

<!-- ------------------------------------------------------------------------------------------- -->

## Contributions and Licenses

This project has no external contributions or licenses.
