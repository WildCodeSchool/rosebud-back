module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Questionnaires', 'isPrivate', {
    allowNull: false,
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  }),
  down: (queryInterface, Sequelize) => queryInterface.removeColumn('Questionnaires', 'isPrivate'),
};
