
module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    questionId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    image_url: DataTypes.STRING,
  }, {});
  Image.associate = (models) => {
    Image.belongsTo(models.Question, { foreignKey: 'questionId' });
  };
  return Image;
};
