function authToken(req, res, next) {
    let token = req.headers['authorization']

    if (token == null) return res.status(401).json({
        success: false,
        message: 'No auth token given.'
    });

    token = token.split(' ')[1];

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

    token = token.split(' ')[1];

    if (token != process.env.CHECK_AUTH_TOKEN) return res.status(401).json({
        success: false,
        message: 'Invalid auth token.'
    });

    next();
}

exports.authToken = authToken;
exports.checkAuthToken = checkAuthToken;