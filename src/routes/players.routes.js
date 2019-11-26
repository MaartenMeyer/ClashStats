const express = require('express');
const router = express.Router();

const PlayersController = require('../controllers/players.controller');
const BasesController = require('../controllers/bases.controller');

router.post('/players', PlayersController.createPlayer);
router.get('/players', PlayersController.getAllPlayers);
router.get('/players/:id', PlayersController.getPlayerById);
router.patch('/players/:id', PlayersController.updatePlayerById);
router.delete('/players/:id', PlayersController.deletePlayerById);

router.post('/players/:id/bases', PlayersController.addBase);
router.get('/players/:id/bases', PlayersController.getAllBases);
router.get('/players/:id/bases/:id', PlayersController.getBaseById);

module.exports = router;