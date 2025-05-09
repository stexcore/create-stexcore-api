import schemaMiddleware from "../middlewares/schema.middleware";
import type { RequestHandler } from "express";
import type { ISchemaRequest } from "../types/schemas.types";

/**
 * Schema utils
 */
export default {

    /**
     * A simplified method to help create a schema request, using validation typescript
     * @param schema Schema request
     */
    createSchema(schema: ISchemaRequest): RequestHandler {
        return schemaMiddleware(schema);
    }
    
}