const { internalServerError } = require("@stexcore/http-status");

/**
 * Catch a global error
 * @param _err Error incomming
 * @param _req Request incomming
 * @param res Response utils
 * @param next Next middleware
 */
const catchGlobalErrorMiddleware = (err, _req, res, next) => {
    try {
        console.error(err);
        res.status(500).json(internalServerError());
    }
    catch (err) {
        next(err);
    }
};

// Export middleware
module.exports = catchGlobalErrorMiddleware;
