const { Controller } = require("@stexcore/api-engine");
const DBService = require("../services/db.service");
const UserModel = require("../models/user.model");

/**
 * User controller
 */
module.exports = class UserController extends Controller {

    constructor() {
        super(...arguments);

        /**
         * Get DB Service
         */
        this.db = this.$(DBService);

        // Bind methods
        this.GET = this.GET.bind(this);
        this.POST = this.POST.bind(this);
    }

    /**
     * Get all users
     * @param req Request incomming
     * @param res Response utils
     * @param next Next middleware
     */
    async GET(req, res, next) {
        try {
            // Get model of User
            const userModel = this.db.getModel(UserModel);
            // Get all users
            const allUsers = await userModel.findAll();

            res.json({
                success: true,
                message: "Getted all users!",
                data: allUsers.map((userItem) => userItem.toJSON())
            });
        }
        catch (err) {
            next(err);
        }
    };

    /**
     * Create a new user
     * @param req Request incomming
     * @param res Response utils
     * @param next Next middleware
     */
    async POST(req, res, next) {
        try {
            // Get model of User
            const userModel = this.db.getModel(UserModel);
            // Create user model
            const user = await userModel.create({
                username: req.body.username,
                password: req.body.password
            });

            res.json({
                success: true,
                message: "User created!",
                data: user.toJSON()
            });
        }
        catch (err) {
            next(err);
        }
    };
}
