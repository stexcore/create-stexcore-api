import { RequestHandler, static as Static } from "express";
import path from "path";

/**
 * Static middleware
 */
const staticMiddleware: RequestHandler = Static(path.join(process.cwd(), "public"));

// export middleware
export default staticMiddleware;