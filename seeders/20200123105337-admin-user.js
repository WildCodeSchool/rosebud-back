const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hash = await bcrypt.hash(process.env.PASSWORD);
    return queryInterface.bulkinsert('Users', [{
      username: 'ciclic',
      email: 'upopi@ciclic.fr',
      password: hash,
    }]);
  },

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', { email: 'upopi@ciclic.fr' }),
};
