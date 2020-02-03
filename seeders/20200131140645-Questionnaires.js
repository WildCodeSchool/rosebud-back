module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.bulkInsert('Questionnaires', [{
      id: 1,
      title: 'Quel·le spectateur·rice êtes-vous ?',
      participationText: 'Upopi vous propose de nous dire quel·le spectateur·rice de cinéma et de série vous êtes, en partageant avec nous vos goûts !',
      presentationText: "Découvrez ici les réponses des utilisateur·rice·s d'Upopi qui nous dévoilent leurs goûts en matière de films et de séries.",
      UserId: 1,
      isOnline: true,
    }]),
    queryInterface.bulkInsert('Questionnaires', [{
      id: 2,
      title: 'Classes pilotes Lycéens et apprentis au cinéma',
      participationText: 'Vous avez participé aux classes pilotes Lycéens et apprentis au cinéma, et nous vous proposons de terminer ce projet en répondant à quatre questions autour du cinéma et des jeux vidéos.',
      presentationText: 'Découvrez ici les réponses des élèves qui ont participé aux classes pilotes Lycéens et apprentis au cinéma autour des jeux vidéos.',
      UserId: 1,
      isOnline: true,
    }]),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.bulkInsert('Questionnaires', [{
      id: 1,
      title: 'Quel·le spectateur·rice êtes-vous ?',
      participationText: 'Upopi vous propose de nous dire quel·le spectateur·rice de cinéma et de série vous êtes, en partageant avec nous vos goûts !',
      presentationText: "Découvrez ici les réponses des utilisateur·rice·s d'Upopi qui nous dévoilent leurs goûts en matière de films et de séries.",
      UserId: 1,
      isOnline: true,
    }]),
    queryInterface.bulkInsert('Questionnaires', [{
      id: 2,
      title: 'Classes pilotes Lycéens et apprentis au cinéma',
      participationText: 'Vous avez participé aux classes pilotes Lycéens et apprentis au cinéma, et nous vous proposons de terminer ce projet en répondant à quatre questions autour du cinéma et des jeux vidéos.',
      presentationText: 'Découvrez ici les réponses des élèves qui ont participé aux classes pilotes Lycéens et apprentis au cinéma autour des jeux vidéos.',
      UserId: 1,
      isOnline: true,
    }]),
  ]),
};
