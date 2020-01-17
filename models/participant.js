module.exports = (sequelize, DataTypes) => {
  const Participant = sequelize.define('Participant', {
    firstName: {
      type: DataTypes.STRING,
      set(val) {
        this.setDataValue('firstName', val.charAt(0).toUpperCase() + val.slice(1).toLowerCase());
      },
    },
    lastName: {
      type: DataTypes.STRING,
      set(val) {
        this.setDataValue('lastName', val.charAt(0).toUpperCase() + val.slice(1).toLowerCase());
      },
    },
    city: {
      type: DataTypes.STRING,
      set(val) {
        this.setDataValue('city', val.charAt(0).toUpperCase() + val.slice(1).toLowerCase());
      },
    },
    age: DataTypes.INTEGER,
    email: DataTypes.STRING,
    status: DataTypes.STRING,
    QuestionnaireId: DataTypes.INTEGER,
    isApproved: DataTypes.BOOLEAN,
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
