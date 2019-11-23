const expressJwt = require('express-jwt');
const userService = require('../services/user.service');
const config = require('../config/app.config');
module.exports = jwt;

function jwt() {
  const key = config.jwtKey;
  return expressJwt({ key, isRevoked }).unless({
    path: [
      '/register',
      '/login'
    ]
  });
}

async function isRevoked(req, payload, done) {
  const user = await userService.getById(payload.sub);

  if (!user) {
    return done(null, true);
  }

  done();
};