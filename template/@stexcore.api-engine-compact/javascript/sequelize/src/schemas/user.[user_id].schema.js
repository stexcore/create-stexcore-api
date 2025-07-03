const { createSchema, joi } = require("@stexcore/api-engine");

/**
 * Reusable validation for numeric user_id string
 */
const userIdSchema = joi
    .string()
    .pattern(/^\d+$/)
    .message("user_id must be a numeric string");

/**
 * Schema definition for PATCH and DELETE /user/:user_id endpoints.
 * PATCH supports partial updates. DELETE removes a user.
 */
module.exports = createSchema({

    /**
     * PATCH /user/:user_id
     * Allows updating `username` and/or `password`.
     */
    PATCH: {
        // Validate route parameter: user_id
        params: joi.object({
            user_id: userIdSchema
        }),
        // Validate body: at least one field required
        body: joi.object({
            username: joi.string().optional(),
            password: joi.string().optional()
        }).min(1) // Prevents empty objects like {}
    },

    /**
     * DELETE /user/:user_id
     * Removes the user identified by user_id.
     */
    DELETE: {
        // Validate route parameter: user_id
        params: joi.object({
            user_id: userIdSchema
        })
        // No body expected
    }

});
