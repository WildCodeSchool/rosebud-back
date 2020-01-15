const express = require('express');
const multer = require('multer');
const { Image } = require('../../models');
const { isAuthenticated } = require('../../utils/jwt.utils');

const upload = multer({ dest: 'public/uploads/' });
const router = express.Router();

// GET ALL IMAGES
router.get('/', isAuthenticated, async (req, res) => {
  const { count } = await Image.findAndCountAll();
  const images = await Image.findAll();
  res.header('Access-Control-Expose-Headers', 'X-Total-Count');
  res.header('X-Total-Count', count);
  res.send(images);
});

// GET IMAGE BY ID
router.get('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const image = await Image.findAll({ where: { id } });
  res.send(image);
});

// CREATE IMAGE
router.post('/', upload.single('image_url'), isAuthenticated, async (req, res) => {
  const {
    QuestionId, title,
  } = req.body;
  const imageUrl = req.file.path.replace('public/', '/');
  const image = await Image.create({
    QuestionId,
    title,
    image_url: imageUrl,
  });
  res.status(200).send({ image });
});

// PUT IMAGE BY ID
router.put('/:id', upload.single('image_url'), isAuthenticated, async (req, res) => {
  const { QuestionId, title } = req.body;
  const imageUrl = req.file.path.replace('public/', '/');
  await Image.update(
    { QuestionId, title, image_url: imageUrl },
    { where: { id: req.params.id } },
  )
    .then(() => {
      res.json({ status: 'Image Updated!' });
    });
});

module.exports = router;
