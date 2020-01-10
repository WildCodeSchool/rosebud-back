const Sequelize = require("sequelize");
const express = require("express");
const multer = require("multer");
const { isAuthenticated, generateTokenForUser } = require("./utils/jwt.utils");
const bcrypt = require("bcrypt");
const cors = require('cors')

const {
  Questionnaire,
  Question,
  Participant,
  Answer,
  User
} = require("./models");

const upload = multer({ dest: "public/uploads/" });

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());
app.use(
  express.urlencoded({
    extended: true
  })
);


app.use(express.static("public"));

// GET RANDOM IMAGES
app.get("/api/v1/questionnaires/answers", async (req, res) => {
  const { limit } = req.query;
  const homeImages = await Answer.findAll({
    attributes: ["id", "image_url", "ParticipantId"],
    limit: limit && Number(limit),
    order: [Sequelize.fn("RAND")]
  });
  res.send(homeImages);
});

// GET PARTICIPANTS COUNTER
app.get("/api/v1/participantsCounter", async (req, res) => {
  const participantsCounter = await Participant.count();
  res.send(String(participantsCounter));
});

// GET ANSWERS COUNTER
app.get("/api/v1/answersCounter", async (req, res) => {
  const answersCounter = await Answer.count();
  res.send(String(answersCounter));
});

// GET QUESTIONNAIRES COUNTER
app.get("/api/v1/questionnairesCounter", async (req, res) => {
  const questionnairesCounter = await Questionnaire.count();
  res.send(String(questionnairesCounter));
});

// GET ALL QUESTIONNAIRE
app.get('/api/v1/questionnaires', async (req, res) => {
    const { count, rows } = await Questionnaire.findAndCountAll()
    const questionnaire  = await Questionnaire.findAll();

    res.header('Access-Control-Expose-Headers', 'X-Total-Count');
    res.header('X-Total-Count', count);
    res.send(questionnaire)
    //res.json(rows);
})

// GET QUESTIONNAIRE BY ID
app.get(
  "/api/v1/questionnaires/:id",
  async (req, res) => {
    const { id } = req.params;
    const questionnaire = await Questionnaire.findAll({ where: { id } });
    res.send(questionnaire);
  }
);

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

// GET QUESTIONS BY QUESTIONNAIRE
app.get(
  "/api/v1/questionnaires/:QuestionnaireId/questions",
  async (req, res) => {
    const { QuestionnaireId } = req.params;
    const questions = await Question.findAll({ where: { QuestionnaireId } });
    res.send(questions);
  }
);

// POST PARTICIPATION BY QUESTIONNAIRE
app.post(
  "/api/v1/questionnaires/:QuestionnaireId/participations",
  upload.any(),
  async (req, res) => {
    const {
      firstName,
      lastName,
      status,
      age,
      city,
      email,
      questionsLength
    } = req.body;
    const { QuestionnaireId } = req.params;
    const participant = await Participant.create({
      firstName,
      lastName,
      status,
      age,
      city,
      email,
      QuestionnaireId
    });
    const answers = [];
    for (let i = 0; i < questionsLength; i += 1) {
      const path = req.files[i];
      const {
        [`answerComment${i}`]: comment,
        [`questionId${i}`]: QuestionId
      } = req.body;
      answers.push(
        Answer.create({
          comment,
          image_url: path.path.replace("public/", "/"),
          ParticipantId: participant.dataValues.id,
          QuestionId
        })
      );
    }
    const answersResult = await Promise.all(answers);
    res.status(200).send({ participant, answersResult });
  }
);

// GET Questions on WALLPAGE
app.get(
  "/api/v1/questionnaires/:QuestionnaireId/participations",
  async (req, res) => {
    const { QuestionnaireId } = req.params;
    const { Op } = Sequelize;
    const questions = await Question.findAll({ where: { QuestionnaireId } });
    const answers = await Answer.findAll({
      where: {
        QuestionId: {
          [Op.between]: [
            questions[0].dataValues.id,
            questions[questions.length - 1].dataValues.id
          ]
        }
      }
    });
    const participants = await Participant.findAll({
      where: { QuestionnaireId }
    });

    res.send({ questions, answers, participants });
  }
);

// Create Admin's User
app.post("/api/v1/admin/register", isAuthenticated, async (req, res) => {
  // Params
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (email == null || username == null || password == null) {
    return res.status(400).json({ error: "missing parameters" });
  }

  await User.findOne({
    attributes: ["email"],
    where: { email: email }
  })
    .then(function(userFound) {
      if (!userFound) {
        bcrypt.hash(password, 5, function(err, bcryptedPassword) {
          const newUser = User.create({
            email: email,
            username: username,
            password: bcryptedPassword
          })
            .then(function(newUser) {
              return res.status(201).json({
                userId: newUser.id
              });
            })
            .catch(function(err) {
              return res.status(500).json({ error: "cannot add user" });
            });
        });
      } else {
        return res.status(409).json({ error: "user already exist " });
      }
    })
    .catch(function(err) {
      return res.status(500).json({ error: "unable to verify user" });
    });
});

// Login admin
app.post("/api/v1/admin/login", async (req, res) => {
  // Params
  const username = req.body.username;
  const password = req.body.password;

  if (username == null || password == null) {
    return res.status(400).json({ error: "missing parameter" });
  }

  await User.findOne({
    where: { username: username }
  })
    .then(function(userFound) {
      if (userFound) {
        bcrypt.compare(password, userFound.password, function(
          errBycrypt,
          resBycrypt
        ) {
          if (resBycrypt) {
            return res.status(200).json({
              userId: userFound,
              token: generateTokenForUser(userFound)
            });
          } else {
            return res.status(403).json({ error: "invalid password" });
          }
        });
      } else {
        return res.status(404).json({ error: "user not exist in DB" });
      }
    })
    .catch(function(err) {
      return res.status(500).json({ error: "unable to verify user" });
    });
});

app.listen(port, err => {
  if (err) {
    throw new Error("Something bad happened...");
  }
  console.error(`Server is listening on ${port}`);
});
