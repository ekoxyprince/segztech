// User Routes

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// All user routes require authentication
router.use(userController.isAuthenticated);

// Profile
router.get('/profile', userController.getProfile);
router.post('/profile', userController.postProfile);

// Password
router.get('/password', userController.getPasswordPage);
router.post('/password', userController.postPassword);

// Addresses
router.get('/addresses', userController.getAddresses);
router.post('/addresses/add', userController.addAddress);
router.post('/addresses/:id/update', userController.updateAddress);
router.post('/addresses/:id/delete', userController.deleteAddress);
router.post('/addresses/:id/default', userController.setDefaultAddress);

module.exports = router;
