
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Images', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    questionId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'Images',
        key: 'id',
      },
    },
    image_url: {
      type: Sequelize.STRING,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Images'),
};
