const { badRequest } = require("@stexcore/http-status");
const Joi = require("joi");

/**
 * Make a middleware to validate schema
 * @param schema Schema validation
 * @param access Access to property
 * @returns Request handler
 */
module.exports = function schemaMiddleware(schema) {

    // Create a schema to validate
    const composeSchema = Joi.object(Object.assign(Object.assign(Object.assign({}, (schema.query && { query: schema.query })), (schema.params && { params: schema.params })), (schema.body && { body: schema.body })));

    // Make request handler
    return (req, _res, next) => {
        try {
            // Validate schema with joi
            const resultValidation = composeSchema.validate(Object.assign(Object.assign(Object.assign({}, (schema.query && { query: req.query })), (schema.params && { params: req.params })), (schema.body && { body: req.body })), { abortEarly: false });

            if (resultValidation.error) {
                // Throw error
                next(badRequest(resultValidation.error.message, resultValidation.error.details));
            }
            else {
                // Allow request incomming
                next();
            }
        }
        catch (err) {
            // Forward Error
            next(err);
        }
    };
}
