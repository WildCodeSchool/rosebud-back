const Sequelize = require('sequelize');
const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { isAuthenticated, generateTokenForUser } = require('./utils/jwt.utils');
const {
  Questionnaire, Question, Participant, Answer, Image, User, sequelize,
} = require('./models');

const upload = multer({ dest: 'public/uploads/' });

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());
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

// GET PARTICIPANTS COUNTER BY QUESTIONNAIRE ID
app.get('/api/v1/participantsCount/:QuestionnaireId', async (req, res) => {
  const { QuestionnaireId } = req.params;
  const participantsCount = await Participant.count({ where: { QuestionnaireId } });
  res.send(String(participantsCount));
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
      LIMIT ${limit}
      OFFSET ${offset}
    ) AS p 
    LEFT JOIN Answers AS a
    ON a.ParticipantId = p.id
    ORDER BY a.QuestionId ASC;
  `, options);

  res.send({
    questionnaires, questions, participants,
  });
});

// BACK OFFICE

// PUT QUESTIONNAIRE
app.put('/api/v1/questionnaires/:id', async (req, res) => {
  const {
    title, description_participate, description_consult,
  } = req.body;

  await Questionnaire.update(
    {
      title, description_participate, description_consult,
    },
    { where: { id: req.params.id } },
  )
    .then(() => {
      res.json({ status: 'Questionnaire Updated!' });
    });
});

// CREATE QUESTIONNAIRE
app.post('/api/v1/questionnaires/', async (req, res) => {
  const { title, description_participate, description_consult } = req.body;
  await Questionnaire.create({
    title, description_participate, description_consult,
  })
    .then(() => {
      res.json({ status: 'Questionnaire Created!' });
    })
    .catch((err) => res.status(500).json({ error: 'unable to create questionnaire' }));
});


// DELETE QUESTIONNAIRE
app.delete('/api/v1/questionnaires/:id', async (req, res) => {
  const { id } = req.params;
  await Questionnaire.destroy({ where: { id } })
    .then(() => {
      res.status(200).send(`Questionnaire ${id} correctement supprimé`);
    })
    .catch((err) => res.status(500).json(err));
});

// GET ALL QUESTIONNAIRE
app.get('/api/back/v1/questionnaires', async (req, res) => {
  const { count, rows } = await Questionnaire.findAndCountAll();
  const questionnaire = await Questionnaire.findAll();
  res.header('Access-Control-Expose-Headers', 'X-Total-Count');
  res.header('X-Total-Count', count);
  res.send(questionnaire);
  // res.json(rows);
});

// Create Admin's User
app.post('/api/back/v1/admin/register', async (req, res) => {
  // Params
  const { username } = req.body;
  const { email } = req.body;
  const { password } = req.body;

  if (email == null || username == null || password == null) {
    return res.status(400).json({ error: 'missing parameters' });
  }

  await User.findOne({
    attributes: ['email'],
    where: { email },
  })
    .then((userFound) => {
      if (!userFound) {
        bcrypt.hash(password, 5, (err, bcryptedPassword) => {
          const newUser = User.create({
            email,
            username,
            password: bcryptedPassword,
          })
            .then((newUser) => res.status(201).json({
              userId: newUser.id,
            }))
            .catch((err) => res.status(500).json({ error: 'cannot add user' }));
        });
      } else {
        return res.status(409).json({ error: 'user already exist ' });
      }
    })
    .catch((err) => res.status(500).json({ error: 'unable to verify user' }));
});

// Login admin
app.post('/api/back/v1/admin/login', async (req, res) => {
  // Params
  const { username } = req.body;
  const { password } = req.body;

  if (username == null || password == null) {
    return res.status(400).json({ error: 'missing parameter' });
  }

  await User.findOne({
    where: { username },
  })
    .then((userFound) => {
      if (userFound) {
        bcrypt.compare(password, userFound.password, (
          errBycrypt,
          resBycrypt,
        ) => {
          if (resBycrypt) {
            return res.status(200).json({
              userId: userFound,
              token: generateTokenForUser(userFound),
            });
          }
          return res.status(403).json({ error: 'invalid password' });
        });
      } else {
        return res.status(404).json({ error: 'user not exist in DB' });
      }
    })
    .catch((err) => res.status(500).json({ error: 'unable to verify user' }));
});

// LISTEN PORT

app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  }
  console.error(`Server is listening on ${port}`);
});
