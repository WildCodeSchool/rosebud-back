require('dotenv').config();
const Sequelize = require('sequelize');
const express = require('express');
const multer = require('multer');
const { Question, Participant, Answer } = require('./models');

const upload = multer({ dest: 'public/uploads/' });

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
  const answers = [];
  for (let i = 0; i < questionsLength; i += 1) {
    const path = req.files[i];
    const {
      [`answerComment${i}`]: comment, [`questionId${i}`]: QuestionId,
    } = req.body;
    answers.push(
      Answer.create({
        comment,
        image_url: path.path.replace('public/', '/'),
        ParticipantId: participant.dataValues.id,
        QuestionId,
      }),
    );
  }
  const answersResult = await Promise.all(answers);
  res.status(200).send({ participant, answersResult });
});

// GET Questions on WALLPAGE
app.get('/api/v1/questionnaires/:QuestionnaireId/participations', async (req, res) => {
  const { QuestionnaireId } = req.params;
  const { Op } = Sequelize;
  const questions = await Question.findAll({ where: { QuestionnaireId } });
  const answers = await Answer.findAll({
    where:
    {
      QuestionId: {
        [Op.between]: [questions[0].dataValues.id, questions[questions.length - 1].dataValues.id],
      },
    },
  });
  const participants = await Participant.findAll({ where: { QuestionnaireId } });

  res.send({ questions, answers, participants });
});

app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  }
  console.error(`Server is listening on ${port}`);
});
