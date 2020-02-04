module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.bulkInsert('Questions', [{
      id: 5,
      title: "Quel film souhaitez vous que les lycéens et apprentis de la Région voient l'année prochaine, et pourquoi ?",
      QuestionnaireId: 2,
      uploadFormat: false,
    }]),
    queryInterface.bulkInsert('Questions', [{
      id: 6,
      title: 'Quel est le premier jeu vidéo auquel vous avez joué, et quel souvenir en avez-vous ?',
      QuestionnaireId: 2,
      uploadFormat: true,
    }]),
    queryInterface.bulkInsert('Questions', [{
      id: 7,
      title: 'Quel est votre jeu vidéo préféré, et pourquoi ?',
      QuestionnaireId: 2,
      uploadFormat: true,
    }]),
    queryInterface.bulkInsert('Questions', [{
      id: 8,
      title: 'Quel est votre film préféré, et pourquoi ?',
      QuestionnaireId: 2,
      uploadFormat: true,
    }]),
  ]),
  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.bulkInsert('Questions', [{
      id: 5,
      title: "Quel film souhaitez vous que les lycéens et apprentis de la Région voient l'année prochaine, et pourquoi ?",
      QuestionnaireId: 2,
      uploadFormat: false,
    }]),
    queryInterface.bulkInsert('Questions', [{
      id: 6,
      title: 'Quel est le premier jeu vidéo auquel vous avez joué, et quel souvenir en avez-vous ?',
      QuestionnaireId: 2,
      uploadFormat: true,
    }]),
    queryInterface.bulkInsert('Questions', [{
      id: 7,
      title: 'Quel est votre jeu vidéo préféré, et pourquoi ?',
      QuestionnaireId: 2,
      uploadFormat: true,
    }]),
    queryInterface.bulkInsert('Questions', [{
      id: 8,
      title: 'Quel est votre film préféré, et pourquoi ?',
      QuestionnaireId: 2,
      uploadFormat: true,
    }]),
  ]),
};
