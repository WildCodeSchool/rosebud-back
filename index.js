require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

require('./config.js')(app);

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
    const [results] = await app.get('db').query(
      'SELECT * FROM questions WHERE questionnaire_id = ?',
      [questionnaireId],
    );
    return res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Erreur lors de la récupération des questions');
  }
});

// POST PARTICIPATION BY QUESTIONNAIRE ID
app.post('/api/v1/questionnaires/:id/participations', async (req, res) => {
  const { participant, answers } = req.body;
  const idQuestionnaire = req.params.id;
  try {
    await app.get('db').query(
      'INSERT INTO participants (firstname, lastname, city, status, age, email, questionnaire_id) VALUES (?,?,?,?,?,?,?);',
      [
        participant.firstName,
        participant.lastName,
        participant.city,
        participant.status,
        participant.age,
        participant.email,
        idQuestionnaire,
      ],
    );
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send('Erreur lors de la sauvegarde de la participation');
  }

  const [[TextRow]] = await app.get('db').query('SELECT id as participant_id FROM participants ORDER BY participant_id DESC LIMIT 1;');

  const valuesAnswers = answers.reduce(
    (acc, curr) => [
      ...acc,
      curr.comment,
      'url',
      curr.question_id,
      TextRow.participant_id.toString(),
    ],
    [],
  );

  try {
    await app.get('db').query(
      `INSERT INTO answers (comment,image_url, question_id, participant_id) VALUES ${answers.map(
        (_) => '(?,?,?,?)',
      )};`,
      valuesAnswers,
    );
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send('Erreur lors de la sauvegarde des réponses');
  }
  res.status(200).send('OK');
});

// GET PARTICIPANTS & ANSWERS BY QUESTIONNAIRE ID
app.get('/api/v1/questionnaires/:id/participations', async (req, res) => {
  const idQuestionnaire = req.params.id;
  try {
    const [participants] = await app.get('db').query(
      `SELECT p.id AS participant_id, firstname, lastname, status, age, city, email
        FROM participants AS p
        JOIN questionnaires AS qnn ON qnn.id=p.questionnaire_id
        WHERE qnn.id = ? ORDER BY p.id;`,
      [idQuestionnaire],
    );
    const [answers] = await app.get('db').query(
      `SELECT p.id AS participant_id, q.title AS question, comment, image_url
        FROM answers AS a
        JOIN questions AS q ON q.id = a.question_id
        JOIN participants AS p ON p.id=a.participant_id
        JOIN questionnaires AS qnn ON qnn.id=p.questionnaire_id
        WHERE qnn.id = ? ORDER BY p.id;`,
      [idQuestionnaire],
    );
    res.json([{ participants, answers }]);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send('Erreur lors de la récupération des participations');
  }
});
// GET QUESTIONS BY QUESTIONNAIRE ID
app.get('/api/v1/questionnaires/:id/questions', async (req, res) => {
  const idQuestionnaire = req.params.id;
  try {
    const results = await app.get('db').query(
      `SELECT qts.id AS questionnaire_id, qs.id AS question_id, qs.title AS question FROM questionnaires AS qts 
    JOIN questions AS qs ON qs.questionnaire_id=qts.id 
    WHERE qts.id= ? ORDER BY qs.id;`,
      [idQuestionnaire],
    );
    res.json(results);
  } catch (err) {
    res
      .status(500)
      .send('Erreur lors de la récupération des questions');
  }
});

app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  }
  console.error(`Server is listening on ${port}`);
});
