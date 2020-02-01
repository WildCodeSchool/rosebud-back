const express = require('express');

const {
  Answer, Participant, sequelize,
} = require('../models');

const router = express.Router();

// GET RANDOM IMAGES
router.get('/questionnaire/:QuestionnaireId', async (req, res) => {
  const { limit } = req.query;
  const { QuestionnaireId } = req.params;
  const options = await {
    hasJoin: true,
    include: [{ model: Participant }],
    type: sequelize.QueryTypes.SELECT,
  };
    // eslint-disable-next-line no-underscore-dangle
  Answer._validateIncludedElements(options);
  const homeImages = await sequelize.query(`
    SELECT
      a.image_url
    FROM
      Answers AS a
      INNER JOIN Participants AS p ON  a.ParticipantId = p.id
      INNER JOIN Questionnaires AS q ON p.QuestionnaireId = q.id
    WHERE
      p.QuestionnaireId = ${QuestionnaireId} AND p.isApproved = true AND q.isOnline = true
    ORDER BY RAND()
    LIMIT ${limit}
    `, options);
  res.send(homeImages);
});

module.exports = router;
