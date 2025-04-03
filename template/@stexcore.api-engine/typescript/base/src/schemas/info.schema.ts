import { createSchema } from "@stexcore/api-engine";
import Joi from "joi";

export default createSchema({
    
    /**
     * Get infomation schema
     */
    GET: {
        /**
         * Method GET
         */
        query: Joi.object({ })
    }

});