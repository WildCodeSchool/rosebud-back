
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Answers', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    comment: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    image_url: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    participantId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'Participants',
        key: 'id',
      },
    },
    questionId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'Questions',
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Answers'),
};
