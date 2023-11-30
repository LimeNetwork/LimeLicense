// controllers/customer.js

const Customer = require('../models/customer');
const Product = require('../models/product');
const Token = require('../models/token');

// Create a new customer
exports.createCustomer = async(req, res) => {
    try {
        // Check for email duplication before creating a new customer
        let existingCustomer = await Customer.findOne({ mail: req.body.mail });
        if (existingCustomer) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        existingCustomer = await Customer.findOne({ discord_id: req.body.discord_id });
        if (existingCustomer) {
            return res.status(400).json({ success: false, message: 'Discord Id already exists' });
        }

        const newCustomer = new Customer(req.body);
        const savedCustomer = await newCustomer.save();
        res.status(201).json({ success: true, data: savedCustomer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get all customers
exports.getAllCustomers = async(req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json({ success: true, data: customers });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get a specific customer by ID
exports.getCustomerById = async(req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        res.status(200).json({ success: true, data: customer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update a customer by ID
exports.updateCustomerById = async(req, res) => {
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCustomer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        res.status(200).json({ success: true, data: updatedCustomer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete a customer by ID
exports.deleteCustomerById = async(req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        if (!deletedCustomer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        res.status(204).send({ success: true, data: deletedCustomer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get a specific customer by Discord ID
exports.getCustomerByDiscordId = async(req, res) => {
    try {
        const customer = await Customer.findOne({ discord_id: req.params.discord_id });
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }
        res.status(200).json({ success: true, data: customer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Add product to customer
exports.addProductToCustomer = async(req, res) => {
    try {
        const customer = await Customer.findOne({ id: req.params.id });
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        let product = await Product.find({ id: req.body.product });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        customer.products.push(product._id);
        customer.save();

        res.status(200).json({ success: true, data: customer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Remove product from customer
exports.removeProductFromCustomer = async(req, res) => {
    try {
        const customer = await Customer.findOne({ id: req.params.id });
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        let product = await Product.find({ id: req.body.product });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        customer.products.pull(product._id);
        customer.save();

        res.status(200).json({ success: true, data: customer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Add token to customer
exports.addTokenToCustomer = async(req, res) => {
    try {
        const customer = await Customer.findOne({ id: req.params.id });
        if (!customer) {
            return res.status(404).json({ success: false, message: 'Customer not found' });
        }

        let token = await Token.find({ id: req.body.token });
        if (!token) {
            return res.status(404).json({ success: false, message: 'Token not found' });
        }

        customer.tokens.push(req.body.token);
        customer.save();

        token.customer = customer._id;
        token.save();

        res.status(200).json({
            success: true,
            data: {
                customer: customer,
                token: token
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Remove token from customer
exports.removeTokenFromCustomer = async(req, res) => {

}