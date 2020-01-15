module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    title: DataTypes.STRING,
    QuestionnaireId: DataTypes.INTEGER,
    uploadFormat: DataTypes.BOOLEAN,
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
    models.Question.hasMany(models.Image);
  };
  return Question;
};
