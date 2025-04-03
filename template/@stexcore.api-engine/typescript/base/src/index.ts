import { createServer } from "@stexcore/api-engine";

// Create server instance
const server = createServer({ port: 9001, workdir: __dirname });

// Initialize server
server.initialize();