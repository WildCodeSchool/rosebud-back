require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { Question, Participant, Answer } = require('./models');

const upload = multer({ dest: 'uploads/' });

const app = express();
const port = 3001;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(express.static('public'));

// GET QUESTIONS BY QUESTIONNAIRE
app.get('/api/v1/questionnaires/:QuestionnaireId/questions', async (req, res) => {
  const { QuestionnaireId } = req.params;
  const questions = await Question.findAll({ where: { QuestionnaireId } });
  res.send(questions);
});

// POST PARTICIPATION BY QUESTIONNAIRE
app.post('/api/v1/questionnaires/:QuestionnaireId/participations', upload.any(), async (req, res) => {
  console.log(req.files);
  const {
    firstName, lastName, status, age, city, email, questionsLength,
  } = req.body;
  const { QuestionnaireId } = req.params;
  const participant = await Participant.create({
    firstName,
    lastName,
    status,
    age,
    city,
    email,
    QuestionnaireId,
  });
  const ParticipantId = await Participant.findAll({
    attributes: ['id'], raw: true, order: [['id', 'DESC']], limit: 1,
  });
  const answers = [];
  for (let i = 0; i < questionsLength; i += 1) {
    const {
      [`answerComment${i}`]: comment, [`answerImage${i}`]: image, [`questionId${i}`]: QuestionId,
    } = req.body;
    answers.push(
      Answer.create({
        comment,
        image_url: 'url',
        ParticipantId: ParticipantId[0].id,
        QuestionId,
      }),
    );
  }
  res.status(200).send({ participant, answers });
});

// GET Questions on WALLPAGE
app.get('/api/v1/questionnaires/:QuestionnaireId/participations', async (req, res) => {
  const { QuestionnaireId } = req.params;
  const questions = await Question.findAll({ attributes: ['title'], where: { QuestionnaireId } });
  res.send({ questions });
  console.log(questions);
});

app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  }
  console.error(`Server is listening on ${port}`);
});
