module.exports = (sequelize, DataTypes) => {
  const Questionnaire = sequelize.define('Questionnaire', {
    title: DataTypes.STRING,
    description_participate: DataTypes.STRING,
    description_consult: DataTypes.STRING,
  }, {});
  Questionnaire.associate = (models) => {
    // associations can be defined here
    models.Questionnaire.hasMany(models.Question, { onDelete: 'CASCADE' });
  };
  return Questionnaire;
};
