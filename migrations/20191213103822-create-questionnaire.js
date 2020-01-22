
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Questionnaires', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    title: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    participationText: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    presentationText: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    UserId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Questionnaires'),
  }
