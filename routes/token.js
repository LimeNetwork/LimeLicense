const express = require('express');
const router = express.Router();
const controller = require('../controllers/token');

router.post('/get', controller.getTokens);
router.post('/create', controller.generateToken);
router.post('/delete', controller.deleteToken);
router.post('/update', controller.updateToken);

router.post('/assignIp', controller.assignIp);
router.post('/assignHwid', controller.assignHWID);

router.post('/removeIp', controller.removeIp);
router.post('/removeHwid', controller.removeHWID);


module.exports = router;