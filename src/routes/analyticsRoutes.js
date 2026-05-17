// Analytics API Routes
const express = require('express');
const router = express.Router();
const analyticsService = require('../services/analytics.service');
const recommendationEngine = require('../services/recommendation.service');

function getSessionId(req) {
  return req.cookies?.segz_session || req.sessionID || req.headers['x-session-id'] || req.session.id;
}

// Initialize tracking session
router.post('/session', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'No session ID' });
    }
    
    await analyticsService.trackActivity(sessionId, req, {
      type: 'page_view',
      pageName: req.body.url || req.originalUrl
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Session tracking error:', error);
    res.status(500).json({ success: false });
  }
});

// Track general activity
router.post('/track', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    
    if (!sessionId) {
      return res.json({ success: true });
    }
    
    const activityData = req.body || {};
    const activityType = activityData.type;
    
    if (!activityType) {
      return res.json({ success: true });
    }
    
    switch (activityType) {
      case 'product_view':
        await analyticsService.trackActivity(sessionId, req, {
          type: 'product_view',
          productId: activityData.productId,
          productName: activityData.productName,
          price: activityData.price,
          category: activityData.category,
          brand: activityData.brand
        });
        break;
        
      case 'add_to_cart':
        await analyticsService.trackActivity(sessionId, req, {
          type: 'add_to_cart',
          productId: activityData.productId,
          productName: activityData.productName,
          price: activityData.price
        });
        break;
        
      case 'remove_from_cart':
        await analyticsService.trackActivity(sessionId, req, {
          type: 'remove_from_cart',
          productId: activityData.productId
        });
        break;
        
      case 'wishlist_add':
        await analyticsService.trackActivity(sessionId, req, {
          type: 'wishlist_add',
          productId: activityData.productId
        });
        break;
        
      case 'wishlist_remove':
        await analyticsService.trackActivity(sessionId, req, {
          type: 'wishlist_remove',
          productId: activityData.productId
        });
        break;
        
      case 'search':
        await analyticsService.trackSearch(sessionId, req, {
          query: activityData.query,
          resultsCount: activityData.resultsCount,
          clickedProductId: activityData.clickedProductId,
          aiEnhanced: activityData.aiEnhanced
        });
        break;
        
      case 'scroll_depth':
        await analyticsService.trackActivity(sessionId, req, {
          type: 'scroll_depth',
          scrollDepth: activityData.depth
        });
        break;
        
      case 'time_on_page':
        await analyticsService.trackActivity(sessionId, req, {
          type: 'time_on_page',
          timeOnPage: activityData.seconds
        });
        break;
        
      case 'click':
      case 'exit':
      case 'page_view':
        await analyticsService.trackActivity(sessionId, req, {
          type: activityType,
          url: activityData.url,
          scrollDepth: activityData.scrollDepth,
          timeOnPage: activityData.timeSpent
        });
        break;
        
      default:
        await analyticsService.trackActivity(sessionId, req, {
          type: activityType,
          metadata: activityData
        });
        break;
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Track error:', error);
    res.status(500).json({ success: false });
  }
});

// Get personalized recommendations
router.get('/recommendations', async (req, res) => {
  try {
    const sessionId = req.sessionID || req.cookies?.segz_session;
    const userId = req.session?.user?.id;
    const { type = 'personalized', productId, limit = 10 } = req.query;
    
    let recommendations = [];
    
    switch (type) {
      case 'complementary':
        if (productId) {
          recommendations = await recommendationEngine.getComplementaryProducts(productId, null, parseInt(limit));
        }
        break;
      case 'frequently_bought':
        if (productId) {
          recommendations = await recommendationEngine.getFrequentlyBoughtTogether(productId, parseInt(limit));
        }
        break;
      case 'viewed_together':
        if (productId && sessionId) {
          recommendations = await recommendationEngine.getViewedTogether(productId, sessionId, parseInt(limit));
        }
        break;
      case 'trending':
        recommendations = await recommendationEngine.getTrendingProducts(parseInt(limit));
        break;
      case 'personalized':
      default:
        recommendations = await recommendationEngine.getPersonalizedRecommendations(sessionId, userId, parseInt(limit));
        break;
    }
    
    res.json({ success: true, recommendations });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ success: false });
  }
});

// Get checkout upsells
router.get('/upsells', async (req, res) => {
  try {
    const cartItems = req.session.cart || [];
    
    if (cartItems.length === 0) {
      return res.json({ success: true, upsells: [] });
    }
    
    const upsells = await recommendationEngine.getCheckoutUpsells(cartItems, 3);
    
    res.json({ success: true, upsells });
  } catch (error) {
    console.error('Upsells error:', error);
    res.status(500).json({ success: false });
  }
});

// Add upsell to cart
router.post('/add-upsell', async (req, res) => {
  try {
    const { productId } = req.body;
    const cartService = require('../services/cart.service');
    
    const result = await cartService.addToCart(req.session, productId, 1);
    
    res.json(result);
  } catch (error) {
    console.error('Add upsell error:', error);
    res.status(500).json({ success: false });
  }
});

// Get enhanced search results
router.get('/search-enhanced', async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.session?.user?.id;
    const session = await require('../database/models').UserSession.findOne({
      where: { session_id: req.sessionID || req.cookies?.segz_session }
    });
    
    const results = await recommendationEngine.enhanceSearchResults(
      q,
      userId,
      session?.region,
      20
    );
    
    res.json({ success: true, results });
  } catch (error) {
    console.error('Search enhancement error:', error);
    res.status(500).json({ success: false });
  }
});

// Get top searches
router.get('/top-searches', async (req, res) => {
  try {
    const { limit = 10, days = 7 } = req.query;
    const searches = await analyticsService.getTopSearches(parseInt(limit), parseInt(days));
    
    res.json({ success: true, searches });
  } catch (error) {
    console.error('Top searches error:', error);
    res.status(500).json({ success: false });
  }
});

// Get top products
router.get('/top-products', async (req, res) => {
  try {
    const { limit = 10, days = 7, metric = 'views' } = req.query;
    const products = await analyticsService.getTopProducts(parseInt(limit), parseInt(days), metric);
    
    res.json({ success: true, products });
  } catch (error) {
    console.error('Top products error:', error);
    res.status(500).json({ success: false });
  }
});

// Get regional insights
router.get('/regional', async (req, res) => {
  try {
    const insights = await analyticsService.getRegionalInsights();
    res.json({ success: true, insights });
  } catch (error) {
    console.error('Regional insights error:', error);
    res.status(500).json({ success: false });
  }
});

// Get dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const stats = await analyticsService.getDashboardStats(parseInt(days));
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
