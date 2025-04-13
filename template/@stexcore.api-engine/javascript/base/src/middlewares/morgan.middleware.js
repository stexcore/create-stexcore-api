const morgan = require("morgan");

/**
 * Morgan middleware
 */
const morganMiddleware = morgan("dev");

// export middleware
module.exports = morganMiddleware;
