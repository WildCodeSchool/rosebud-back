const Sequelize = require('sequelize');
const express = require('express');
const multer = require('multer');
const {
  Questionnaire, Question, Participant, Answer, Image, sequelize,
} = require('./models');

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

// GET RANDOM IMAGES
app.get('/api/v1/questionnaires/answers', async (req, res) => {
  const { limit } = req.query;
  const homeImages = await Answer.findAll({
    attributes: ['id', 'image_url', 'ParticipantId'],
    limit: limit && Number(limit),
    order: [
      Sequelize.fn('RAND'),
    ],
  });
  res.send(homeImages);
});

// GET PARTICIPANTS COUNTER
app.get('/api/v1/participantsCounter', async (req, res) => {
  const participantsCounter = await Participant.count();
  res.send(String(participantsCounter));
});

// GET ANSWERS COUNTER
app.get('/api/v1/answersCounter', async (req, res) => {
  const answersCounter = await Answer.count();
  res.send(String(answersCounter));
});

// GET QUESTIONNAIRES COUNTER
app.get('/api/v1/questionnairesCounter', async (req, res) => {
  const questionnairesCounter = await Questionnaire.count();
  res.send(String(questionnairesCounter));
});

// GET QUESTIONNAIRES
app.get('/api/v1/questionnaires', async (req, res) => {
  const { query } = req.query;
  const questionnaires = await Questionnaire.findAll({
    where: {
      title: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('title')), 'LIKE', `%${query}%`),
    },
  });
  res.send(questionnaires);
});


// GET QUESTIONNAIRES BY ID
app.get('/api/v1/questionnaires/:id', async (req, res) => {
  const { id } = req.params;
  const questionnaires = await Questionnaire.findAll({ where: { id } });
  res.send(questionnaires);
});


// GET IMAGES CHECKBOXES
app.get('/api/v1/questions/:questionId/images', async (req, res) => {
  const { questionId } = req.params;
  const images = await Image.findAll({ where: { questionId } });
  res.send(images);
});

// GET QUESTIONS BY QUESTIONNAIRE
app.get('/api/v1/questionnaires/:QuestionnaireId/questions', async (req, res) => {
  const { QuestionnaireId } = req.params;
  const questions = await Question.findAll({
    where: { QuestionnaireId },
    order: [['id', 'ASC']],
    include: [{
      model: Image,
    }],
  });
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
    const {
      [`answerComment${i}`]: comment,
      [`answerImageSelect${i}`]: imageSelect,
      [`questionId${i}`]: QuestionId,
    } = req.body;

    const imageUrl = imageSelect || req.files
      .find(({ fieldname }) => fieldname === `answerImage${i}`)
      .path.replace('public/', '/');

    answers.push(
      Answer.create({
        comment,
        image_url: imageUrl,
        ParticipantId: participant.dataValues.id,
        QuestionId,
      }),
    );
  }
  const answersResult = await Promise.all(answers);
  res.status(200).send({ participant, answersResult });
});

// GET Questions & Answers on WALLPAGE
app.get('/api/v1/questionnaires/:QuestionnaireId/participations', async (req, res) => {
  const { QuestionnaireId } = req.params;
  const {
    status, city, name, limit, offset,
  } = req.query;
  const questionnaires = await Questionnaire.findAll({ where: { id: QuestionnaireId } });
  const questions = await Question.findAll({ where: { QuestionnaireId } });

  const options = {
    type: sequelize.QueryTypes.SELECT,
    hasJoin: true,
    include: [{ model: Answer }],
  };
  // eslint-disable-next-line no-underscore-dangle
  Participant._validateIncludedElements(options);
  const participants = await sequelize.query(`
    SELECT 
      p.*, 
      a.id AS 'Answers.id',
      a.ParticipantId AS 'Answers.ParticipantId',
      a.comment AS 'Answers.comment',
      a.image_url AS 'Answers.image_url',
      a.QuestionId AS 'Answers.QuestionId'
    FROM (
      SELECT * FROM Participants
      WHERE
        QuestionnaireId=${QuestionnaireId}
         ${status !== 'all' ? ` AND status = '${status}' ` : ' AND status IS NOT NULL '}
         ${city !== 'all' ? ` AND LOWER(city) LIKE '%${city}%' ` : ' AND city IS NOT NULL '}
         ${name !== 'all' ? ` AND LOWER(lastName) LIKE '%${name}%' ` : ' AND lastName IS NOT NULL '}
      ORDER BY RAND()
      LIMIT ${limit}
      OFFSET ${offset}
    ) AS p 
    LEFT JOIN Answers AS a
    ON a.ParticipantId = p.id
    ORDER BY a.QuestionId ASC;
  `, options);

  const participantsCount = Participant.count({ where: { QuestionnaireId } });

  res.send({
    questionnaires, questions, participants, participantsCount,
  });
});

app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  }
  console.error(`Server is listening on ${port}`);
});
