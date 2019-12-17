module.exports = (sequelize, DataTypes) => {
  const Questionnaire = sequelize.define('Questionnaire', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
  }, {});
  Questionnaire.associate = (models) => {
    // associations can be defined here
    models.Questionnaire.hasMany(models.Question);
  };
  return Questionnaire;
};
