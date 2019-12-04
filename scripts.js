const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password"
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
  connection.query(`CREATE DATABASE rosebud ; USE rosebud_db ; `, (err, result) => {
    if (err) throw err;
    console.log("Database created");
  });
});