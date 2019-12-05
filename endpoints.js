require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const connection = require("./config.js");

const bodyParser = require("body-parser");
// Support JSON-encoded bodies
app.use(bodyParser.json());
// Support URL-encoded bodies
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get(`/api/v1/questionnaires/`, (req, res) => {
  connection.query("SELECT * from questionnaires", (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la récupération des questions");
    } else {
      res.json(results);
    }
  });
});

app.get(`/api/v1/questionnaires/:id`, (req, res) => {
  // récupération des données envoyées
  const idQuestionnaires = req.params.id;
  const formData = req.body;
  // connexion à la base de données, et suppression de l'employé
  connection.query(
    "SELECT title FROM questionnaires WHERE id = ?",
    [idQuestionnaires],
    err => {
      if (err) {
        // Si une erreur est survenue, alors on informe l'utilisateur de l'erreur
        console.log(err);
        res.status(500).send("Erreur lors de la suppression d'un film");
      } else {
        // Si tout s'est bien passé, on envoie un statut "ok".
        res.send({ formData });
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
