const InfoService = require("../services/info.service");
const Controller = require("../class/controller");

/**
 * Handle server information
 */
module.exports = class InfoController extends Controller {

    /**
     * Constructor info controller
     */
    constructor() {
        super(...arguments);

        /**
         * Information service
         */
        this.info = this.server.getService(InfoService);

        /**
         * Handle request info API
         * @param req Request incomming
         * @param res Response utils
         * @param next Next middleware
         */
        this.GetInformation = (_req, res, next) => {
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
