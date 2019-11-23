const assert = require('assert');
const logger = require('../config/app.config').logger;
const clanService = require('../services/clan.service');

module.exports = {
  createClan: (req, res, next) => {
    try {
      assert.equal(typeof req.body.clanId, "string", "Clan id is required.");
      assert.equal(typeof req.body.name, "string", "Name is required.");
      assert.equal(typeof req.body.description, "string", "Description is required.");
      const clanBody = req.body;
      const userId = req.user.data;

      clanService.createClan(clanBody, userId)
        .then(() => {
          res.status(200).send({
            message: 'Clan created'
          });
        })
        .catch((error) => next(error));
    } catch (e) {
      return res.status(422).send({
        message: e.toString()
      });
    }
  },

  getAllClans: (req, res, next) => {
    try {
      clanService.getAllClans()
        .then((clans) => {
          res.status(200).json(clans);
        })
        .catch((error) => next(error));
    } catch (e) {
      return res.status(422).send({
        message: e.toString()
      });
    }
  },

  getClanById: (req, res, next) => {
    try {
      assert.equal(typeof req.params.id, "string", "Clan id is required.");
      const clanId = req.params.id;

      clanService.getClanById(clanId)
        .then((clan) => {
          res.status(200).json(clan)
        })
        .catch((error) => next(error));
    } catch (e) {
      return res.status(422).send({
        message: e.toString()
      });
    }
  },

  updateClanById: (req, res, next) => {
    try {
      assert.equal(typeof req.params.id, "string", "Clan id is required.");
      assert.equal(typeof req.body.description, "string", "Description is required.");
      const clanId = req.params.id;
      const description = req.body.description;
      const userId = req.user.data;

      clanService.updateClanById(clanId, description, userId)
        .then(() => {
          res.status(200).send({
            message: 'Clan updated'
          });
        })
        .catch((error) => next(error));
    } catch (e) {
      return res.status(422).send({
        message: e.toString()
      });
    }
  },

  deleteClanById: (req, res, next) => {
    try {
      assert.equal(typeof req.params.id, "string", "Clan id is required.");
      const clanId = req.params.id;
      const userId = req.user.data;

      clanService.deleteClanById(clanId, userId)
        .then(() => {
          res.status(200).send({
            message: 'Clan deleted'
          });
        })
        .catch((error) => next(error));
    } catch (e) {
      return res.status(422).send({
        message: e.toString()
      });
    }
  }
}