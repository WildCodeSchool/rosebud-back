require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { generateTokenForUser } = require('./utils/jwt.utils');
const {
  User,
} = require('./models');

const app = express();
const port = process.env.PORT || 3001;

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


// BACK OFFICE STATISTIQUES
app.use('/api/back/v1/metrics', require('./router/back-office/metrics'));

// BACK OFFICE QUESTIONNAIRES
app.use('/api/back/v1/questionnaires', require('./router/back-office/questionnaires'));

// BACK OFFICE QUESTIONS
app.use('/api/back/v1/questions', require('./router/back-office/questions'));

// BACK OFFICE IMAGES
app.use('/api/back/v1/images', require('./router/back-office/images'));

// BACK OFFICE PARTICIPANTS
app.use('/api/back/v1/participants', require('./router/back-office/participants'));

// BACK OFFICE ANSWERS
app.use('/api/back/v1/answers', require('./router/back-office/answers'));

// BACK OFFICE USERS
app.use('/api/back/v1/users', require('./router/back-office/users'));

// BACK OFFICE LOGIN
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
