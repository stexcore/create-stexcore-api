const express = require("express");
const path = require("path");

/**
 * Static middleware
 */
const staticMiddleware = express.static(path.join(process.cwd(), "public"));

// export middleware
module.exports = staticMiddleware;
