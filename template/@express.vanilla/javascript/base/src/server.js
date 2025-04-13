const http = require("http");
const express = require("express");
const catchGlobalErrorMiddleware = require("./middlewares/catchGlobalError.middleware");
const catchHttpErrorMiddleware = require("./middlewares/catchHttpError.middleware");
const infoRouter = require("./routers/info.router");
const InfoService = require("./services/info.service");
const morganMiddleware = require("./middlewares/morgan.middleware");
const path = require("path");

module.exports = class Server {
    /**
     * Initialize structure of server class
     */
    constructor() {
        /**
         * All services
         */
        this.services = [];
        this.app = express();
        this.server = http.createServer(this.app);

        // Register services
        this.registerService(InfoService);

        // Append middlewares
        this.app.use(morganMiddleware);
        this.app.use(express.json());
        this.app.use(express.static(path.resolve("public")));
        this.app.use(express.urlencoded({ extended: true }));

        // Append routers
        this.app.use("/info", infoRouter(this));

        // Append errors catch
        this.app.use(catchHttpErrorMiddleware);
        this.app.use(catchGlobalErrorMiddleware);
    }

    /**
     * Initialize server
     * @param port Port to open
     */
    initialize(port) {
        return new Promise((resolve, reject) => {
            try {
                this.server.listen(port, () => {
                    resolve();
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Stop server listening
     */
    destroy() {
        return new Promise((resolve, reject) => {
            try {
                this.server.close((err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Register service instance into this server
     * @param service Service Constructor
     * @returns Service instance created or existent
     */
    registerService(service) {
        let serviceItem = this.services.find((s) => s instanceof service);
        if (!serviceItem) {
            this.services.push(serviceItem = new service(this));
        }
        return serviceItem;
    }

    /**
     * Get service instance from this server instance
     * @param service Service Constructor
     * @returns Service instance
     */
    getService(service) {
        const serviceItem = this.services.find((s) => s instanceof service);
        if (!serviceItem)
            throw new Error("Service not found!");
        return serviceItem;
    }
}
