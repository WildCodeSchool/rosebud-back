
module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.bulkInsert('Images', [{
      QuestionId: 5,
      title: 'In Between identities - Aleksandar Radan',
      image_url: '/uploads/067542640bcd4a7b5acd6f95b1cbc3dc',
    }]),
    queryInterface.bulkInsert('Images', [{
      QuestionId: 5,
      title: 'Martin pleure - Jonathan Vinel',
      image_url: '/uploads/a0bc85409d7bf361b341c6bed7199d61',
    }]),
    queryInterface.bulkInsert('Images', [{
      QuestionId: 5,
      title: 'Hôtel - Benjamin Nuel',
      image_url: '/uploads/c10f91ecbdd86e65321c41caaa415188',
    }]),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.bulkInsert('Images', [{
      QuestionId: 5,
      title: 'In Between identities - Aleksandar Radan',
      image_url: '/uploads/067542640bcd4a7b5acd6f95b1cbc3dc',
    }]),
    queryInterface.bulkInsert('Images', [{
      QuestionId: 5,
      title: 'Martin pleure - Jonathan Vinel',
      image_url: '/uploads/a0bc85409d7bf361b341c6bed7199d61',
    }]),
    queryInterface.bulkInsert('Images', [{
      QuestionId: 5,
      title: 'Hôtel - Benjamin Nuel',
      image_url: '/uploads/c10f91ecbdd86e65321c41caaa415188',
    }]),
  ]),
};
