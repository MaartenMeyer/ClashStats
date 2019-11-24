const assert = require('assert');
const logger = require('../config/app.config').logger;
//const baseService = require('../services/base.service');

module.exports = {
  addBase: (req, res, next) => {
    try {
      assert.equal(typeof req.params.id, "string", "Player id is required.");
      const playerId = req.params.id;
      const userId = req.user.data;

      res.status(200).send({
        message: 'No auth required test'
      });

    } catch (e) {
      return res.status(422).send({
        message: e.toString()
      });
    }
  },

  getAllBases: (req, res, next) => {

  },

  getBaseById: (req, res, next) => {

  }
}