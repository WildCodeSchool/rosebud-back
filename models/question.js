module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    title: DataTypes.STRING,
    QuestionnaireId: DataTypes.INTEGER,
  }, {
    timestamps: false,
  });
  Question.associate = (models) => {
    // associations can be defined here
    models.Question.belongsTo(models.Questionnaire, {
      foreignKey: {
        allowNull: false,
      },
    });
    models.Question.hasMany(models.Answer);
  };
  return Question;
};
