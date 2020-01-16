
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
      type: Sequelize.STRING(400),
    },
    image_url: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    ParticipantId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'Participants',
        key: 'id',
      },
    },
    QuestionId: {
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
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    },
    approuvedAt: {
      allowNull: true,
      type: Sequelize.DATEONLY,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Answers'),
};
