
module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    questionId: DataTypes.INTEGER,
    image_url: DataTypes.STRING,
  }, {});
  Image.associate = (models) => {
    Image.belongsTo(models.Question, { foreignKey: 'questionId' });
  };
  return Image;
};
