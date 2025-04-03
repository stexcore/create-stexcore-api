import { Model, DataTypes } from "sequelize";
import dbConnection from "../connections/db.connection";
/**
 * Instance Model
 */
class User extends Model {
}
// Initialize model
User.init({
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
}, {
    sequelize: dbConnection,
    tableName: "users",
});
// export model
export default User;
