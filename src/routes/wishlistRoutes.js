// Wishlist Routes

const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');

// All wishlist routes
router.get('/', wishlistController.getWishlist);
router.post('/add', wishlistController.addToWishlist);
router.post('/remove', wishlistController.removeFromWishlist);
router.post('/toggle', wishlistController.toggleWishlist);
router.post('/move-to-cart', wishlistController.moveToCart);
router.post('/clear', wishlistController.clearWishlist);
router.get('/check/:productId', wishlistController.checkWishlist);

module.exports = router;
