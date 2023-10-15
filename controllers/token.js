const TokenModel = require('../models/token');
const CustomerModel = require('../models/customer');
const RequestModel = require('../models/request');

async function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16)
    })
}

module.exports.generateToken = async(req, res, next) => {
    let { user, end_date } = req.body;
    try {

        let customer = await CustomerModel.findOne({ _id: user });
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            })
        }

        const token = await uuidv4();

        // control end_date if it's valid
        if (end_date) {
            let date = new Date(end_date);
            if (date === 'Invalid Date') {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid end_date'
                })
            }
        }

        const Token = new TokenModel({
            value: token,
            user: user,
            end_date: end_date || 'never'
        })

        try {
            await Token.save();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: error.message
            })
        }
        // update customer with push to tokens array
        customer.tokens.push(Token.toObject());
        await customer.save();

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

module.exports.getTokens = async(req, res, next) => {
    let { page, limit, filter } = req.body;

    if (!filter) {
        filter = {};
    } else {
        if (filter.keys().contains('ip')) {

            // check    ip is valid
            let ipRegex = new RegExp('^([0-9]{1,3}\.){3}[0-9]{1,3}$');
            if (!ipRegex.test(filter.ip)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid IP'
                })
            }

            filter.assigned_ips = {
                $in: [filter.ip]
            }
            delete filter.ip;
        }

        if (filter.keys().contains('hwid')) {

            // check    hwid is valid
            let hwidRegex = new RegExp('^[0-9A-Fa-f]{16}$');
            if (!hwidRegex.test(filter.hwid)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid HWID'
                })
            }

            filter.assigned_hwids = {
                $in: [filter.hwid]
            }
            delete filter.hwid;
        }


    }

    // if no page and limit return all tokens
    if (!page && !limit) {
        let tokens;
        try {
            tokens = await TokenModel.find(filter);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: error.message
            })
        }
        return res.status(200).json({
            success: true,
            message: 'Tokens fetched successfully',
            data: tokens
        })
    }

    // if page and limit return paginated tokens
    let options = {
        page: page || 1,
        limit: limit || 10,
        sort: { createdAt: -1 }
    }

    let tokens;

    try {
        tokens = await TokenModel.paginate(filter, options);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }

    return res.status(200).json({
        success: true,
        message: 'Tokens fetched successfully',
        data: tokens
    })
}

module.exports.assignIp = async(req, res, next) => {
    let { token, ip } = req.body;

    let Token = await TokenModel.findOne({ value: token });
    if (!Token) {
        return res.status(404).json({
            success: false,
            message: 'Token not found'
        })
    }

    // check max_ip and assigned_ips
    if (Token.max_ip <= Token.assigned_ips.length) {
        return res.status(400).json({
            success: false,
            message: 'Max IP limit reached'
        })
    }

    // check ip exists
    let ipExists = Token.assigned_ips.find(item => item === ip);
    if (ipExists) {
        return res.status(400).json({
            success: false,
            message: 'IP already exists'
        })
    }

    // check ip is valid
    let ipRegex = new RegExp('^([0-9]{1,3}\.){3}[0-9]{1,3}$');
    if (!ipRegex.test(ip)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid IP'
        })
    }

    Token.assigned_ips.push(ip);

    try {
        await Token.save();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }

    return res.status(200).json({
        success: true,
        message: 'Token updated successfully',
        data: Token.toObject()
    })
}

module.exports.assignHWID = async(req, res, next) => {
    let { token, hwid } = req.body;

    let Token = await TokenModel.findOne({ value: token });
    if (!Token) {
        return res.status(404).json({
            success: false,
            message: 'Token not found'
        })
    }

    // check max_ip and assigned_ips
    if (Token.max_hwid <= Token.assigned_hwids.length) {
        return res.status(400).json({
            success: false,
            message: 'Max IP limit reached'
        })
    }

    // check hwid exists
    let hwidExists = Token.assigned_hwids.find(item => item === hwid);
    if (hwidExists) {
        return res.status(400).json({
            success: false,
            message: 'HWID already exists'
        })
    }

    // check hwid is valid
    let hwidRegex = new RegExp('^[0-9A-Fa-f]{16}$');
    if (!hwidRegex.test(hwid)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid HWID'
        })
    }

    Token.assigned_hwids.push(hwid);

    try {
        await Token.save();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }

    return res.status(200).json({
        success: true,
        message: 'Token updated successfully',
        data: Token.toObject()
    })
}

module.exports.removeIp = async(req, res, next) => {
    let { token, ip } = req.body;

    let Token = await TokenModel.findOne({ value: token });
    if (!Token) {
        return res.status(404).json({
            success: false,
            message: 'Token not found'
        })
    }

    // check ip exists
    let ipExists = Token.assigned_ips.find(item => item === ip);
    if (!ipExists) {
        return res.status(400).json({
            success: false,
            message: 'IP isn\'t exists'
        })
    }

    Token.assigned_ips = Token.assigned_ips.filter(item => item !== ip);

    try {
        await Token.save();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }

    return res.status(200).json({
        success: true,
        message: 'Token updated successfully',
        data: Token.toObject()
    })
}

module.exports.removeHWID = async(req, res, next) => {
    let { token, hwid } = req.body;

    let Token = await TokenModel.findOne({ value: token });
    if (!Token) {
        return res.status(404).json({
            success: false,
            message: 'Token not found'
        })
    }

    // check ip exists
    let hwidExists = Token.assigned_hwids.find(item => item === hwid);
    if (!hwidExists) {
        return res.status(400).json({
            success: false,
            message: 'HWID isn\'t exists'
        })
    }

    Token.assigned_hwids = Token.assigned_ips.filter(item => item !== hwid);

    try {
        await Token.save();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }

    return res.status(200).json({
        success: true,
        message: 'Token updated successfully',
        data: Token.toObject()
    })
}

module.exports.deleteToken = async(req, res, next) => {
    let { token } = req.body;

    let Token = await TokenModel.findOne({ value: token });
    if (!Token) {
        return res.status(404).json({
            success: false,
            message: 'Token not found'
        })
    }

    try {
        await Token.delete();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }

    return res.status(200).json({
        success: true,
        message: 'Token deleted successfully'
    })
}

module.exports.updateToken = async(req, res, next) => {
    let { token } = req.query;

    let Token = await TokenModel.findOne({ value: token });
    if (!Token) {
        return res.status(404).json({
            success: false,
            message: 'Token not found'
        })
    }

    let { max_ip, max_hwid, is_active, end_date } = req.body;

    // control end_date if it's valid
    if (end_date) {
        let date = new Date(end_date);
        if (date === 'Invalid Date') {
            return res.status(400).json({
                success: false,
                message: 'Invalid end_date'
            })
        }
    }

    Token.max_ip = max_ip || Token.max_ip;
    Token.max_hwid = max_hwid || Token.max_hwid;
    Token.is_active = is_active || Token.is_active;
    Token.end_date = end_date || Token.end_date;

    try {
        await Token.save();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        })
    }

    return res.status(200).json({
        success: true,
        message: 'Token updated successfully',
        data: Token.toObject()
    })
}

async function createRequest(token, ip, hwid, valid, message) {
    const Request = new RequestModel({
        value: token,
        ip: ip,
        hwid: hwid,
        authorized: valid,
        message: message
    })

    await Request.save();
}

module.exports.checkToken = async(req, res, next) => {
    let { token, ip, hwid } = req.body;

    let Token = await TokenModel.findOne({ value: token });
    if (!Token) {
        await createRequest(token, ip, hwid, false, 'Token not found');
        return res.status(404).json({
            success: false,
            message: 'Token not found'
        })
    }

    // check token is active
    if (!Token.is_active) {
        await createRequest(token, ip, hwid, false, 'Token is not active');
        return res.status(400).json({
            success: false,
            message: 'Token is not active'
        })
    }

    // check token end_date
    if (Token.end_date !== 'never') {
        let date = new Date(Token.end_date);
        if (date < new Date()) {
            await createRequest(token, ip, hwid, false, 'Token is expired');
            return res.status(400).json({
                success: false,
                message: 'Token is expired'
            })
        }
    }

    // check ip exists
    let ipExists = Token.assigned_ips.find(item => item === ip);
    if (!ipExists) {
        await createRequest(token, ip, hwid, false, 'IP isn\'t exists');
        return res.status(400).json({
            success: false,
            message: 'IP isn\'t exists'
        })
    }

    // check request client ip is equal to assigned ip
    if (ip !== req.ip) {
        await createRequest(token, ip, hwid, false, 'IP isn\'t equal to assigned ip');
        return res.status(400).json({
            success: false,
            message: 'IP isn\'t valid'
        })
    }

    // check hwid exists
    let hwidExists = Token.assigned_hwids.find(item => item === hwid);
    if (!hwidExists) {
        await createRequest(token, ip, hwid, false, 'HWID isn\'t exists');
        return res.status(400).json({
            success: false,
            message: 'HWID isn\'t exists'
        })
    }

    await createRequest(token, ip, hwid, true, 'Token is valid');
    return res.status(200).json({
        success: true,
        message: 'Token is valid'
    })
}