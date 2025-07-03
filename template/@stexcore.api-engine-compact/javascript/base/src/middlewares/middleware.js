const { Middleware } = require("@stexcore/api-engine");
const morgan = require("morgan");

// export middleware
module.exports = class MorganMiddleware extends Middleware {

    // Initialize MorganMiddleware
    constructor() {
        super(...arguments);

        /**
         * List of requests handlers
         */
        this.handler = [
            // Morgan middleware
            morgan("dev")
        ];
    }
}
