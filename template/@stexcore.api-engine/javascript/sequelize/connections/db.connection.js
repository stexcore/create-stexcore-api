const { Sequelize } = require("sequelize");

/**
 * Export sequelize
 */
module.exports = new Sequelize({
    dialect: process.env.DB_TYPE,
    database: process.env.DB_DATABASE,
    storage: process.env.DB_STORAGE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: typeof process.env.DB_PORT == "string" ? Number(process.env.DB_PORT) : undefined
});
