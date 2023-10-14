const Model = require('../models/token');

async function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16)
    })
}

module.exports.generateToken = async(req, res, next) => {
    let { user } = req.body;
    try {
        const token = await uuidv4();

        const Token = new Model({
            value: token,
            user: user
        })

        await Token.save();

        return res.status(200).json({
            success: true,
            message: 'Token generated successfully',
            data: Token.toObject()
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }
}