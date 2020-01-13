const express = require('express');
const Sequelize = require('sequelize');
const { Participant } = require('../models');

const router = express.Router();

// GET PARTICIPANTS COUNTER BY QUESTIONNAIRE ID
router.get('/participantsCount/:QuestionnaireId', async (req, res) => {
  const { QuestionnaireId } = req.params;
  const participantsCount = await Participant.count({ where: { QuestionnaireId } });
  res.send(String(participantsCount));
});

module.exports = router;
