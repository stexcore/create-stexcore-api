const { Sequelize } = require("sequelize");
const Service = require("../class/service");
const UserModel = require("../models/user.model");

/**
 * DBService
 */
module.exports = class DBService extends Service {

    /**
     * DB Service instance
     */
    constructor() {
        super(...arguments);

        /**
         * Sequelize Connection
         */
        this.connection = new Sequelize({
            /**
             * Dialect Type
             */
            dialect: process.env.DB_TYPE,
            /**
             * Database
             */
            database: process.env.DB_DATABASE,
            /**
             * Storage info
             */
            storage: process.env.DB_STORAGE,
            /**
             * User connection
             */
            username: process.env.DB_USER,
            /**
             * Password connection
             */
            password: process.env.DB_PASSWORD,
            /**
             * Host connection
             */
            host: process.env.DB_HOST,
            /**
             * Port connection
             */
            port: typeof process.env.DB_PORT == "string" ? Number(process.env.DB_PORT) : undefined,
            /**
             * Logs
             */
            logging: process.env.NODE_ENV === "development"
        });

        /**
         * Models instances
         */
        this.models = [];

        /**
         * Append instances
         */
        this.registerModel(UserModel);

        // Syncronize connection
        this.connection.sync({ });
    }

    /**
     * Get model instance
     * @param modelConstructor Model Constructor
     * @returns Model item
     */
    getModel(modelConstructor) {
        // Model item
        const modelItem = this.models.find((m) => m.modelConstructor === modelConstructor);

        // Model not found!
        if (!modelItem)
            throw new Error("Model not found!");

        // Model item
        return modelItem.modelInstance;
    }

    /**
     * Register model and create an instance
     * @param modelConstructor Model constructor
     */
    registerModel(modelConstructor) {
        // Validate models conflict
        if (this.models.some((m) => m.modelConstructor === modelConstructor)) {
            throw new Error("The model is already registered!");
        }

        // Create an instance model
        this.models.push({
            modelConstructor,
            modelInstance: modelConstructor(this.connection)
        });
    }
}
