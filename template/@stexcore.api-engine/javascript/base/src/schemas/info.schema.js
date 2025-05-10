const { createSchema } = require("@stexcore/api-engine");
const Joi = require("joi");

module.exports = createSchema({

    /**
     * Get infomation schema
     */
    GET: {

        /**
         * Method GET
         */
        query: Joi.object({})
    }
});
