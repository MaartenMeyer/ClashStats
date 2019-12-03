const express = require('express');
const router = express.Router();
const multer = require('multer');
const ClansController = require('../controllers/clans.controller');
const clanService = require('../services/clan.service');

const dir = './images/';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, file.fieldname + '-' + Date.now() + '-' + fileName);
  }
});

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 512 * 512
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

router.post('/clans', upload.single('image'), (req, res, next) => {
  try {
    const clanBody = req.body;
    const userId = req.user.data;

    const imgUrl = req.file.path;
    const imageType = req.file.mimetype;

    clanService.createClan(clanBody, userId, imgUrl, imageType)
      .then((clan) => {
        res.status(200).send({
          message: 'Clan created',
          data: clan
        });
      })
      .catch((error) => next(error));
  } catch (e) {
    return res.status(422).send({
      message: e.toString()
    });
  }
});
router.get('/clans', ClansController.getAllClans);
router.get('/clans/:id', ClansController.getClanById);
router.patch('/clans/:id', ClansController.updateClanById);
router.delete('/clans/:id', ClansController.deleteClanById);

router.put('/clans/:id/players', ClansController.addPlayerToClan);
router.get('/clans/:id/players', ClansController.getAllPlayersFromClan);
router.delete('/clans/:id/players/:playerId', ClansController.removePlayerFromClan);

module.exports = router;