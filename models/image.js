
module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    QuestionId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    image_url: DataTypes.STRING,
  }, {});
  Image.associate = (models) => {
    Image.belongsTo(models.Question, { 
      onDelete: 'CASCADE', hooks: true,
      foreignKey: {
        allowNull: false,
      },
    });
  };
  return Image;
};
