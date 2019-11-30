const expressJwt = require('express-jwt');
const userService = require('../services/user.service');
const config = require('../config/app.config');
module.exports = jwt;

function jwt() {
  const secret = config.jwtKey;
  return expressJwt({ secret, isRevoked }).unless({
    path: [
      { url: /\/images/, methods: ['GET'] },
      { url: /\/register/ },
      { url: /\/authenticate/ },
      { url: /\/clans/, methods: ['GET'] },
      { url: /\/clans\/.*/, methods: ['GET'] },
      { url: /\/clans\/.*\/players/, methods: ['GET'] },
      { url: /\/players/, methods: ['GET'] },
      { url: /\/players\/.*/, methods: ['GET'] },
      { url: /\/players\/.*\/bases/, methods: ['GET'] },
      { url: /\/players\/.*\/bases\/.*/, methods: ['GET'] }
    ]
  });
}

async function isRevoked(req, payload, done) {
  const user = await userService.getById(payload.data);

  if (!user) {
    return done(null, true);
  }

  done();
};