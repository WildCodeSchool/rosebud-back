
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Questions', {
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
    QuestionnaireId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'Questionnaires',
        key: 'id',
      },
    },
    uploadFormat: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: true,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Questions'),
};
