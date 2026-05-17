// Wishlist Controller - Handles wishlist-related requests

const cartService = require('../services/cart.service');

function formatSessionUser(sessionUser) {
  if (!sessionUser) return null;
  return {
    id: sessionUser.id,
    firstName: sessionUser.first_name || '',
    lastName: sessionUser.last_name || '',
    email: sessionUser.email || '',
    phone: sessionUser.phone || '',
    avatar: sessionUser.avatar || '/images/default-avatar.png',
    role: sessionUser.role || 'user'
  };
}

class WishlistController {
  getWishlist(req, res) {
    try {
      const wishlist = req.session.wishlist || [];
      
      res.render('pages/user/wishlist', {
        title: 'My Wishlist - SegzTech',
        currentRoute: 'wishlist',
        user: formatSessionUser(req.session.user),
        wishlistItems: wishlist
      });
    } catch (error) {
      console.error('Wishlist error:', error);
      res.status(500).render('pages/error', {
        title: 'Error',
        message: 'Unable to load wishlist',
        currentRoute: 'wishlist'
      });
    }
  }
  
  addToWishlist(req, res) {
    try {
      const { productId } = req.body;
      
      if (!req.session.wishlist) {
        req.session.wishlist = [];
      }
      
      if (!req.session.wishlist.includes(productId)) {
        req.session.wishlist.push(productId);
      }
      
      const result = { success: true, message: 'Added to wishlist' };
      
      if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return res.json({
          ...result,
          wishlistCount: req.session.wishlist.length
        });
      }
      
      res.redirect('back');
    } catch (error) {
      console.error('Add to wishlist error:', error);
      res.status(500).json({ success: false, message: 'Failed to add to wishlist' });
    }
  }
  
  removeFromWishlist(req, res) {
    try {
      const { productId } = req.body;
      
      if (req.session.wishlist) {
        req.session.wishlist = req.session.wishlist.filter(id => id !== productId);
      }
      
      const result = { success: true, message: 'Removed from wishlist' };
      
      if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return res.json({
          ...result,
          wishlistCount: req.session.wishlist ? req.session.wishlist.length : 0
        });
      }
      
      res.redirect('/wishlist');
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      res.status(500).json({ success: false, message: 'Failed to remove from wishlist' });
    }
  }
  
  toggleWishlist(req, res) {
    try {
      const { productId } = req.body;
      
      if (!req.session.wishlist) {
        req.session.wishlist = [];
      }
      
      const index = req.session.wishlist.indexOf(productId);
      let success = true;
      let message = '';
      
      if (index > -1) {
        req.session.wishlist.splice(index, 1);
        message = 'Removed from wishlist';
      } else {
        req.session.wishlist.push(productId);
        message = 'Added to wishlist';
      }
      
      if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
        return res.json({
          success,
          message,
          isInWishlist: index === -1,
          wishlistCount: req.session.wishlist.length
        });
      }
      
      res.redirect('back');
    } catch (error) {
      console.error('Toggle wishlist error:', error);
      res.status(500).json({ success: false, message: 'Failed to toggle wishlist' });
    }
  }
  
  async moveToCart(req, res) {
    try {
      const { productId } = req.body;
      
      if (productId) {
        const result = await cartService.addToCart(req.session, productId, 1);
        if (result.success && req.session.wishlist) {
          req.session.wishlist = req.session.wishlist.filter(id => id !== productId);
        }
        
        if (req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest') {
          return res.json({
            ...result,
            wishlistCount: req.session.wishlist ? req.session.wishlist.length : 0,
            cartCount: cartService.getCartCount(req.session)
          });
        }
      }
      
      res.redirect('/wishlist');
    } catch (error) {
      console.error('Move to cart error:', error);
      res.status(500).json({ success: false, message: 'Failed to move to cart' });
    }
  }
  
  clearWishlist(req, res) {
    req.session.wishlist = [];
    res.redirect('/wishlist');
  }
  
  checkWishlist(req, res) {
    try {
      const { productId } = req.params;
      const isInWishlist = req.session.wishlist ? req.session.wishlist.includes(productId) : false;
      
      res.json({ isInWishlist });
    } catch (error) {
      console.error('Check wishlist error:', error);
      res.json({ isInWishlist: false });
    }
  }
}

module.exports = new WishlistController();
