module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Questionnaires', 'isPrivate', Sequelize.BOOLEAN, {
      after: 'isOnline',
      defaultValue: false,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Questionnaires', 'isPrivate', Sequelize.BOOLEAN, {
      after: 'isOnline',
      defaultValue: false,
      allowNull: false,
    });
  },
};
