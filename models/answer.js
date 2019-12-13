'use strict';
module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define('Answer', {
    comment: DataTypes.STRING,
    image_url: DataTypes.STRING,
    participantId: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER
  }, {});
  Answer.associate = function(models) {
    // associations can be defined here
    models.Answer.belongsTo(models.Question, models.Participant, {
      foreignKey: {
        allowNull: false,
      },
  };
  return Answer;
};