import { createServer } from "@stexcore/api-engine";
import dotenv from "dotenv";

// Load environments
dotenv.config();

// Create server instance
const server = createServer({ port: process.env.APP_PORT, workdir: __dirname });

// Initialize server
server.initialize();