const Model = require('../models/customer');

module.exports.createCustomer = async(req, res, next) => {
    let { name, mail, discord_id } = req.body;


    let userByDiscord = await Model.findOne({ discord_id: discord_id });
    let userByMail = await Model.findOne({ mail: mail });

    if (userByDiscord || userByMail) {
        return res.status(404).json({
            success: false,
            message: 'User already exists'
        })
    }

    if (!name || name.length < 3 || name.length > 20 || !name.match(/^[a-zA-Z0-9]+$/) || name.match(/^[0-9]+$/) || name.split(" ").length < 2 | name.split(" ").length > 3) {
        return res.status(404).json({
            success: false,
            message: 'Name is not valid'
        })
    }

    let user = new Model({
        name: name,
        mail: mail,
        discord_id: discord_id
    })

    try {
        await user.save();
        return res.status(200).json({
            success: true,
            message: 'User created'
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'User not created'
        })
    }
}