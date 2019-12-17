module.exports = (sequelize, DataTypes) => {
  const Participant = sequelize.define('Participant', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    city: DataTypes.STRING,
    age: DataTypes.INTEGER,
    email: DataTypes.STRING,
    status: DataTypes.STRING,
    QuestionnaireId: DataTypes.INTEGER,
  }, {
    timestamps: false,
  });
  Participant.associate = (models) => {
    // associations can be defined here
    models.Participant.belongsTo(models.Questionnaire, {
      foreignKey: {
        allowNull: false,
      },
    });
    models.Participant.hasMany(models.Answer);
  };
  return Participant;
};
