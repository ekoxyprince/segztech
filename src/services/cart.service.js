// Cart Service - Shopping cart logic

const { productService } = require('../database/service');

class CartService {
  getCart(session) {
    return session.cart || [];
  }
  
  async addToCart(session, productId, quantity = 1) {
    if (!session.cart) {
      session.cart = [];
    }
    
    const product = await productService.getProductById(productId);
    if (!product) {
      return { success: false, message: 'Product not found' };
    }
    
    if (product.stock < quantity) {
      return { success: false, message: 'Not enough stock available' };
    }
    
    const existingItemIndex = session.cart.findIndex(item => item.productId === productId);
    
    if (existingItemIndex > -1) {
      const newQuantity = session.cart[existingItemIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        return { success: false, message: 'Cannot add more than available stock' };
      }
      
      session.cart[existingItemIndex].quantity = newQuantity;
      session.cart[existingItemIndex].subtotal = newQuantity * session.cart[existingItemIndex].price;
    } else {
      const imageUrl = product.images && product.images.length > 0 
        ? (product.images[0].image_url || product.images[0])
        : '/images/placeholder.jpg';
      
      session.cart.push({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: imageUrl,
        price: parseFloat(product.price),
        originalPrice: parseFloat(product.original_price || product.price),
        quantity: quantity,
        subtotal: parseFloat(product.price) * quantity
      });
    }
    
    return { 
      success: true, 
      message: 'Product added to cart',
      cartCount: this.getCartCount(session)
    };
  }
  
  async updateQuantity(session, productId, quantity) {
    if (!session.cart) {
      return { success: false, message: 'Cart is empty' };
    }
    
    const itemIndex = session.cart.findIndex(item => item.productId === productId);
    
    if (itemIndex === -1) {
      return { success: false, message: 'Item not found in cart' };
    }
    
    const product = await productService.getProductById(productId);
    if (!product) {
      return { success: false, message: 'Product not found' };
    }
    
    if (quantity > product.stock) {
      return { success: false, message: 'Not enough stock available' };
    }
    
    if (quantity <= 0) {
      return this.removeFromCart(session, productId);
    }
    
    session.cart[itemIndex].quantity = quantity;
    session.cart[itemIndex].subtotal = session.cart[itemIndex].price * quantity;
    
    return { 
      success: true, 
      message: 'Cart updated',
      cartCount: this.getCartCount(session)
    };
  }
  
  removeFromCart(session, productId) {
    if (!session.cart) {
      return { success: false, message: 'Cart is empty' };
    }
    
    const itemIndex = session.cart.findIndex(item => item.productId === productId);
    
    if (itemIndex === -1) {
      return { success: false, message: 'Item not found in cart' };
    }
    
    session.cart.splice(itemIndex, 1);
    
    return { 
      success: true, 
      message: 'Item removed from cart',
      cartCount: this.getCartCount(session)
    };
  }
  
  clearCart(session) {
    session.cart = [];
    return { success: true, message: 'Cart cleared' };
  }
  
  getCartCount(session) {
    if (!session.cart) return 0;
    return session.cart.reduce((sum, item) => sum + item.quantity, 0);
  }
  
  getCartSubtotal(session) {
    if (!session.cart) return 0;
    return session.cart.reduce((sum, item) => sum + item.subtotal, 0);
  }
  
  getCartTotals(session, shippingMethod = 'standard') {
    const subtotal = this.getCartSubtotal(session);
    
    let shippingCost = 0;
    let shippingLabel = 'Free Shipping';
    
    switch (shippingMethod) {
      case 'express':
        shippingCost = 19.99;
        shippingLabel = 'Express Shipping';
        break;
      case 'standard':
      default:
        if (subtotal >= 100) {
          shippingCost = 0;
          shippingLabel = 'Free Shipping';
        } else {
          shippingCost = 9.99;
          shippingLabel = 'Standard Shipping';
        }
        break;
    }
    
    const taxRate = 0.10;
    const tax = subtotal * taxRate;
    const total = subtotal + shippingCost + tax;
    
    const savings = session.cart ? session.cart.reduce((sum, item) => {
      return sum + ((item.originalPrice - item.price) * item.quantity);
    }, 0) : 0;
    
    return {
      subtotal,
      shippingCost,
      shippingLabel,
      tax,
      total,
      savings,
      itemCount: this.getCartCount(session)
    };
  }
  
  async validateCart(session) {
    if (!session.cart || session.cart.length === 0) {
      return { valid: false, message: 'Cart is empty' };
    }
    
    const issues = [];
    
    for (const item of session.cart) {
      const product = await productService.getProductById(item.productId);
      if (!product) {
        issues.push({ productId: item.productId, message: 'Product no longer available' });
      } else if (product.stock < item.quantity) {
        issues.push({ 
          productId: item.productId, 
          message: `Only ${product.stock} available`,
          availableStock: product.stock
        });
      }
    }
    
    return {
      valid: issues.length === 0,
      issues
    };
  }
}

module.exports = new CartService();
