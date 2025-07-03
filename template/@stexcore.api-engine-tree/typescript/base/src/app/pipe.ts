import { Pipe, type IRequestHandler } from "@stexcore/api-engine";
import { static as Static } from "express";
import path from "path";

// export pipe
export default class MorganPipe extends Pipe {
    
    /**
     * List of requests handlers
     */
    public handler: IRequestHandler[] = [

        // Static pipe
        Static(path.join(process.cwd(), "public"))
    ]
    
};