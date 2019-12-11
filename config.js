const mysql = require('mysql2/promise');

const connection = mysql.createConnection({
  host: process.env.DB_HOST, // adresse du serveur
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
});

module.exports = async (app) => app.set('db', await connection);
