const express = require('express');
const router = express.Router();
const ImagesController = require('../controllers/images.controller');

router.get('/images/:id', ImagesController.getImageById);

module.exports = router;