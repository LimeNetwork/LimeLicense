// controllers/customer.js

const Customer = require('../models/customer');

// Create a new customer
exports.createCustomer = async(req, res) => {
    try {
        // Check for email duplication before creating a new customer
        let existingCustomer = await Customer.findOne({ mail: req.body.mail });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        existingCustomer = await Customer.findOne({ discord_id: req.body.discord_id });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Discord Id already exists' });
        }

        const newCustomer = new Customer(req.body);
        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all customers
exports.getAllCustomers = async(req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific customer by ID
exports.getCustomerById = async(req, res) => {
    try {
        const customer = await Customer.findById(req.params.customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a customer by ID
exports.updateCustomerById = async(req, res) => {
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(req.params.customerId, req.body, { new: true });
        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a customer by ID
exports.deleteCustomerById = async(req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.customerId);
        if (!deletedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};