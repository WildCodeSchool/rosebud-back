
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Participants', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    firstName: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    lastName: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    city: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    age: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    email: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    status: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    questionaireId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'Questionnaires',
        key: 'id',
      },
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Participants'),
};
