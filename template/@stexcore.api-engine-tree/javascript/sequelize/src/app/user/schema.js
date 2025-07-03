const { createSchema, joi } = require("@stexcore/api-engine");

/**
 * Schema definition for user creation using POST /user.
 * Both `username` and `password` must be present in the request body.
 */
module.exports = createSchema({

    /**
     * POST /user
     * Validates the request body to ensure it contains both fields.
     */
    POST: {
        // Validate required body fields
        body: joi.object({
            username: joi
                .string()
                .required(), // username must be a non-empty string
            password: joi
                .string()
                .required()  // password must be a non-empty string
        })
    }

    // Optional: To enhance security, you could enforce password rules
    // password: joi.string().min(8).regex(/[A-Z]/).message("Password must contain at least one uppercase letter")
});
