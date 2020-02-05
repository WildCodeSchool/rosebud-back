const express = require('express');
const {
  Questionnaire, Question, Answer, Participant,
} = require('../../models');

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

// GET QUESTIONS COUNTER BY QUESTIONNAIRE
router.get('/questions/:QuestionnaireId', async (req, res) => {
  const { QuestionnaireId } = req.params;
  const questionnairesCounter = await Question.count({ where: { QuestionnaireId } });
  res.send(String(questionnairesCounter));
});

// GET PARTICIPANTS COUNTER
router.get('/participants', async (req, res) => {
  const participantsCounter = await Participant.count();
  res.send(String(participantsCounter));
});

// GET PARTICIPANTS APPROVED COUNTER
router.get('/participants/approve', async (req, res) => {
  const participantsCounter = await Participant.count({ where: { isApproved: true } });
  res.send(String(participantsCounter));
});

// GET PARTICIPANTS DISAPPROVED COUNTER
router.get('/participants/disapprove', async (req, res) => {
  const participantsCounter = await Participant.count({ where: { isApproved: false } });
  res.send(String(participantsCounter));
});

module.exports = router;
