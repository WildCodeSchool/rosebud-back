module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define('Answer', {
    comment: {
      type: DataTypes.STRING(400),
    },
    image_url: DataTypes.STRING,
    ParticipantId: DataTypes.INTEGER,
    QuestionId: DataTypes.INTEGER,
  }, {});
  Answer.associate = (models) => {
    // associations can be defined here
    models.Answer.belongsTo(models.Question, {
      onDelete: 'CASCADE',
      hooks: true,
      foreignKey: {
        allowNull: false,
      },
    });
    models.Answer.belongsTo(models.Participant, {
      onDelete: 'CASCADE',
      hooks: true,
      foreignKey: {
        allowNull: false,
      },
    });
  };
  return Answer;
};
