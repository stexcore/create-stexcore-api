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

Create a `.env` file at the root of the project with the following basic configuration for SQLite:

```dotenv
# Server Configuration
APP_PORT=9000
NODE_ENV=development

# Database (SQLite by default)
DB_TYPE="sqlite"
DB_STORAGE=".data/database.sqlite"
```

If you want to use another database engine (MySQL, PostgreSQL, etc.), add the following variables:

```dotenv
# Example for other databases
DB_TYPE=your_dialect
DB_DATABASE=your_database_name
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=your_port
```

*Note:* The configuration for SQLite only requires `DB_STORAGE`, while other engines need additional variables. The possible values for `DB_TYPE` are: `mysql`, `postgres`, `sqlite`, `mariadb`, and `mssql`. Check the `src/services/db.service.ts` file for more details.

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
  │   ├── models/               // Data models (e.g., User) for Sequelize
  │   ├── routers/              // Routes for the endpoints
  │   ├── schemas/              // Request validation schemas
  │   ├── services/             // Services encapsulating business logic and data access
  │   ├── types/                // TypeScript interfaces and types (models, validation)
  │   ├── utils/                // Utilities (e.g., for creating validation middlewares)
  │   ├── server.ts             // Express server configuration: services, middlewares, and routes
  │   └── index.ts              // Application entry point
  ├── .env                      // Environment variables
  └── package.json              // Scripts and dependency definitions
```

---

## Base Classes

### Piece  
*File:* `src/class/piece.js`  
This is the smallest reusable unit that provides common methods to access services and models. Its main features include:

- **Dependency Injection:** Uses methods such as `getService()`, `service$()`, or the alias `$()` to retrieve instances of other services.
- **Model Access:** (Extended in DBService) Provides `getModel()` and its alias `model$()` to access models registered within the application.

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

### DBService  
*File:* `src/services/db.service.js`  
This service manages the database connection using Sequelize. It registers models and provides access to them.

```javascript
const { Sequelize } = require("sequelize");
const Service = require("../class/service");

class DBService extends Service {
  constructor(server) {
    super(server);
    this.connection = new Sequelize({
      dialect: process.env.DB_TYPE,
      database: process.env.DB_DATABASE,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
      logging: process.env.NODE_ENV === "development",
      storage: process.env.DB_STORAGE // For SQLite
    });
    this.models = [];
  }

  registerModel(modelConstructor) {
    if (this.models.some(m => m.modelConstructor === modelConstructor)) {
      throw new Error("Model already registered!");
    }
    this.models.push({
      modelConstructor,
      modelInstance: modelConstructor(this.connection)
    });
  }

  getModel(modelConstructor) {
    const modelItem = this.models.find(m => m.modelConstructor === modelConstructor);
    if (!modelItem) throw new Error("Model not found!");
    return modelItem.modelInstance;
  }
}

module.exports = DBService;
```

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

## Contributions and References

For contributions or further details, please refer to the [stexcore GitHub repository](https://github.com/stexcore). This project was generated using the **create‑stexcore‑api** CLI from stexcore.

---

Happy coding!