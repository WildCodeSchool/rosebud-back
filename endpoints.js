require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const connection = require("./config.js");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// GET QUESTIONS BY QUESTIONNAIRE ID
app.get(`/api/v1/questionnaires/:id`, (req, res) => {
  const idQuestionnaire = req.params.id;
  connection.query(
    "SELECT title FROM questions WHERE questionnaire_id = ?",
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

app.listen(port, err => {
  if (err) {
    throw new Error("Something bad happened...");
  }
  console.log(`Server is listening on ${port}`);
});
