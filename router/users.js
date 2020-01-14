const express = require('express');
const Sequelize = require('sequelize');
const { Questionnaire } = require('../models');

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
router.get('/api/back/v1/questionnaires/:id', async (req, res) => {
  const { id } = req.params;
  const questionnaire = await Questionnaire.findAll({ where: { id } });
  res.send(questionnaire);
});


module.exports = router;
