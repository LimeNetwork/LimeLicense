const express = require('express');
const router = express.Router();

const productRoute = require('./product');
const customerRoute = require('./customer');
const tokenRoute = require('./token');

const tokenController = require('../controllers/token');


router.use(function(req, res, next) {
    // is req.query is, check is there any key value equals to 'null' exclude key
    if (req.query) {
        for (let key in req.query) {
            if (req.query[key] === 'null') {
                req.query[key] = undefined
            }
        }
    }

    // is req.body is, check is there any key value equals to 'null' exclude key
    if (req.body) {
        for (let key in req.body) {
            if (req.body[key] === 'null') {
                req.body[key] = undefined
            }
        }
    }

    next();
})

function authToken(req, res, next) {
    let token = req.headers['authorization']
    if (token == null) return res.status(401).json({
        success: false,
        message: 'No auth token given.'
    });

    if (token != process.env.AUTH_TOKEN) return res.status(401).json({
        success: false,
        message: 'Invalid auth token.'
    });

    next();
}

function checkAuthToken(req, res, next) {
    let token = req.headers['authorization']
    if (token == null) return res.status(401).json({
        success: false,
        message: 'No auth token given.'
    });

    if (token != process.env.CHECK_AUTH_TOKEN) return res.status(401).json({
        success: false,
        message: 'Invalid auth token.'
    });

    next();
}

router.use('/product', authToken, productRoute);
router.use('/customer', authToken, customerRoute);
router.use('/token', authToken, tokenRoute);

router.post('/token/check', checkAuthToken, tokenController.checkToken);

module.exports = router;