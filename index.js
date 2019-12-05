require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const app = express();
const port = 3001;
const connection = require("./config.js");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// GET QUESTIONS BY QUESTIONNAIRE ID
app.get(`/api/v1/questionnaires/:id/questions`, (req, res) => {
  const idQuestionnaire = req.params.id;
  connection.query(
    "SELECT * FROM questions WHERE questionnaire_id = ?",
    [idQuestionnaire],
    (err, results) => {
      if (err) {
        res.status(500).send("Erreur lors de la récupération des questions");
      } else {
        res.json(results);
      }
    }
  );
});

app.post('/api/v1/questionnaires/:id/participations', (req, res) => {
  const formData = req.body
  console.log(req.body)
  const { answers } = formData;
  const values = answers.reduce((acc, curr) => [...acc, curr.comment, curr.question_id], []);

  connection.query(`INSERT INTO answers (comment, question_id) VALUES ${answers.map(_ => '(?,?)')}`, values, (err, results) => {
    if (err) {
      // Si une erreur est survenue, alors on informe l'utilisateur de l'erreur
      console.log(err);
      res.status(500).send("Erreur lors de la sauvegarde des réponses");
    } else {
      // Si tout s'est bien passé, on envoie un statut "ok".
      res.status(200).send(results);
    }
  });
});

app.listen(port, err => {
  if (err) {
    throw new Error("Something bad happened...");
  }
  console.log(`Server is listening on ${port}`);
});
