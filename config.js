const  mysql = require('mysql2');
const  connection = mysql.createConnection({

host :  'localhost', // adresse du serveur
user :  'root',
password :  'password',
database :  'rosebud'
});
module.exports = connection;