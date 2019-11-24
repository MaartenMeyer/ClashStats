const express = require('express');
const router = express.Router();

const ClansController = require('../controllers/clans.controller');

router.post('/clans', ClansController.createClan);
router.get('/clans', ClansController.getAllClans);
router.get('/clans/:id', ClansController.getClanById);
router.patch('/clans/:id', ClansController.updateClanById);
router.delete('/clans/:id', ClansController.deleteClanById);

router.put('/clans/:id/players', ClansController.addPlayerToClan);
router.get('/clans/:id/players', ClansController.getAllPlayersFromClan);
router.delete('/clans/:id/players/:playerId', ClansController.removePlayerFromClan);

module.exports = router;