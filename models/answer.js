module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define('Answer', {
    comment: {
      type: DataTypes.STRING,
      set(val) {
        this.setDataValue('comment', val.charAt(0).toUpperCase() + val.slice(1).toLowerCase());
      },
    },
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
