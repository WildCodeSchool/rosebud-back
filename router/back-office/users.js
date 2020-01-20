const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../../models');
const { isAuthenticated } = require('../../utils/jwt.utils');

const router = express.Router();

// GET ALL USERS
router.get('/', isAuthenticated, async (req, res) => {
  const { count } = await User.findAndCountAll();
  const users = await User.findAll();
  res.header('Access-Control-Expose-Headers', 'X-Total-Count');
  res.header('X-Total-Count', count);
  res.send(users);
});

// CREATE USER
router.post('/', async (req, res) => {
  // Params
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

// GET USER BY ID
router.get('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const user = await User.findAll({ where: { id } });
  res.send(user);
});

module.exports = router;
