const express = require('express');
const { Questionnaire } = require('../../models');

const router = express.Router();

// GET ALL QUESTIONNAIRE
router.get('/', async (req, res) => {
  const { count } = await Questionnaire.findAndCountAll();
  const questionnaire = await Questionnaire.findAll();
  res.header('Access-Control-Expose-Headers', 'X-Total-Count');
  res.header('X-Total-Count', count);
  res.send(questionnaire);
});

// GET QUESTIONNAIRE BY ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const questionnaire = await Questionnaire.findAll({ where: { id } });
  res.send(questionnaire);
});

// CREATE QUESTIONNAIRE
router.post('/', async (req, res) => {
  const {
    title, participationText, presentationText, UserId,
  } = req.body;
  await Questionnaire.create({
    title, participationText, presentationText, UserId,
  })
    .then(() => {
      res.json({ status: 'Questionnaire Created!' });
    })
    .catch((err) => res.status(500).json({ error: 'unable to create questionnaire' }));
});

// PUT QUESTIONNAIRE
router.put('/:id', async (req, res) => {
  const {
    title, participationText, presentationText,
  } = req.body;

  await Questionnaire.update(
    {
      title, participationText, presentationText,
    },
    { where: { id: req.params.id } },
  )
    .then(() => {
      res.json({ status: 'Questionnaire Updated!' });
    });
});

// DELETE QUESTIONNAIRE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await Questionnaire.destroy({ where: { id } })
    .then(() => {
      res.status(200).send(`Questionnaire ${id} correctement supprimé`);
    })
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
