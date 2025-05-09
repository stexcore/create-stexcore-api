import type Server from "../server";
import { Router } from "express";
import infoSchema from "../schemas/info.schema";
import InfoController from "../controllers/info.controller";

/**
 * Make a router to info segment
 * @param server Server instance
 */
export default function infoRouter(server: Server) {
    // Create router instance
    const router = Router();
    // Create controller instance
    const infoController = new InfoController(server);

    // Append endpoint
    router.get("/", infoSchema.GET, infoController.GetInformation);
    
    return router;
}