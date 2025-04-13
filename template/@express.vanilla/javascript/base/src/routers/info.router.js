const { Router } = require("express");
const schemaMiddleware = require("../middlewares/schema.middleware");
const infoSchema = require("../schemas/info.schema");
const InfoController = require("../controllers/info.controller");

/**
 * Make a router to info segment
 * @param server Server instance
 */
module.exports = function infoRouter(server) {
    // Create router instance
    const router = Router();

    // Create controller instance
    const infoController = new InfoController(server);

    // Append endpoint
    router.get("/", schemaMiddleware(infoSchema.GET), infoController.GetInformation);

    return router;
}
