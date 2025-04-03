import { RequestHandler } from "express";
import morgan from "morgan";

/**
 * Morgan middleware
 */
const morganMiddleware: RequestHandler = morgan("dev");

// export middleware
export default morganMiddleware;