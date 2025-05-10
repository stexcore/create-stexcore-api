/**
 * It is the main and minimum unit of the application, which is used to be derived 
 * to create fragments throughout the entire application.
 */
module.exports = class Piece {

    /**
     * Initialize controller
     * @param server Server instance
     */
    constructor(server) {
        this.server = server;
    }

    /**
     * Is an alias to get service instance from this server instance
     * @param service Service Constructor
     * @returns Service instance
     */
    getService(service) {
        return this.server.getService(service);
    }

    /**
     * Is an alias to get service instance from this server instance
     * @param service Service Constructor
     * @returns Service instance
     */
    service$(service) {
        return this.server.getService(service);
    }

    /**
     * Is an alias to get service instance from this server instance
     * @param service Service Constructor
     * @returns Service instance
     */
    $(service) {
        return this.server.getService(service);
    }

}
