// Cart Controller - Handles cart-related requests

const cartService = require('../services/cart.service');
const analyticsService = require('../services/analytics.service');

class CartController {
  async getCart(req, res) {
    try {
      const cart = cartService.getCart(req.session);
      const totals = cartService.getCartTotals(req.session);
      const validation = await cartService.validateCart(req.session);
      
      res.render('pages/cart', {
        title: 'Shopping Cart - SegzTech',
        currentRoute: 'cart',
        cart,
        totals,
        validation,
        success: req.query.added ? 'Item added to cart' : null
      });
    } catch (error) {
      console.error('Cart error:', error);
      res.status(500).render('pages/error', {
        title: 'Error',
        message: 'Unable to load cart',
        currentRoute: ''
      });
    }
  }
  
  async addToCart(req, res) {
    try {
      const { productId, quantity = 1 } = req.body;
      const result = await cartService.addToCart(req.session, productId, parseInt(quantity));
      
      if (result.success) {
        const sessionId = req.cookies?.segz_session || req.sessionID;
        if (sessionId) {
          analyticsService.trackActivity(sessionId, req, {
            type: 'add_to_cart',
            productId: productId,
            price: result.item?.price
          }).catch(() => {});
        }
      }
      
      if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return res.json(result);
      }
      
      if (result.success) {
        res.redirect('/cart?added=true');
      } else {
        res.redirect('/cart?error=' + encodeURIComponent(result.message));
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      res.status(500).json({ success: false, message: 'Failed to add to cart' });
    }
  }
  
  async updateCart(req, res) {
    try {
      const { productId, quantity } = req.body;
      const result = await cartService.updateQuantity(req.session, productId, parseInt(quantity));
      
      if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return res.json({
          ...result,
          cartCount: cartService.getCartCount(req.session),
          totals: cartService.getCartTotals(req.session)
        });
      }
      
      res.redirect('/cart');
    } catch (error) {
      console.error('Update cart error:', error);
      res.status(500).json({ success: false, message: 'Failed to update cart' });
    }
  }
  
  async removeFromCart(req, res) {
    try {
      const { productId } = req.body;
      const result = cartService.removeFromCart(req.session, productId);
      
      if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return res.json({
          ...result,
          cartCount: cartService.getCartCount(req.session),
          totals: cartService.getCartTotals(req.session)
        });
      }
      
      res.redirect('/cart');
    } catch (error) {
      console.error('Remove from cart error:', error);
      res.status(500).json({ success: false, message: 'Failed to remove from cart' });
    }
  }
  
  clearCart(req, res) {
    cartService.clearCart(req.session);
    res.redirect('/cart');
  }
  
  getCartCount(req, res) {
    try {
      const count = cartService.getCartCount(req.session);
      const totals = cartService.getCartTotals(req.session);
      
      res.json({ count, totals });
    } catch (error) {
      console.error('Cart count error:', error);
      res.json({ count: 0, totals: {} });
    }
  }
}

module.exports = new CartController();
