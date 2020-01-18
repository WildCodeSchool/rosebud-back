const express = require('express');
const { Questionnaire, Answer, Participant } = require('../../models');

const router = express.Router();

// GET ANSWERS COUNTER
router.get('/answers', async (req, res) => {
  const answersCounter = await Answer.count();
  res.send(String(answersCounter));
});

// GET QUESTIONNAIRES COUNTER
router.get('/questionnaires', async (req, res) => {
  const questionnairesCounter = await Questionnaire.count();
  res.send(String(questionnairesCounter));
});

// GET PARTICIPANTS COUNTER
router.get('/participants', async (req, res) => {
  const participantsCounter = await Participant.count();
  res.send(String(participantsCounter));
});

module.exports = router;
