# API Stexcore Vanilla

This template provides a robust, modular, and scalable foundation for building APIs using Express and TypeScript. It features a clear separation between business logic, infrastructure, and data validation.

---

## Installation and Initial Setup

### 1. Install Dependencies

Install the necessary dependencies by running:

```bash
npm install
```

### 2. Configure the `.env` File

Create a `.env` file at the root of the project with the following basic configuration:

```dotenv
# Server Configuration
APP_PORT=9000
NODE_ENV=development
```

### 3. Available Commands

- **Development Mode:**  
  Run the server in development mode (with auto-restart via `nodemon`):

  ```bash
  npm run dev
  ```

- **Build:**  
  Compile the TypeScript project to JavaScript:

  ```bash
  npm run build
  ```

- **Production:**  
  Run the compiled version of the application:

  ```bash
  npm start
  ```

- **Quick Test:**  
  Start the server with `ts-node` for quick testing:

  ```bash
  npm test
  ```

---

## Project Structure

The template is organized into folders to separate concerns:

```
project-root/
  ├── src/
  │   ├── class/                // Base classes (Piece, Controller, Service)
  │   ├── controllers/          // Endpoint controllers
  │   ├── middlewares/          // Middlewares: validation, error handling, logging, etc.
  │   ├── routers/              // Routes for the endpoints
  │   ├── schemas/              // Request validation schemas
  │   ├── services/             // Services encapsulating business logic
  │   ├── types/                // TypeScript interfaces and types
  │   ├── utils/                // Utilities (e.g., for creating validation middlewares)
  │   ├── server.ts             // Express server configuration: services, middlewares, and routes
  │   └── index.ts              // Application entry point
  ├── .env                      // Environment variables
  └── package.json              // Scripts and dependency definitions
```

---

## Base Classes

### Piece  
*File:* `src/class/piece.ts`  
This is the smallest reusable unit that provides common methods to access services via dependency injection. Use methods such as `getService()`, `service$()`, or the alias `$()` to retrieve instances of other services.

### Controller  
*File:* `src/class/controller.ts`  
Extends `Piece` and acts as the base for all controllers, ensuring uniform access to services and shared methods.

### Service  
*File:* `src/class/service.ts`  
Encapsulates business logic and the lifecycle of services. It allows for optional methods such as `initialize()` and `destroy()` to manage resources.

---

## Controllers

### InfoController  
*File:* `src/controllers/info.controller.ts`  
This controller manages requests to the `/info` endpoint. Its features include:

- **Service Injection:** Uses `this.$(InfoService)` (an alias for `this.getService(InfoService)`) to obtain the corresponding service.
- **Request Handling:** Defines the `GetInformation` method that processes the request, obtains server information via the service, and returns a JSON response.
- **Error Handling:** Uses `next()` to pass errors to the appropriate middleware.

_Example:_
```typescript
import type { RequestHandler } from "express";
import InfoService from "../services/info.service";
import Controller from "../class/controller";

export default class InfoController extends Controller {
  private infoService: InfoService = this.$(InfoService);

  public GetInformation: RequestHandler = (req, res, next) => {
    try {
      const info = this.infoService.GetInformationServer();
      res.json({
        success: true,
        message: "Information successfully retrieved",
        data: info,
      });
    } catch (err) {
      next(err);
    }
  };
}
```

---

## Services

### InfoService  
*File:* `src/services/info.service.ts`  
Provides relevant server information, such as:

- **Metadata:** Reads the `package.json` file to extract the server's name and version.
- **Uptime:** Calculates the process uptime and formats it in a readable way (seconds, minutes, hours, or days).

```typescript
import Service from "../class/service";
import fs from "fs";

export default class InfoService extends Service {
  public GetInformationServer() {
    const data = JSON.parse(fs.readFileSync("package.json").toString());
    return {
      server_name: data.name,
      version: data.version,
      uptime: this.getUptime()
    };
  }

  private getUptime() {
    const uptimeInSeconds = process.uptime();
    if (uptimeInSeconds < 60) {
      return `Uptime: \${Math.floor(uptimeInSeconds)} sec`;
    } else if (uptimeInSeconds < 3600) {
      return `Uptime: \${Math.floor(uptimeInSeconds / 60)} min`;
    } else if (uptimeInSeconds < 86400) {
      return `Uptime: \${Math.floor(uptimeInSeconds / 3600)} hours`;
    } else {
      return `Uptime: \${Math.floor(uptimeInSeconds / 86400)} days`;
    }
  }
}
```

---

## Middlewares

The implemented middlewares manage common aspects of the HTTP request flow:
- **Error Handling:**  
  - `catchGlobalError.middleware.ts`: Captures global errors and responds with a 500 status code.  
  - `catchHttpError.middleware.ts`: Handles specific HTTP errors, returning the appropriate status code and message.
- **Logging:**  
  - `morgan.middleware.ts`: Logs all HTTP requests using Morgan.
- **Validation:**  
  - `schema.middleware.ts`: Uses Joi to validate inputs (query, body, params, and headers) to ensure they match the defined schemas.

---

## Routers and Schemas

### Routers  
*File:* `src/routers/info.router.ts`  
Defines the `/info` route by:
- Instantiating `InfoController` to handle the requests.
- Applying a validation schema defined in `src/schemas/info.schema.ts` to ensure request integrity.

### Schemas  
*File:* `src/schemas/info.schema.ts`  
Sets the validation rules for the `/info` endpoint using utilities from `src/utils/schema.utils.ts` to create the validation middleware.

---

## Types and Utilities

### Types

- **Schemas Types:**  
  *File:* `src/types/schemas.type.ts`  
  Defines the interfaces for request validation, covering `params`, `body`, `headers`, and `query`.

### Utilities  
*File:* `src/utils/schema.utils.ts`  
Facilitates the creation of validation middlewares via the `createSchema` function, which encapsulates the Joi logic.

---

## Server and Entry Point

### Server  
*File:* `src/server.ts`  
Configures the Express application, performing tasks such as:
- **Service Registration:**  
  Initializes services like `InfoService`.
- **Middleware Configuration:**  
  Integrates middlewares for logging, JSON parsing, static file handling, and error validation.
- **Route Mounting:**  
  Registers routes, for example, the `/info` route that uses `InfoController`.

It also provides methods to start (`initialize`), stop (`destroy`), and manage dependency injection with methods to register and retrieve services.

### Entry Point  
*File:* `src/index.ts`  
Acts as the project's entry point. It is responsible for:
- **Loading Environment Variables:**  
  Uses `dotenv` to load configurations from the `.env` file.
- **Instantiating and Starting the Server:**  
  Creates a server instance and starts it on the configured port.

---

## Using Controllers and Services

The architecture is based on the `Piece` class (extended by both `Controller` and `Service`), which facilitates **dependency injection**.

### Accessing Services in Controllers

In a controller, access other services like this:

```typescript
private infoService: InfoService = this.$(InfoService);
```

This delegates business logic to the appropriate service, keeping the controller focused on handling HTTP input and output.

### Recommendations

- **Dependency Injection:**  
  Always use `$()` (or `getService()`) to retrieve instances of other services instead of manual instantiation.
  
- **Separation of Concerns:**  
  Delegate business logic to services and use controllers solely for handling HTTP requests and responses.

---

## Contributions and References

For contributions or further details, please refer to the [stexcore GitHub repository](https://github.com/stexcore). This project was generated using the **create‑stexcore‑api** CLI from stexcore.

---

Happy coding!