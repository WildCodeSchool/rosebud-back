const mysql = require('mysql2');

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  connection.query("CREATE DATABASE rosebud", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});

//USE this DATABASES
connection.connect(function(err) {
    if (err) throw err;
    connection.query("USE rosebud", function (err, result) {
      if (err) throw err;
      console.log("Open Database");
    });
  });

//Create TABLE questionnaires
connection.execute(
    `CREATE TABLE questionnaires (
        id int(11) NOT NULL AUTO_INCREMENT,
        title varchar(250) DEFAULT NULL,
        Description varchar(250) DEFAULT NULL,
        PRIMARY KEY (id)
      )`,
    function(err, results, fields) {
      console.log(results); // results contains rows returned by server
      console.log(fields); // fields contains extra meta data about results, if available
    }
  );

 //Create TABLE questions
connection.execute(
  `CREATE TABLE questions (
    id int(11) NOT NULL AUTO_INCREMENT,
    title varchar(150) DEFAULT NULL,
    questionnaire_id int(11) NOT NULL,
    PRIMARY KEY (id),
    KEY fk_questionnaire_id (questionnaire_id),
    CONSTRAINT fk_questionnaire_id FOREIGN KEY (questionnaire_id) REFERENCES questionnaires (id)
  )`,
  function(err, results, fields) {
    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
  }
);


 