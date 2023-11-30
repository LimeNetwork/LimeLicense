const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer');

// Create a new customer
router.post('/create', customerController.createCustomer);

// Get all customers
router.get('/', customerController.getAllCustomers);

// Get a specific customer by ID
router.get('/:customerId', customerController.getCustomerById);

// Update a customer by ID
router.put('/:customerId', customerController.updateCustomerById);

// Delete a customer by ID
router.delete('/:customerId', customerController.deleteCustomerById);

// Get a specific customer by Discord ID
router.get('/discord/:discordId', customerController.getCustomerByDiscordId);

// addProductToCustomer
router.post('/addProduct', customerController.addProductToCustomer);

// removeProductFromCustomer
router.post('/removeProduct', customerController.removeProductFromCustomer);

// addTokenToCustomer
router.post('/addToken', customerController.addTokenToCustomer);

// removeTokenFromCustomer
router.post('/removeToken', customerController.removeTokenFromCustomer);

module.exports = router;