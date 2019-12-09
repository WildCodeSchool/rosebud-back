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

// POST PARTICIPATION BY QUESTIONNAIRE ID
// POST PARTICIPATION BY QUESTIONNAIRE ID
app.post('/api/v1/questionnaires/:id/participations', (req, res) => {
  const { participant, answers } = req.body;
  const valuesAnswers = answers.reduce((acc, curr) => [...acc, curr.comment, curr.question_id], []);
  connection.query(`INSERT INTO answers (comment, question_id), VALUES ${answers.map(_ => '(?,?)')}; INSERT INTO participants (lastname, city), VALUES ('${participant.lastname}','${participant.city}');`, valuesAnswers, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la sauvegarde de la participation");
    } else {
      res.status(200).send(results);
    }
  });
});

// GET ANSWERS BY QUESTIONNAIRE ID
app.get(`/api/v1/questionnaires/:id/participations`, (req, res) => {
  const idQuestionnaire = req.params.id;

  connection.query(
    `SELECT qts.id as questionnaire_id, qs.id as question_id, qs.title as question, a.id AS answer_id, a.comment as answer    FROM questionnaires AS qts 
    JOIN questions AS qs ON qs.questionnaire_id=qts.id 
    JOIN answers AS a ON a.question_id = qs.id
    WHERE qts.id= ? ORDER BY qs.id;`,
    [idQuestionnaire],
    (err, results) => {
      if (err) {
        res.status(500).send("Erreur lors de la récupération des participations");
      } else {
        res.json(results);
      }
    }
  );
});

app.listen(port, err => {
  if (err) {
    throw new Error("Something bad happened...");
  }
  console.log(`Server is listening on ${port}`);
});
