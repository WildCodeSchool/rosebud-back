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

  try {
    await app
      .get('db')
      .query(
        'INSERT INTO participants (firstname, lastname, city, status, age, email) VALUES (?,?,?,?,?,?);',
        [
          participant.firstName,
          participant.lastName,
          participant.city,
          participant.status,
          participant.age,
          participant.email,
        ],
      );
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send('Erreur lors de la sauvegarde de la participation');
  }

  const valuesAnswers = answers.reduce(
    (acc, curr) => [...acc, curr.comment, curr.question_id],
    [],
  );

  try {
    await app
      .get('db')
      .query(
        `INSERT INTO answers (comment, question_id, participant_id) VALUES ${answers.map(
          () => '(?,?,?)',
        )};`,
        valuesAnswers,
      );
  } catch (err) {
    console.error(err);
    return res.status(500).send('Erreur lors de la sauvegarde des réponses');
  }
  res.status(200).send('OK');
});

// GET ANSWERS BY QUESTIONNAIRE ID
app.get('/api/v1/questionnaires/:id/participations', async (req, res) => {
  const idQuestionnaire = req.params.id;
  try {
    const results = await app.get('db').query(
      `SELECT qts.id as questionnaire_id, qs.id as question_id, qs.title as question, a.comment as answer FROM questionnaires AS qts 
    JOIN questions AS qs ON qs.questionnaire_id=qts.id 
    JOIN answers AS a ON a.question_id = qs.id
    WHERE qts.id= ? ORDER BY qs.id;`,
      [idQuestionnaire],
    );
    res.json(results);
  } catch (err) {
    res.status(500).send('Erreur lors de la récupération des participations');
  }
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
