module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {});
  User.associate = (models) => {
    models.User.hasMany(models.Questionnaire);
  };
  return User;
};
