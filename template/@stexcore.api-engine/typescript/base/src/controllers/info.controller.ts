import { RequestHandler } from "express";
import { Controller, Server } from "@stexcore/api-engine";
import InfoService from "../services/info.service";

/**
 * Handle server information
 */
export default class InfoController extends Controller {

    /**
     * Information service
     */
    private info: InfoService;
    
    /**
     * Initialize info controller
     * @param server Server instance
     */
    constructor(server: Server) {
        super(server);

        // Get info service
        this.info = server.getService(InfoService);
    }

    /**
     * Handle request info API
     * @param req Request incomming
     * @param res Response utils
     * @param next Next middleware
     */
    public GET?: RequestHandler = (_req, res, next) => {
        try {
            // Response information server
            res.json({
                success: true,
                message: "Information server: OK",
                data: this.info.GetInformationServer()
            });
        }
        catch(err) {
            // Forward error
            next(err);
        }
    }
    
}