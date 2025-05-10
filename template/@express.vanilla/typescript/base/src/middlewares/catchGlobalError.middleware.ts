import type { ErrorRequestHandler } from "express";
import { internalServerError } from "@stexcore/http-status";

/**
 * Catch a global error
 * @param _err Error incomming
 * @param _req Request incomming
 * @param res Response utils
 * @param next Next middleware
 */
const catchGlobalErrorMiddleware: ErrorRequestHandler = (err, _req, res, next) => {
    try {
        console.error(err);
        res.status(500).json(internalServerError());
    }
    catch(err) {
        next(err);
    }
}

// Export middleware
export default catchGlobalErrorMiddleware;