const express = require('express');
const router = express.Router();

const AuthenticationController = require('../controllers/authentication.controller');

router.post('/authenticate', AuthenticationController.authenticateUser);
router.post('/register', AuthenticationController.registerUser);


module.exports = router;