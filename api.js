const express = require('express');
const { User, sequelize } = require('./models');


const app = express();

// Get
app.get('/api/v1/questionnaires/:id/questions', async (req, res) => {
  const user = await User.findAll({ where: { id: 1 } });
  res.send('Hello');
});

// Post
app.post('/api/v1/questionnaires/:id/questions', async (req, res) => {
  const {
    firstName, lastName, email, status,
  } = req.body;
  const user = await User.create({
    firstName, lastName, email, status,
  });
  res.send(user);
});

// Update
app.put('api/v1/users/:id', async (req, res) => {
  const { id } = req.params;
  const {
    firstName, lastName, email, status,
  } = req.body;
  const user = await User.update({
    firstName, lastName, email, status,
  }, { where: { id } });
  res.send({ id });
});

// Delete
app.delete('api/v1/users/:id', async (res, req) => {
  const { id } = req.params;
  await User.destroy({ where: { id } });
  res.send({ id });
});
app.listen(3000, () => {
  console.log('Listening on port 3000');
});
