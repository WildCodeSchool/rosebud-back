const express = require('express');
const { Questionnaire } = require('../../models');
const { isAuthenticated } = require('../../utils/jwt.utils');

const router = express.Router();

// GET ALL QUESTIONNAIRE
router.get('/', isAuthenticated, async (req, res) => {
  const { UserId } = req.query;
  const { count } = await Questionnaire.findAndCountAll();
  const questionnaire = await Questionnaire.findAll(UserId && { where: { UserId } });
  res.header('Access-Control-Expose-Headers', 'X-Total-Count');
  res.header('X-Total-Count', count);
  res.send(questionnaire);
});

// GET QUESTIONNAIRE BY ID
router.get('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const questionnaire = await Questionnaire.findAll({ where: { id } });
  res.send(questionnaire);
});

// CREATE QUESTIONNAIRE
router.post('/', isAuthenticated, async (req, res) => {
  const {
    title, participationText, presentationText, UserId, defaultQuestionnaire,
  } = req.body;
  await Questionnaire.create({
    title, participationText, presentationText, UserId, defaultQuestionnaire,
  })
    .then(() => {
      res.json({ status: 'Questionnaire Created!' });
    })
    .catch((err) => res.status(500).json({ error: 'unable to create questionnaire' }));
});

// PUT QUESTIONNAIRE
router.put('/:id', isAuthenticated, async (req, res) => {
  const {
    title, participationText, presentationText, defaultQuestionnaire,
  } = req.body;

  await Questionnaire.update(
    {
      title, participationText, presentationText, defaultQuestionnaire,
    },
    { where: { id: req.params.id } },
  )
    .then(() => {
      res.json({ status: 'Questionnaire Updated!' });
    });
});

// DELETE QUESTIONNAIRE BY ID
router.delete('/:id', async (req, res) => {
  await Questionnaire.destroy(
    { where: { id: req.params.id } },
  )
    .then(() => {
      res.json({ status: `Questionnaire ${req.params.id} Deleted!` });
    });
});

module.exports = router;
