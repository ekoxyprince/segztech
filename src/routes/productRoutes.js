// Product Routes

const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

router.get('/', productController.getProductListing);
router.get('/categories', productController.getCategories);
router.get('/categories/:slug', productController.getCategoryListing);
router.get('/:slug', productController.getProductDetail);

module.exports = router;
