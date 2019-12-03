const express = require('express');
const router = express.Router();
const multer = require('multer');
const PlayersController = require('../controllers/players.controller');
const playerService = require('../services/player.service');
const baseService = require('../services/base.service');

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

router.post('/players', upload.single('image'), (req, res, next) => {
  try {
    const playerBody = req.body;
    const userId = req.user.data;

    const imgUrl = req.file.path;
    const imageType = req.file.mimetype;

    playerService.createPlayer(playerBody, userId, imgUrl, imageType)
      .then((player) => {
        res.status(200).send({
          message: 'Player created',
          data: player
        });
      })
      .catch((error) => next(error));
  } catch (e) {
    return res.status(422).send({
      message: e.toString()
    });
  }
});
router.get('/players', PlayersController.getAllPlayers);
router.get('/players/:id', PlayersController.getPlayerById);
router.patch('/players/:id', PlayersController.updatePlayerById);
router.delete('/players/:id', PlayersController.deletePlayerById);

router.post('/players/:id/bases', upload.single('image'), (req, res, next) => {
  try {
    const playerId = req.params.id;
    const baseBody = req.body;
    const userId = req.user.data;

    const imgUrl = req.file.path;
    const imageType = req.file.mimetype;

    baseService.addBaseToPlayer(playerId, baseBody, userId, imgUrl, imageType)
      .then(() => {
        res.status(200).send({
          message: `Base added to player ${playerId}`
        });
      })
      .catch((error) => next(error));
  } catch (e) {
    return res.status(422).send({
      message: e.toString()
    });
  }
});
router.delete('/players/:id/bases/:baseId', PlayersController.deleteBaseById);

module.exports = router;