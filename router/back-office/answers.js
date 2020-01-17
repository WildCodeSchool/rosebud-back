const express = require('express');
const { Answer } = require('../../models');
const { isAuthenticated } = require('../../utils/jwt.utils');

const router = express.Router();

// GET ALL ANSWERS
router.get('/', isAuthenticated, async (req, res) => {
  const { count } = await Answer.findAndCountAll();
  const answers = await Answer.findAll();
  res.header('Access-Control-Expose-Headers', 'X-Total-Count');
  res.header('X-Total-Count', count);
  res.send(answers);
});

// GET ANSWER BY ID
router.get('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const answer = await Answer.findAll({ where: { id } });
  res.send(answer);
});

// PUT ANSWER BY ID
router.put('/:id', isAuthenticated, async (req, res) => {
  const { comment, image_url, QuestionId } = req.body;
  await Answer.update(
    { comment, image_url, QuestionId },
    { where: { id: req.params.id } },
  )
    .then(() => {
      res.json({ status: 'Answer Updated!' });
    });
});

module.exports = router;
