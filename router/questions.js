const express = require('express');
const Sequelize = require('sequelize');
const { Image } = require('../models');

const router = express.Router();

// GET IMAGES CHECKBOXES
router.get('/:questionId/images', async (req, res) => {
  const { questionId } = req.params;
  const images = await Image.findAll({ where: { questionId } });
  res.send(images);
});


module.exports = router;
