module.exports = (sequelize, DataTypes) => {
  const Questionnaire = sequelize.define('Questionnaire', {
    title: DataTypes.STRING,
    participationText: DataTypes.STRING,
    presentationText: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    isOnline: DataTypes.BOOLEAN,
    isPrivate: DataTypes.BOOLEAN,
  }, {});
  Questionnaire.associate = (models) => {
    models.Questionnaire.hasMany(models.Question, { onDelete: 'CASCADE', hooks: true, foreignKey: { allowNull: false } });
    models.Questionnaire.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
  };
  return Questionnaire;
};
