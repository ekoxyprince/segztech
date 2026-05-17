// API Routes - For AJAX requests

const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api.controller');
const { productService } = require('../database/service');

// Products
router.get('/products', apiController.getProducts);
router.get('/products/search', apiController.searchProducts);
router.get('/products/ai-search', apiController.aiSearchProducts);
router.get('/categories', apiController.getCategories);
router.get('/brands', apiController.getBrands);
router.get('/brands/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const brands = await productService.getBrandsForCategory(category);
    res.json({ success: true, brands });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Product Reviews
router.get('/products/:id/reviews', async (req, res) => {
  try {
    const { productService } = require('../database/service');
    const reviews = await productService.getProductReviews(req.params.id);
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/products/:id/reviews', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ success: false, error: 'Please login to submit a review' });
    }
    const { rating, title, comment } = req.body;
    const { productService } = require('../database/service');
    const review = await productService.createReview(
      req.session.user.id,
      req.params.id,
      parseInt(rating),
      title,
      comment
    );
    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cart
router.get('/cart', apiController.getCart);
router.post('/cart/add', apiController.addToCart);
router.post('/cart/update', apiController.updateCart);
router.delete('/cart/:productId', apiController.removeFromCart);

// Product Hierarchy Cascade API
const hierarchy = require('../config/product-hierarchy');

router.get('/hierarchy/categories', (req, res) => {
  try {
    res.json({ success: true, categories: hierarchy.getCategories() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/hierarchy/brands/:category', (req, res) => {
  try {
    const { category } = req.params;
    const { type } = req.query;
    const brands = type ? hierarchy.getBrandsByType(category, type) : hierarchy.getBrands(category);
    res.json({ success: true, brands });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/hierarchy/types/:category', (req, res) => {
  try {
    const { category } = req.params;
    res.json({ success: true, types: hierarchy.getTypes(category) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/hierarchy/models/:category/:brand', (req, res) => {
  try {
    const { category, brand } = req.params;
    const { type } = req.query;
    const models = type ? hierarchy.getModelsByType(category, brand, type) : hierarchy.getModels(category, brand);
    res.json({ success: true, models });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/hierarchy/series/:category/:brand/:model', (req, res) => {
  try {
    const { category, brand, model } = req.params;
    res.json({ success: true, series: hierarchy.getSeries(category, brand, model) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/hierarchy/defaults/:category/:brand/:model', (req, res) => {
  try {
    const { category, brand, model } = req.params;
    const defaults = hierarchy.getDefaultSpecs(category, brand, model);
    res.json({ success: true, defaultSpecs: defaults });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Wishlist
router.post('/wishlist/toggle', apiController.toggleWishlist);
router.get('/wishlist/check/:productId', apiController.checkWishlist);

module.exports = router;
