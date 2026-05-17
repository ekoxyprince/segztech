// Cart Routes

const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.post('/update', cartController.updateCart);
router.post('/remove', cartController.removeFromCart);
router.post('/clear', cartController.clearCart);
router.get('/count', cartController.getCartCount);

module.exports = router;
