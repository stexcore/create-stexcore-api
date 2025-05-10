const { createServer } = require("@stexcore/api-engine");
const dotenv = require("dotenv");

// Load environments
dotenv.config();

// Create server instance
const server = createServer({ port: Number(process.env.APP_PORT || 9000), workdir: __dirname });

// Initialize server
server.initialize();
