import { type Dialect, type ModelStatic, Sequelize } from "sequelize";
import { type ModelConstructor } from "../types/model-constructor.type";
import Service from "../class/service";
import Server from "../server";
import UserModel from "../models/user.model";

/**
 * DBService
 */
export default class DBService extends Service {

    /**
     * Sequelize Connection
     */
    public readonly connection = new Sequelize({
        /**
         * Dialect Type
         */
        dialect:    process.env.DB_TYPE as Dialect,
        /**
         * Database
         */
        database:   process.env.DB_DATABASE!,
        /**
         * Storage info
         */
        storage:    process.env.DB_STORAGE!,
        /**
         * User connection
         */
        username:   process.env.DB_USER!,
        /**
         * Password connection
         */
        password:   process.env.DB_PASSWORD!,
        /**
         * Host connection
         */
        host:       process.env.DB_HOST!,
        /**
         * Port connection
         */
        port:       typeof process.env.DB_PORT == "string" ? Number(process.env.DB_PORT) : undefined,
        /**
         * Logs
         */
        logging: process.env.NODE_ENV === "development"
    });

    /**
     * Models instances
     */
    private models: {
        /**
         * Model instance
         */
        modelInstance: ModelStatic<any>,
        /**
         * Model constructor
         */
        modelConstructor: ModelConstructor
    }[] = [];

    /**
     * Initialize DB Service
     */
    constructor(server: Server) {
        super(server);

        // Register models
        this.registerModel(UserModel);

        // Syncronize connection
        this.connection.sync({ });
    }

    /**
     * Get model instance
     * @param modelConstructor Model Constructor
     * @returns Model item
     */
    public getModel<M extends ModelConstructor>(modelConstructor: M): ReturnType<M> {
        // Model item
        const modelItem = this.models.find((m) => m.modelConstructor === modelConstructor);

        // Model not found!
        if(!modelItem) throw new Error("Model not found!");

        // Model item
        return modelItem.modelInstance as ReturnType<M>;
    }

    /**
     * Register model and create an instance
     * @param modelConstructor Model constructor
     */
    public registerModel(modelConstructor: ModelConstructor) {
        // Validate models conflict
        if(this.models.some((m) => m.modelConstructor === modelConstructor)) {
            throw new Error("The model is already registered!");
        }

        // Create an instance model
        this.models.push({
            modelConstructor,
            modelInstance: modelConstructor(this.connection)
        });
    }
    
}