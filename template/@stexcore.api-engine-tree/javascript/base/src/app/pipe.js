const { Pipe } = require("@stexcore/api-engine");
const { static: Static } = require("express");
const path = require("path");

// export pipe
module.exports = class MorganPipe extends Pipe {

    // Initialize MorganPipe
    constructor() {
        super(...arguments);

        /**
         * List of requests handlers
         */
        this.handler = [
            // Static pipe
            Static(path.join(process.cwd(), "public"))
        ];
    }
}