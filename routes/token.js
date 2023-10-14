const express = require('express');
const router = express.Router();
const controller = require('../controllers/token');

router.post('/create', controller.generateToken);

module.exports = router;