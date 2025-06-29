# Abgabe des Fortgeschrittenen Backend-Projekts mit Node.js

`>` **KeepCoding Projekte - Web 18:** 📁 [repos-kc-web-18.md](https://github.com/pablo-sch/pablo-sch/blob/main/docs/repos-kc-web-18.md)

`>` **Wähle deine Sprache:** [Englisch](README.md) 🔄 [Spanish](README.es.md)

<!-- ------------------------------------------------------------------------------------------- -->

## Projektziel

Um die in den Online-Kursen erworbenen Kenntnisse zu üben und zu demonstrieren, zielt dieses Projekt darauf ab, die Fähigkeiten des zuvor erstellten Projekts [keepcoding-04-node-backend](https://github.com/pablo-sch/keepcoding-04-node-backend.git) zu vertiefen. Diesmal werden Funktionen wie Internationalisierung, Produkterstellung mit Bild-Upload und die Integration einer REST-API hinzugefügt. Außerdem wird ergänzend ein Service zur Erstellung von Miniaturbildern (Thumbnails) im Hintergrund implementiert.

<!-- ------------------------------------------------------------------------------------------- -->

## Erlernte und angewandte Kenntnisse

1. Werkzeuge und Entwicklung

   - Nutzung des Debuggers in VSCode und IDE-Umgebungen.
   - Verwaltung von Clustern in Node.js.

2. Dateiupload

   - Umgang mit Bildern mittels `multer`.

3. Internationalisierung (i18n)

   - Erkennung der Sprache über den `Accept-Language` Header.
   - Standardsprache und optionale Geolokalisierung.
   - Verwendung der Bibliothek `i18n-node`.

4. REST API

   - HTTP-Methoden: GET, POST, PUT, DELETE, PATCH.
   - Antworten und Fehler im JSON-Format.
   - Dokumentation mit Swagger/OpenAPI.
   - Authentifizierung mit API Key und JWT.
   - Idempotente Praktiken und sichere Struktur.

5. Hintergrundaufgaben

   - Versand und Planung von E-Mails.
   - Nutzung von Warteschlangen (RabbitMQ) für Hintergrundaufgaben.

6. WebSockets

   - Echtzeit-Kommunikation.

7. Microservices

   - Vergleich mit Monolithen.
   - API Gateway und JWT für Microservices.
   - Ereignisbasierte Architektur.

8. Sicherheit und Architektur

   - HTTPS-Konfiguration lokal.

9. Best Practices

   - API-Design und Node.js-Entwicklung.
   - TDD-Ansatz (Testgetriebene Entwicklung).

<!-- ------------------------------------------------------------------------------------------- -->

## Projektdetails

1. Internationalisierung

   - Die Nodepop-Webseite wird mehrsprachig (Spanisch und Englisch).
   - Sprachwahlschalter zum Wechsel zwischen beiden.
   - Die API muss nicht internationalisiert werden.

2. Produkterstellung mit Bild

   - Link und Seite hinzufügen, um Produkte mit Formular und Bild-Upload zu erstellen.
   - Das Bild muss gespeichert und dem Produkt zugeordnet werden.

3. REST API

   - Wichtige Endpunkte:
     - POST /api/login (Login und JWT)
     - GET /api/products (Liste mit Filtern, Paginierung und authentifiziertem Nutzer)
     - GET /api/products/{id} (bestimmtes Produkt)
     - POST /api/products (Produkt mit Bild erstellen)
     - PUT /api/products/{id} (aktualisieren)
     - DELETE /api/products/{id} (löschen)
   - Minimale Dokumentation im README (Swagger optional).
   - Standardnutzer: `admin@example.com` und `user1@example.com` (Passwort: 1234).

4. Optionale Ziele

   - Hintergrundservice zur Erstellung von 100x100 Thumbnails mit cote.js oder RabbitMQ.
   - Erstellung und Veröffentlichung eines nützlichen npm-Moduls und Eintragung der URL im README.

<!-- ------------------------------------------------------------------------------------------- -->

## Verwendete Technologien

- **Sprachen:** EJS, CSS, JavaScript.
- **Wichtige Abhängigkeiten (Node.js):** swagger, express, socket.io, ejs, http-errors, basic-auth, i18n, cookie-parser, nodemon.
- **Framework:** Bootstrap.

<!-- ------------------------------------------------------------------------------------------- -->

## Installations- und Nutzungshinweise

### 1. Softwareanforderungen

- **[Git](https://git-scm.com/downloads)** (getestet mit Version **2.47.1.windows.1**)
- **[Visual Studio Code](https://code.visualstudio.com/)** (getestet mit Version **1.99.0**)
- **[MongoDB](https://www.mongodb.com/try/download/community)** (getestet mit Version **8.0.5**)
- **[NoSQLBooster for MongoDB](https://nosqlbooster.com/downloads)** (getestet mit Version **9.1.5**)

### 2. Repository klonen

Klonen Sie das Repository von:

```bash
https://github.com/pablo-sch/keepcoding-10-advanced-node-backend.git
```

`>` **Demo zum Klonen in VSCode:** 🎥 [Gif Demo](https://github.com/pablo-sch/pablo-sch/blob/main/etc/clone-tutorial.gif)

### 3. Schritte zur Nutzung des Projekts

Stellen Sie sicher, dass MongoDB läuft und Sie das Repository lokal geklont haben. Folgen Sie dann diesen Schritten:

1. Installieren Sie die Projektabhängigkeiten:

   ```sh
   npm install
   ```

2. Initialisieren Sie die Datenbank (nur bei der ersten Bereitstellung erforderlich):
   Es werden zwei Benutzer angelegt, mit denen Sie sich anmelden können:

   - `admin@example.com`, Passwort 1234 (wird keine Beiträge haben).
   - `user1@example.com`, Passwort 1234 (wird sechs Beiträge haben).

   ```sh
   npm run initDB
   ```

3. Kopieren Sie die Datei mit den Umgebungsvariablen (Windows, Linux und Mac):

   ```sh
   cp .env.example .env
   ```

4. Führen Sie das Projekt im Entwicklungsmodus aus:

   ```sh
   npm run dev
   ```

   <!-- ------------------------------------------------------------------------------------------- -->

## Projektressourcen

`>` **API-Dokumentation:** 📄 [Dokumentation](api-doc.md)

`>` **Projektvorschau:** 👀 [Vorschau](preview.md)

<!-- ------------------------------------------------------------------------------------------- -->

## Beiträge und Lizenzen

Dieses Projekt hat keine externen Beiträge oder Lizenzen.
