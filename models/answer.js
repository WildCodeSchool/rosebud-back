module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define('Answer', {
    comment: DataTypes.STRING,
    image_url: DataTypes.STRING,
    ParticipantId: DataTypes.INTEGER,
    QuestionId: DataTypes.INTEGER,
  }, {});
  Answer.associate = (models) => {
    // associations can be defined here
    models.Answer.belongsTo(models.Question, {
      foreignKey: {
        allowNull: false,
      },
    });
    models.Answer.belongsTo(models.Participant, {
      foreignKey: {
        allowNull: false,
      },
    });
  };
  return Answer;
};
