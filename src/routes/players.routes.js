const express = require('express');
const router = express.Router();
const multer = require('multer');
const PlayersController = require('../controllers/players.controller');
const BasesController = require('../controllers/bases.controller');
const playerService = require('../services/player.service');

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
    fileSize: 1024 * 1024 * 5
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

    const url = req.protocol + '://' + req.get('host');
    const imageUrl = `${url}/api/images/${req.file.filename}`;

    playerService.createPlayer(playerBody, userId, imageUrl)
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

router.post('/players/:id/bases', PlayersController.addBase);
router.get('/players/:id/bases', PlayersController.getAllBases);
router.get('/players/:id/bases/:id', PlayersController.getBaseById);

module.exports = router;