const { createSchema, joi } = require("@stexcore/api-engine");

module.exports = createSchema({

    /**
     * Get infomation schema
     */
    GET: {
        /**
         * Method GET
         */
        query: joi.object({})
    }
});
