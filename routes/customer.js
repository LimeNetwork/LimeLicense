const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer');

// Create a new customer
router.post('/', customerController.createCustomer);

// Get all customers
router.get('/', customerController.getAllCustomers);

// Get a specific customer by ID
router.get('/:customerId', customerController.getCustomerById);

// Update a customer by ID
router.put('/:customerId', customerController.updateCustomerById);

// Delete a customer by ID
router.delete('/:customerId', customerController.deleteCustomerById);

module.exports = router;