const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { isAuthenticated, generateTokenForUser } = require('./utils/jwt.utils');
const {
  Questionnaire, User,
} = require('./models');


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

// ANSWERS
app.use('/api/v1/answers', require('./router/answers'));

// PARTICIPANTS
app.use('/api/v1/participants', require('./router/participants'));

// QUESTIONNAIRES
app.use('/api/v1/questionnaires', require('./router/questionnaires'));

// QUESTIONS
app.use('/api/v1/questions', require('./router/questions'));

// STATISTIQUES
app.use('/api/v1/metrics', require('./router/metrics'));

// BACK OFFIC
// GET ALL QUESTIONNAIRE
app.get('/api/back/v1/questionnaires', async (req, res) => {
  const { count, rows } = await Questionnaire.findAndCountAll();
  const questionnaire = await Questionnaire.findAll();
  res.header('Access-Control-Expose-Headers', 'X-Total-Count');
  res.header('X-Total-Count', count);
  res.send(questionnaire);
  // res.json(rows);
});

// GET QUESTIONNAIRE BY ID
app.get('/api/back/v1/questionnaires/:id', async (req, res) => {
  const { id } = req.params;
  const questionnaire = await Questionnaire.findAll({ where: { id } });
  res.send(questionnaire);
});

// PUT QUESTIONNAIRE
app.put('/api/back/v1/questionnaires/:id', async (req, res) => {
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
app.post('/api/back/v1/questionnaires/', async (req, res) => {
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
app.delete('/api/back/v1/questionnaires/:id', async (req, res) => {
  const { id } = req.params;
  await Questionnaire.destroy({ where: { id } })
    .then(() => {
      res.status(200).send(`Questionnaire ${id} correctement supprimé`);
    })
    .catch((err) => res.status(500).json(err));
});

// GET ALL QUESTIONS
app.get('/api/back/v1/questions', async (req, res) => {
  const { count, rows } = await Question.findAndCountAll();
  const questions = await Question.findAll();
  res.header('Access-Control-Expose-Headers', 'X-Total-Count');
  res.header('X-Total-Count', count);
  res.send(questions);
  // res.json(rows);
});

// GET QUESTION BY ID
app.get('/api/back/v1/questions/:id', async (req, res) => {
  const { id } = req.params;
  const question = await Question.findAll({ where: { id } });
  res.send(question);
});

// PUT QUESTION BY ID
app.put('/api/back/v1/questions/:id', async (req, res) => {
  const {
    title, uploadFormat,
  } = req.body;

  await Question.update(
    {
      title, uploadFormat,
    },
    { where: { id: req.params.id } },
  )
    .then(() => {
      res.json({ status: 'Question Updated!' });
    });
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
