const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const isAuthenticated = expressJwt({ secret: process.env.JWT_SIGN_SECRET });

module.exports = {
  generateTokenForUser(userData) {
    return jwt.sign(
      {
        userId: userData.id,
        username: userData.username,
      },
      process.env.JWT_SIGN_SECRET,
      {
        expiresIn: '2h',
      },
    );
  },
  isAuthenticated,
};
