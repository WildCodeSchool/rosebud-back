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
    return res.status(400).json({ error: 'missing parameters' });
  }

  await User.findOne({
    attributes: ['email'],
    where: { email },
  })
    .then((userFound) => {
      if (!userFound) {
        bcrypt.hash(password, 5, (err, bcryptedPassword) => {
          const newUser = User.create({
            email,
            username,
            password: bcryptedPassword,
          })
            .then((newUser) => res.status(201).json({
              userId: newUser.id,
            }))
            .catch((err) => res.status(500).json({ error: 'cannot add user' }));
        });
      } else {
        return res.status(409).json({ error: 'user already exist ' });
      }
    })
    .catch((err) => res.status(500).json({ error: 'unable to verify user' }));
});

// GET USER BY ID
router.get('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const user = await User.findAll({ where: { id } });
  res.send(user);
});

module.exports = router;
