
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
    description_participate: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    description_consult: {
      allowNull: true,
      type: Sequelize.STRING,
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
};
