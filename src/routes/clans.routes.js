const express = require('express');
const router = express.Router();

const ClansController = require('../controllers/clans.controller');

router.post('/clans', ClansController.createClan);
router.get('/clans', ClansController.getAllClans);
router.get('/clans/:id', ClansController.getClanById);
router.patch('/clans/:id', ClansController.updateClanById);
router.delete('/clans/:id', ClansController.deleteClanById);

router.put('/clans/:id/players', ClansController.addPlayerToClan);
router.delete('/clans/:id/players', ClansController.removePlayerFromClan);

module.exports = router;