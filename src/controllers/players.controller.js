const assert = require('assert');
const logger = require('../config/app.config').logger;
const playerService = require('../services/player.service');
const baseService = require('../services/base.service');

module.exports = {
  createPlayer: (req, res, next) => {
    try {
      assert.equal(typeof req.body.playerId, "string", "Player id is required.");
      assert.equal(typeof req.body.name, "string", "Name is required.");
      assert.equal(typeof req.body.level, "number", "Level is required.");
      const playerBody = req.body;
      const userId = req.user.data;

      playerService.createPlayer(playerBody, userId)
        .then(() => {
          res.status(200).send({
            message: 'Player created'
          });
        })
        .catch((error) => next(error));
    } catch (e) {
      return res.status(422).send({
        message: e.toString()
      });
    }
  },

  getAllPlayers: (req, res, next) => {
    try {
      if(req.query.userId) {
        playerService.getAllPlayersFromUser(req.query.userId)
          .then((players) => {
            res.status(200).json(players);
          })
          .catch((error) => next(error));
      } else {
        playerService.getAllPlayers()
          .then((players) => {
            res.status(200).json(players);
          })
          .catch((error) => next(error));
      }
    } catch (e) {
      return res.status(422).send({
        message: e.toString()
      });
    }
  },

  getPlayerById: (req, res, next) => {
    try {
      assert.equal(typeof req.params.id, "string", "player id is required.");
      const playerId = req.params.id;

      playerService.getPlayerById(playerId)
        .then((player) => {
          res.status(200).json(player)
        })
        .catch((error) => next(error));
    } catch (e) {
      return res.status(422).send({
        message: e.toString()
      });
    }
  },

  updatePlayerById: (req, res, next) => {
    try {
      assert.equal(typeof req.params.id, "string", "Player id is required.");
      const playerId = req.params.id;
      const name = req.body.name;
      const level = req.body.level;
      const userId = req.user.data;

      playerService.updatePlayerById(playerId, name, level, userId)
        .then(() => {
          res.status(200).send({
            message: 'Player updated'
          });
        })
        .catch((error) => next(error));
    } catch (e) {
      return res.status(422).send({
        message: e.toString()
      });
    }
  },

  deletePlayerById: (req, res, next) => {
    try {
      assert.equal(typeof req.params.id, "string", "Player id is required.");
      const playerId = req.params.id;
      const userId = req.user.data;

      playerService.deletePlayerById(playerId, userId)
        .then(() => {
          res.status(200).send({
            message: 'Player deleted'
          });
        })
        .catch((error) => next(error));
    } catch (e) {
      return res.status(422).send({
        message: e.toString()
      });
    }
  },

  deleteBaseById: (req, res, next) => {
    try {
      assert.equal(typeof req.params.id, "string", "Player id is required.");
      assert.equal(typeof req.params.baseId, "string", "Base id is required.");
      const playerId = req.params.id;
      const baseId = req.params.baseId;
      const userId = req.user.data;

      baseService.deleteBaseById(baseId, userId)
        .then(() => {
          res.status(200).send({
            message: 'Base deleted'
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