const express = require('express');
const multer = require('multer');
const {
  Questionnaire, Answer, Image, Question, Participant, sequelize, Sequelize,
} = require('../models');

const upload = multer({ dest: 'public/uploads/' });

const router = express.Router();

// GET RANDOM IMAGES
router.get('/answers', async (req, res) => {
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

// GET QUESTIONNAIRES
router.get('/', async (req, res) => {
  const { query, offset, limit } = req.query;
  const questionnaires = await Questionnaire.findAll({
    where: {
      title: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('title')), 'LIKE', `%${query}%`),
    },
    offset: Number(offset),
    limit: Number(limit),
    subQuery: false,
  });
  res.send(questionnaires);
});

// GET QUESTIONNAIRES BY ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const questionnaires = await Questionnaire.findAll({ where: { id } });
  res.send(questionnaires);
});

// GET QUESTIONS BY QUESTIONNAIRE
router.get('/:QuestionnaireId/questions', async (req, res) => {
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
router.post('/:QuestionnaireId/participations', upload.any(), async (req, res) => {
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
router.get('/:QuestionnaireId/participations', async (req, res) => {
  const { QuestionnaireId } = req.params;
  const {
    status, city, name, limit, offset,
  } = req.query;
  const questionnaires = await Questionnaire.findAll({ where: { id: QuestionnaireId } });
  const questions = await Question.findAll({ where: { QuestionnaireId } });
  const options = await {
    hasJoin: true,
    include: [{ model: Answer }],
    replacements: {
      status,
      city: `%${city}%`,
      name: `%${name}%`,
      limit: Number(limit),
      offset: Number(offset),
      QuestionnaireId: Number(QuestionnaireId),
    },
    type: sequelize.QueryTypes.SELECT,
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
        QuestionnaireId=:QuestionnaireId
         ${status !== 'all' ? 'AND status = :status' : ' AND status IS NOT NULL '}
         ${city !== 'all' ? 'AND LOWER(city) LIKE :city' : ' AND city IS NOT NULL '}
         ${name !== 'all' ? 'AND LOWER(lastName) LIKE :name' : ' AND lastName IS NOT NULL '}
      LIMIT :limit
      OFFSET :offset
    ) AS p 
    LEFT JOIN Answers AS a
    ON a.ParticipantId = p.id
    ORDER BY a.QuestionId ASC;
  `, options);
  res.send({
    questionnaires, questions, participants,
  });
});

module.exports = router;
