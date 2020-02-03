module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.bulkInsert('Questions', [{
      id: 1,
      title: 'Quel est votre premier souvenir de cinéma ?',
      QuestionnaireId: 1,
      uploadFormat: true,
    }]),
    queryInterface.bulkInsert('Questions', [{
      id: 2,
      title: 'Quel est votre film préféré ?',
      QuestionnaireId: 1,
      uploadFormat: true,
    }]),
    queryInterface.bulkInsert('Questions', [{
      id: 3,
      title: 'Quelle est votre série préférée ?',
      QuestionnaireId: 1,
      uploadFormat: true,
    }]),
    queryInterface.bulkInsert('Questions', [{
      id: 4,
      title: 'Quel personnage de série ou de film auriez vous aimé être ?',
      QuestionnaireId: 1,
      uploadFormat: true,
    }]),
  ]),
  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.bulkInsert('Questions', [{
      id: 1,
      title: 'Quel est votre premier souvenir de cinéma ?',
      QuestionnaireId: 1,
      uploadFormat: true,
    }]),
    queryInterface.bulkInsert('Questions', [{
      id: 2,
      title: 'Quel est votre film préféré ?',
      QuestionnaireId: 1,
      uploadFormat: true,
    }]),
    queryInterface.bulkInsert('Questions', [{
      id: 3,
      title: 'Quelle est votre série préférée ?',
      QuestionnaireId: 1,
      uploadFormat: true,
    }]),
    queryInterface.bulkInsert('Questions', [{
      id: 4,
      title: 'Quel personnage de série ou de film auriez vous aimé être ?',
      QuestionnaireId: 1,
      uploadFormat: true,
    }]),
  ]),
};
