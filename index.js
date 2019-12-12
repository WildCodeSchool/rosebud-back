require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
const multer = require('multer');

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
    const [results] = await app
      .get('db')
      .query('SELECT * FROM questions WHERE questionnaire_id = ?', [
        questionnaireId,
      ]);
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
    return res.status(500).send('Erreur lors de la sauvegarde des réponses');
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
      .send('Erreur lors de la récupération des participations');  }
});

// UPLOAD IMAGE

// Set Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

// Init Upload
const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
}).single('myImage');

// EJS
app.set('view engine', 'ejs');

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb('Erreur: Images Seulement !');
}

// Public Folder
app.use(express.static('./public'));

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.send({ msg: err });
    } else if (req.file == undefined) {
      res.send({ msg: 'Pas De Fichier Selectioné' });
    } else {
      console.log('file received');
      console.log(req.file);

      const sql = `INSERT INTO \`file\`(\`name\`, \`type\`, \`path\`) VALUES ('${
        req.file.filename
      }', '${
        req.file.mimetype
      }', '${
        req.file.path
      }')`;
      msg = 'Successfully! uploaded';
      res.send({
        msg:
            `Fichier Téléchargé Avec Succès ! voici le chemin de votre image ${
              req.file.path
            }${req.file.size / 10000
            }Mo`,
        file: `uploads/${req.file.filename}`,
        path: req.file.path,
      });
    }
  });
});

app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  }
  console.error(`Server is listening on ${port}`);
});
