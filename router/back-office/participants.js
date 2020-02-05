const express = require('express');
const nodemailer = require('nodemailer');
const { Participant, Questionnaire } = require('../../models');
const { isAuthenticated } = require('../../utils/jwt.utils');
const mailParticipationApproved = require('../../mails/mailParticipationApproved');

const router = express.Router();

// GET ALL PARTICIPANTS
router.get('/', isAuthenticated, async (req, res) => {
  const { QuestionnaireId, status, isApproved } = req.query;
  const { count } = await Participant.findAndCountAll();
  const participants = await Participant.findAll(
    (QuestionnaireId && { where: { QuestionnaireId } })
    || (status && { where: { status } })
    || (isApproved && { where: { isApproved } }),
  );
  res.header('Access-Control-Expose-Headers', 'X-Total-Count');
  res.header('X-Total-Count', count);
  res.send(participants);
});

// GET PARTICIPANT BY ID
router.get('/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const participant = await Participant.findAll({ where: { id } });
  res.send(participant);
});

// CREATE PARTICIPANT
router.post('/', isAuthenticated, async (req, res) => {
  const {
    firstName, lastName, status, age, city, email, QuestionnaireId,
  } = req.body;
  const participant = await Participant.create({
    firstName, lastName, status, age, city, email, QuestionnaireId,
  });
  res.status(200).send({ participant });
});

// PUT PARTICIPANT BY ID
router.put('/:id', isAuthenticated, async (req, res) => {
  const {
    firstName, lastName, status, age, city, email, isApproved,
  } = req.body;
  await Participant.update(
    {
      firstName, lastName, status, age, city, email, isApproved,
    },
    { where: { id: req.params.id } },
  )
    .then(() => {
      res.json({ status: 'Question Updated!' });
    });
});

// DELETE PARTICIPANT BY ID
router.delete('/:id', async (req, res) => {
  await Participant.destroy(
    { where: { id: req.params.id } },
  )
    .then(() => {
      res.json({ status: 'Participant Deleted!' });
    });
});

// SEND MAIL PARTICIPATION APPROVED
router.post('/:ParticipantId/approved', async (req, res) => {
  const { ParticipantId } = req.params;
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  const participant = await Participant.findOne({
    where: { id: ParticipantId },
  });
  const questionnaire = await Questionnaire.findOne({
    where: { id: participant.QuestionnaireId },
  });
  const mail = await transporter.sendMail({
    from: 'me',
    to: participant.email,
    subject: 'Rosebud - Ciclic | Votre participation est en ligne',
    html: mailParticipationApproved({
      QuestionnaireId: questionnaire.id,
      title: questionnaire.title,
      firstName: participant.firstName,
    }),
  });
  res.status(200).send({
    mail,
  });
});

module.exports = router;
