import { RequestHandler } from "express";
import { badRequest } from "@stexcore/http-status";
import { ISchemaRequest } from "../types/schemas.types";
import Joi from "joi";

/**
 * Make a middleware to validate schema
 * @param schema Schema validation
 * @param access Access to property
 * @returns Request handler
 */
export default function schemaMiddleware(schema: ISchemaRequest): RequestHandler {

    // Create a schema to validate
    const composeSchema = Joi.object({
        ...(schema.query    && {query: schema.query}),
        ...(schema.params   && {params: schema.params}),
        ...(schema.body     && {body: schema.body}),
    });
    
    // Make request handler
    return (req, _res, next) => {
        try {
            // Validate schema with joi
            const resultValidation = composeSchema.validate({
                ...(schema.query    && {query: req.query}),
                ...(schema.params   && {params: req.params}),
                ...(schema.body     && {body: req.body}),
            }, { abortEarly: false });

            if(resultValidation.error) {
                // Throw error
                next(
                    badRequest(resultValidation.error.message, resultValidation.error.details)
                );
            }
            else {
                // Allow request incomming
                next();
            }
        }
        catch(err) {
            // Forward Error
            next(err);
        }
    }
}