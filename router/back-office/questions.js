const express = require('express');
const { Question } = require('../../models');
const { isAuthenticated } = require('../../utils/jwt.utils');

const router = express.Router();

// GET ALL QUESTIONS
router.get('/', isAuthenticated, async (req, res) => {
  const { count } = await Question.findAndCountAll();
  const questions = await Question.findAll();
  res.header('Access-Control-Expose-Headers', 'X-Total-Count');
  res.header('X-Total-Count', count);
  res.send(questions);
});

// GET QUESTION BY ID
router.get('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const question = await Question.findAll({ where: { id } });
  res.send(question);
});

// CREATE QUESTION
router.post('/', isAuthenticated, async (req, res) => {
  const {
    title, QuestionnaireId,
  } = req.body;
  const question = await Question.create({
    title,
    QuestionnaireId,
  });
  res.status(200).send({ question });
});

// PUT QUESTION BY ID
router.put('/:id', isAuthenticated, async (req, res) => {
  const { title, uploadFormat } = req.body;
  await Question.update(
    { title, uploadFormat },
    { where: { id: req.params.id } },
  )
    .then(() => {
      res.json({ status: 'Question Updated!' });
    });
});

module.exports = router;
