const { isHttpError } = require("@stexcore/http-status");

/**
 * Catch http error middleware
 * @param err Error incomming
 * @param _req Request incomming
 * @param res Response utils
 * @param next next middleware
 */
const catchHttpErrorMiddleware = (err, _req, res, next) => {
    try {
        // Validate if is http error
        if (isHttpError(err)) {
            res.status(err.statusCode).json(err);
        }
        else
            next(err);
    }
    catch (err) {
        next(err);
    }
};

// Export middleware
module.exports = catchHttpErrorMiddleware;
