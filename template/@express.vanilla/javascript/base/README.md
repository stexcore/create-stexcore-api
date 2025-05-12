# API Stexcore Vanilla

This template provides a robust, modular, and scalable foundation for building APIs using Express and JavaScript. It features a clear separation between business logic, infrastructure, and data validation.

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

- **Production:**  
  Run the application with:

  ```bash
  npm start
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
  │   ├── utils/                // Utilities (e.g., for creating validation middlewares)
  │   ├── server.js             // Express server configuration: services, middlewares, and routes
  │   └── index.js              // Application entry point
  ├── .env                      // Environment variables
  └── package.json              // Scripts and dependency definitions
```

---

## Base Classes

### Piece  
*File:* `src/class/piece.js`  
This is the smallest reusable unit that provides common methods to access services via dependency injection. Use methods such as `getService()`, `service$()`, or the alias `$()` to retrieve instances of other services.

### Controller  
*File:* `src/class/controller.js`  
Extends `Piece` and acts as the base for all controllers, ensuring uniform access to services and shared methods.

### Service  
*File:* `src/class/service.js`  
Encapsulates business logic and the lifecycle of services. It allows for optional methods such as `initialize()` and `destroy()` to manage resources.

---

## Controllers

### InfoController  
*File:* `src/controllers/info.controller.js`  
This controller manages requests to the `/info` endpoint. It retrieves server information via its service instance, which is loaded in the constructor.

```javascript
const Controller = require("../class/controller");
const InfoService = require("../services/info.service");

class InfoController extends Controller {
  constructor(server) {
    super(server);
    this.infoService = this.$(InfoService);
  }

  GetInformation(req, res, next) {
    try {
      const info = this.infoService.GetInformationServer();
      res.json({
        success: true,
        message: "Information successfully retrieved",
        data: info
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = InfoController;
```

---

## Services

### InfoService  
*File:* `src/services/info.service.js`  
This service provides essential server information by reading the `package.json` file and calculating uptime.

```javascript
const fs = require("fs");
const Service = require("../class/service");

class InfoService extends Service {
  GetInformationServer() {
    const data = JSON.parse(fs.readFileSync("package.json").toString());
    return {
      server_name: data.name,
      version: data.version,
      uptime: this.getUptime()
    };
  }

  getUptime() {
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

module.exports = InfoService;
```

---

## Server and Entry Point

### Server  
*File:* `src/server.js`  
Configures the Express application by registering services, applying middlewares, and mounting routes. It provides methods to start and manage the application.

```javascript
const express = require("express");
const http = require("http");
const path = require("path");
const morganMiddleware = require("./middlewares/morgan.middleware");
const catchGlobalError = require("./middlewares/catchGlobalError.middleware");
const catchHttpError = require("./middlewares/catchHttpError.middleware");
const infoRouter = require("./routers/info.router");

class Server {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.services = [];
    
    // Register services
    this.registerService(InfoService);
    
    // Apply middlewares
    this.app.use(morganMiddleware);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(path.resolve("public")));
    
    // Mount routers
    this.app.use("/info", infoRouter(this));
    
    // Apply error handling middlewares
    this.app.use(catchHttpError);
    this.app.use(catchGlobalError);
  }
  
  registerService(service) {
    if (!this.services.find(s => s instanceof service)) {
      this.services.push(new service(this));
    }
  }
  
  getService(service) {
    const serviceItem = this.services.find(s => s instanceof service);
    if (!serviceItem) throw new Error("Service not found!");
    return serviceItem;
  }
  
  initialize(port) {
    return new Promise((resolve, reject) => {
      this.server.listen(port, () => resolve());
    });
  }
}

module.exports = Server;
```

### Entry Point  
*File:* `src/index.js`  
Acts as the project's entry point. It loads environment variables, creates a Server instance, and starts the application.

```javascript
require("dotenv").config();
const Server = require("./server");
const server = new Server();
const port = Number(process.env.APP_PORT);

server.initialize(port)
  .then(() => {
    console.log(`Server listening on http://localhost:\${port}`);
  })
  .catch(err => {
    console.error(err);
  });
```

---

## Using Controllers and Services

The architecture is based on the `Piece` class (extended by both `Controller` and `Service`), which facilitates **dependency injection**.

### Accessing Services in Controllers

Within a controller's constructor, retrieve service instances as follows:

```javascript
class SomeController extends Controller {
  constructor(server) {
    super(server);
    this.someService = this.$(SomeService);
  }
}
```

This approach delegates business logic to the appropriate service, ensuring that controllers remain focused on handling HTTP requests.

### Recommendations

- **Dependency Injection:**  
  Always use `$()` (or `getService()`) to retrieve service instances instead of manual instantiation.
  
- **Separation of Concerns:**  
  Delegate business logic to services and use controllers solely for handling HTTP requests and responses.

---

## Contributions and References

For contributions or further details, please refer to the [stexcore GitHub repository](https://github.com/stexcore). This project was generated using the **create‑stexcore‑api** CLI from stexcore.

---

Happy coding!