const { internalServerError } = require("@stexcore/http-status");

/**
 * Catch a global error
 * @param _err Error incomming
 * @param _req Request incomming
 * @param res Response utils
 * @param next Next middleware
 */
const catchGlobalErrorMiddleware = (_err, _req, res, next) => {
    try {
        res.json(internalServerError());
    }
    catch (err) {
        next(err);
    }
};

// Export middleware
module.exports = catchGlobalErrorMiddleware;
