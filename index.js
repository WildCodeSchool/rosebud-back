require('dotenv').config();
const express = require('express');

const app = express();
const port = 3001;
const bodyParser = require('body-parser');
const connection = require('./config.js');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

// GET QUESTIONS BY QUESTIONNAIRE ID
app.get('/api/v1/questionnaires/:id/questions', async (req, res) => {
  const questionnaireId = req.params.id;
  try {
    const results = await connection.query(
      'SELECT * FROM questions WHERE questionnaire_id = ?',
      [questionnaireId],
    );
    return res.json(results);
  } catch (err) {
    return res.status(500).send('Erreur lors de la récupération des questions');
  }
});

// POST PARTICIPATION BY QUESTIONNAIRE ID
app.post('/api/v1/questionnaires/:id/participations', async (req, res) => {
  const { participant, answers } = req.body;

  try {
    await connection.query(
      'INSERT INTO participants (firstname, lastname, city, status, age, email) VALUES (?,?,?,?,?,?);',
      [
        participant.firstName,
        participant.lastName,
        participant.city,
        participant.status,
        participant.age,
        participant.email,
      ],
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send('Erreur lors de la sauvegarde de la participation');
  }

  const valuesAnswers = answers.reduce(
    (acc, curr) => [
      ...acc,
      curr.comment,
      curr.question_id,
    ],
    [],
  );

  try {
    await connection.query(
      `INSERT INTO answers (comment, question_id, participant_id) VALUES ${answers.map(
        () => '(?,?,?)',
      )};`,
      valuesAnswers,
    );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send('Erreur lors de la sauvegarde des réponses');
  }

  res.status(200).send('OK');
});

// GET ANSWERS BY QUESTIONNAIRE ID
app.get('/api/v1/questionnaires/:id/participations', async (req, res) => {
  const idQuestionnaire = req.params.id;
  try {
    const results = await connection.query(
      `SELECT qts.id as questionnaire_id, qs.id as question_id, qs.title as question, a.comment as answer FROM questionnaires AS qts 
    JOIN questions AS qs ON qs.questionnaire_id=qts.id 
    JOIN answers AS a ON a.question_id = qs.id
    WHERE qts.id= ? ORDER BY qs.id;`,
      [idQuestionnaire],
    );
    res.json(results);
  } catch (err) {
    res
      .status(500)
      .send('Erreur lors de la récupération des participations');
  }
});

app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  }
  console.log(`Server is listening on ${port}`);
});
