require('dotenv').config();
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    operatorsAliases: 1,
  },
  test: {
    username: 'root',
    password: 'password',
    database: 'database_test',
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: 1,
  },
  production: {
    username: 'root',
    password: 'password',
    database: 'database_production',
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: 1,
  },
};
