const schemaMiddleware = require("../middlewares/schema.middleware");

/**
 * Schema utils
 */
module.exports = {

    /**
     * A simplified method to help create a schema request, using validation typescript
     * @param schema Schema request
     */
    createSchema(schema) {
        return schemaMiddleware(schema);
    }
};
