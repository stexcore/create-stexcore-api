const { Controller } = require("@stexcore/api-engine");
const DBService = require("../services/db.service");
const UserModel = require("../models/user.model");
const { notFound } = require("@stexcore/http-status");

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
        this.PATCH = this.PATCH.bind(this);
        this.DELETE = this.DELETE.bind(this);
    }

    /**
     * Update an user
     * @param req Request incomming
     * @param res Response utils
     * @param next Next middleware
     */
    async PATCH(req, res, next) {
        try {
            // Get model of User
            const userModel = this.db.getModel(UserModel);
            // Get user model
            const user = await userModel.findOne({
                where: {
                    id: Number(req.params.user_id)
                }
            });

            if (user) {
                // Apply update
                await user.update(req.body);

                res.json({
                    success: true,
                    message: "User updated!",
                    data: user.toJSON()
                });
            }
            else
                throw notFound("User not found!");
        }
        catch (err) {
            next(err);
        }
    }

    /**
     * Delete an user
     * @param req Request incomming
     * @param res Response utils
     * @param next Next middleware
     */
    async DELETE(req, res, next) {
        try {
            // Get model of User
            const userModel = this.db.getModel(UserModel);
            // Get user model
            const user = await userModel.findOne({
                where: {
                    id: Number(req.params.user_id)
                }
            });

            if (user) {
                // Apply delete
                await user.destroy();

                res.json({
                    success: true,
                    message: "User deleted!",
                    data: user.toJSON()
                });
            }
            else
                throw notFound("User not found!");
        }
        catch (err) {
            next(err);
        }
    }
}
