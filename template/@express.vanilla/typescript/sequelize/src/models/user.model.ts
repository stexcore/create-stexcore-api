import { Model, DataTypes } from "sequelize";
import dbConnection from "../connections/db.connection";

/**
 * User Interface
 */
interface IUser {
    /**
     * User ID
     */
    id: number,
    /**
     * User name
     */
    username: string,
    /**
     * Password
     */
    password: string
}

/**
 * Instance Model
 */
class User extends Model<IUser, Omit<IUser, "id">> implements IUser {
    /**
     * User ID
     */
    public id!: number;
    /**
     * User name
     */
    public username!: string;
    /**
     * Password
     */
    public password!: string;
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