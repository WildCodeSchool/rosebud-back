const express = require('express');
const { Answer, Participant, Questionnaire } = require('../models');

const router = express.Router();

// GET ANSWERS COUNTER
router.get('/answers', async (req, res) => {
  const answersCounter = await Answer.count({
    include: [{
      model: Participant,
      where: { isApproved: true },
    }],
  });
  res.send(String(answersCounter));
});

// GET QUESTIONNAIRES COUNTER
router.get('/questionnaires', async (req, res) => {
  const questionnairesCounter = await Questionnaire.count();
  res.send(String(questionnairesCounter));
});

// GET PARTICIPANTS COUNTER
router.get('/participants', async (req, res) => {
  const participantsCounter = await Participant.count({ where: { isApproved: true } });
  res.send(String(participantsCounter));
});

// GET PARTICIPANTS COUNTER BY QUESTIONNAIRE ID
router.get('/participants/:QuestionnaireId', async (req, res) => {
  const { QuestionnaireId } = req.params;
  const participantsCount = await Participant.count({ where: { QuestionnaireId, isApproved: true } });
  res.send(String(participantsCount));
});

module.exports = router;
