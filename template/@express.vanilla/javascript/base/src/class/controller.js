/**
 * Structure base of controller
 */
module.exports = class Controller {
    /**
     * Initialize controller
     * @param server Server instance
     */
    constructor(server) {
        this.server = server;
    }
}
