// Order Routes

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

// Checkout routes
router.get('/checkout', orderController.getCheckout);
router.post('/checkout', orderController.postCheckout);

// Direct order (buy now)
router.post('/order-now', orderController.directOrder);

// Order tracking (public)
router.get('/track', orderController.getTrackOrder);
router.get('/track/:orderNumber', orderController.trackOrder);

// All other order routes require authentication
router.use(orderController.isAuthenticated);

// Order list and details
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderDetail);
router.post('/:id/cancel', orderController.cancelOrder);

module.exports = router;
