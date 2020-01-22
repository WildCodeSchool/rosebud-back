const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../../models');
const { isAuthenticated } = require('../../utils/jwt.utils');

const router = express.Router();

// GET ALL USERS
router.get('/', async (req, res) => {
  const { count } = await User.findAndCountAll();
  const users = await User.findAll({ attributes: { exclude: ['password'] } });
  res.header('Access-Control-Expose-Headers', 'X-Total-Count');
  res.header('X-Total-Count', count);
  res.send(users);
});

// GET USER BY ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findAll({ where: { id } });
  res.send(user);
});

// CREATE USER
router.post('/', async (req, res) => {
  const { username } = req.body;
  const { email } = req.body;
  const { password } = req.body;
  if (email == null || username == null || password == null) {
    res.status(400).json({ error: 'missing parameters' });
  }
  const userFound = await User.findOne({
    attributes: ['username'],
    where: { username },
  });
  const emailFound = await User.findOne({
    attributes: ['email'],
    where: { email },
  });
  if (!userFound || !emailFound) {
    bcrypt.hash(password, 5, async (err, bcryptedPassword) => {
      const newUser = await User.create({
        email,
        username,
        password: bcryptedPassword,
      });
      res.status(201).send(String(newUser.id));
    });
  } else {
    res.status(409).send({ error: 'User already exist' });
  }
});

// PUT USER BY ID
router.put('/:id', async (req, res) => {
  const { username } = req.body;
  const { email } = req.body;
  const { password } = req.body;
  const { id } = req.params;
  if (email == null || username == null || password == null) {
    res.status(400).json({ error: 'missing parameters' });
  }
  const userFound = await User.findOne({
    attributes: ['username'],
    where: { username },
  });
  const emailFound = await User.findOne({
    attributes: ['email'],
    where: { email },
  });
  if (!userFound || !emailFound) {
    bcrypt.hash(password, 5, async (err, bcryptedPassword) => {
      const editUser = await User.update({
        email,
        username,
        password: bcryptedPassword,
      }, { where: { id } });
      res.status(200).send(String(editUser.id));
    });
  } else {
    res.status(409).send({ error: 'User already exist' });
  }
});


// DELETE USER BY ID
router.delete('/:id', isAuthenticated, async (req, res) => {
  await User.destroy(
    { where: { id: req.params.id } },
  )
    .then(() => {
      res.json({ status: 'User Deleted!' });
    });
});

module.exports = router;
