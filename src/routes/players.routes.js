const express = require('express');
const router = express.Router();

const PlayersController = require('../controllers/players.controller');

router.post('/players', PlayersController.createPlayer);
router.get('/players', PlayersController.getAllPlayers);
router.get('/players/:id', PlayersController.getPlayerById);
router.patch('/players/:id', PlayersController.updatePlayerById);
router.delete('/players/:id', PlayersController.deletePlayerById);

module.exports = router;