const { Controller } = require("@stexcore/api-engine");
const InfoService = require("../services/info.service");

/**
 * Handle server information
 */
module.exports = class InfoController extends Controller {

    /**
     * Initialize info controller
     * @param server Server instance
     */
    constructor(server) {
        super(server);
        
        // Get info service
        this.info = server.getService(InfoService);

        /**
         * Handle request info API
         * @param req Request incomming
         * @param res Response utils
         * @param next Next middleware
         */
        this.GET = (_req, res, next) => {
            try {
                // Response information server
                res.json({
                    success: true,
                    message: "Information server: OK",
                    data: this.info.GetInformationServer()
                });
            }
            catch (err) {
                // Forward error
                next(err);
            }
        };
    }
}
