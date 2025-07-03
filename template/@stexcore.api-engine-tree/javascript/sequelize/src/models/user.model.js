const { DataTypes } = require("sequelize");

/**
 * Create a model to User
 * @param sequelize Sequelize connection
 * @returns Model
 */
const UserModel = (sequelize) => {
    // Define Structure model
    return sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.CHAR(15),
            allowNull: false
        },
        password: {
            type: DataTypes.CHAR(40),
            allowNull: false
        }
    });
};

module.exports = UserModel;
