const { Controller } = require("@stexcore/api-engine");
const InfoService = require("../../services/info.service");

/**
 * Handle server information
 */
module.exports = class InfoController extends Controller {

    // Initialize InfoController
    constructor() {
        super(...arguments);

        /**
         * Information service
         */
        this.info = this.$(InfoService);

        // Bind request hander
        this.GET = this.GET.bind(this);
    }

    /**
     * Handle request info API
     * @param req Request incomming
     * @param res Response utils
     * @param next Next middleware
     */
    GET(_req, res, next) {
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
