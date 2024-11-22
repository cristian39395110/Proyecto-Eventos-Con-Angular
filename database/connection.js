const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DIALECT || "mysql",
  port: process.env.DB_PORT || 3306,
  logging: false, // Opcional: desactiva los logs de las consultas SQL
});

module.exports = sequelize;
