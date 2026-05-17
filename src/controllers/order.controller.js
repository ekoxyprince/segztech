// Order Controller - Handles order-related requests

const { orderService, userService } = require('../database/service');
const analyticsService = require('../services/analytics.service');
const { productService } = require('../database/service');
const notificationService = require('../services/notification.service');

function formatOrder(order) {
  const data = order.toJSON ? order.toJSON() : order;
  const addr = data.shippingAddress ? (data.shippingAddress.toJSON ? data.shippingAddress.toJSON() : data.shippingAddress) : null;
  const items = (data.items || []).map(item => {
    const i = item.toJSON ? item.toJSON() : item;
    return { ...i, price: parseFloat(i.price) || 0, quantity: parseInt(i.quantity) || 0, subtotal: parseFloat(i.subtotal) || 0 };
  });
  const timeline = (data.timeline || []).map(t => {
    const tl = t.toJSON ? t.toJSON() : t;
    return { ...tl, createdAt: tl.created_at };
  });
  return {
    id: data.id,
    orderNumber: data.order_number || '',
    userId: data.user_id,
    subtotal: parseFloat(data.subtotal) || 0,
    shippingCost: parseFloat(data.shipping_cost) || 0,
    shippingLabel: data.shipping_label || '',
    tax: parseFloat(data.tax) || 0,
    total: parseFloat(data.total) || 0,
    status: data.status || 'pending',
    paymentStatus: data.payment_status || 'pending',
    paymentMethod: data.payment_method || '',
    shippingCarrier: data.shipping_carrier || '',
    trackingNumber: data.tracking_number || '',
    estimatedDelivery: data.estimated_delivery,
    deliveredAt: data.delivered_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    notes: data.notes || '',
    shippingAddress: addr ? {
      fullName: addr.full_name || '',
      phone: addr.phone || '',
      email: addr.email || '',
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      zipCode: addr.zip_code || '',
      country: addr.country || 'United States'
    } : { fullName: '', phone: '', email: '', street: '', city: '', state: '', zipCode: '', country: '' },
    items: items,
    timeline: timeline
  };
}

class OrderController {
  isAuthenticated(req, res, next) {
    if (req.session.user) {
      return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect('/auth/login');
  }

  async getOrders(req, res) {
    try {
      const { status, page } = req.query;
      const userId = req.session.user.id;
      
      const result = await orderService.getUserOrders(userId, { status, page });
      const allOrders = await orderService.getUserOrders(userId, { limit: 1000 });
      
      const formattedOrders = result.orders.map(o => formatOrder(o));
      const formattedAllOrders = allOrders.orders.map(o => formatOrder(o));
      
      const stats = {
        total: allOrders.totalOrders,
        pending: formattedAllOrders.filter(o => o.status === 'pending').length,
        processing: formattedAllOrders.filter(o => o.status === 'processing').length,
        shipped: formattedAllOrders.filter(o => o.status === 'shipped').length,
        delivered: formattedAllOrders.filter(o => o.status === 'delivered').length,
        cancelled: formattedAllOrders.filter(o => o.status === 'cancelled').length,
        totalSpent: formattedAllOrders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0)
      };
      
      const userData = {
        firstName: req.session.user.first_name || '',
        lastName: req.session.user.last_name || '',
        email: req.session.user.email || '',
        avatar: req.session.user.avatar || '/images/default-avatar.png'
      };
      
      res.render('pages/user/orders', {
        title: 'My Orders - SegzTech',
        currentRoute: 'orders',
        user: userData,
        orders: formattedOrders,
        pagination: {
          totalOrders: result.totalOrders,
          totalPages: result.totalPages,
          currentPage: result.currentPage
        },
        filters: { status },
        stats
      });
    } catch (error) {
      console.error('Error loading orders:', error);
      const userData = req.session.user ? {
        firstName: req.session.user.first_name || '',
        lastName: req.session.user.last_name || '',
        email: req.session.user.email || '',
        avatar: req.session.user.avatar || '/images/default-avatar.png'
      } : null;
      res.render('pages/user/orders', {
        title: 'My Orders - SegzTech',
        currentRoute: 'orders',
        user: userData,
        orders: [],
        pagination: { totalOrders: 0, totalPages: 0, currentPage: 1 },
        filters: { status: null },
        stats: { total: 0, totalSpent: 0 }
      });
    }
  }

  async getOrderDetail(req, res) {
    try {
      const { id } = req.params;
      const userId = req.session.user.id;
      const success = req.query.success === 'true';
      
      const order = await orderService.getOrderById(id, userId);
      
      if (!order) {
        return res.status(404).render('pages/404', {
          title: 'Order Not Found',
          currentRoute: 'orders'
        });
      }
      
      res.render('pages/user/order-detail', {
        title: `Order ${order.order_number} - SegzTech`,
        currentRoute: 'orders',
        order: formatOrder(order),
        success
      });
    } catch (error) {
      console.error('Error loading order:', error);
      res.status(500).render('pages/error', {
        title: 'Error',
        message: 'Unable to load order',
        currentRoute: ''
      });
    }
  }

  async getCheckout(req, res) {
    if (!req.session.user) {
      req.session.returnTo = '/checkout';
      return res.redirect('/auth/login');
    }
    
    const cart = req.session.cart || [];
    
    if (cart.length === 0) {
      return res.redirect('/cart');
    }
    
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const shippingCost = subtotal >= 100 ? 0 : 9.99;
    const tax = subtotal * 0.1;
    const total = subtotal + shippingCost + tax;
    
    try {
      const addresses = await userService.getAddresses(req.session.user.id);
      const formattedAddresses = addresses.map(addr => {
        const a = addr.toJSON ? addr.toJSON() : addr;
        return {
          id: a.id,
          label: a.label || '',
          fullName: a.full_name || '',
          phone: a.phone || '',
          street: a.street || '',
          city: a.city || '',
          state: a.state || '',
          zipCode: a.zip_code || '',
          country: a.country || 'United States',
          isDefault: a.is_default || false
        };
      });
      
      res.render('pages/checkout', {
        title: 'Checkout - SegzTech',
        currentRoute: 'checkout',
        cart,
        totals: { subtotal, shippingCost, tax, total, shippingLabel: shippingCost === 0 ? 'Free Shipping' : 'Standard Shipping' },
        addresses: formattedAddresses,
        whatsappNumber: process.env.WHATSAPP_NUMBER || '15551234567',
        error: req.query.error || null
      });
    } catch (error) {
      console.error('Checkout error:', error);
      res.render('pages/checkout', {
        title: 'Checkout - SegzTech',
        currentRoute: 'checkout',
        cart,
        totals: { subtotal, shippingCost, tax, total, shippingLabel: shippingCost === 0 ? 'Free Shipping' : 'Standard Shipping' },
        addresses: [],
        error: 'Failed to load addresses'
      });
    }
  }

  async postCheckout(req, res) {
    if (!req.session.user) {
      req.session.returnTo = '/checkout';
      return res.redirect('/auth/login');
    }
    
    const cart = req.session.cart || [];
    if (cart.length === 0) {
      return res.redirect('/cart');
    }
    
    let shippingAddress;
    const { shippingAddressId, fullName, phone, street, city, state, zipCode, country, paymentMethod, shippingMethod } = req.body;
    
    if (shippingAddressId) {
      const address = await userService.getAddressById(shippingAddressId, req.session.user.id);
      if (!address) {
        return res.redirect('/orders/checkout?error=Selected address not found');
      }
      shippingAddress = {
        fullName: address.full_name,
        phone: address.phone,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zip_code,
        country: address.country,
        email: address.email || req.session.user.email
      };
    } else {
      if (!fullName || !phone || !street || !city || !state || !zipCode) {
        return res.redirect('/orders/checkout?error=Please fill in all address fields');
      }
      shippingAddress = { fullName, phone, street, city, state, zipCode, country, email: req.session.user.email };
    }
    
    try {
      const result = await orderService.createOrder(req.session, {
        shippingAddress,
        paymentMethod,
        shippingMethod
      });
      
      if (!result.success) {
        return res.redirect('/orders/checkout?error=' + encodeURIComponent(result.message));
      }
      
      await notificationService.createNotification('order', 'New Order Placed', `Order ${result.orderNumber} placed by ${shippingAddress.fullName} for ₦${result.order.total}`, {
        orderId: result.orderId,
        orderNumber: result.orderNumber,
        customerName: shippingAddress.fullName,
        customerEmail: shippingAddress.email,
        total: result.order.total
      });
      
      const sessionId = req.cookies?.segz_session || req.sessionID;
      if (sessionId && result.order) {
        const items = result.order.items || [];
        for (const item of items) {
          analyticsService.trackActivity(sessionId, req, {
            type: 'checkout_complete',
            productId: item.product_id || item.productId,
            productName: item.name || item.product_name,
            price: item.price,
            category: item.category,
            brand: item.brand
          }).catch(() => {});
        }
      }
      
      const whatsappNumber = (process.env.WHATSAPP_NUMBER || '15551234567').replace(/[^0-9]/g, '');
      const orderItems = (result.order && result.order.items) || [];
      let message = `🛒 *New Order: ${result.orderNumber}*\n\n`;
      message += `👤 *Customer:* ${shippingAddress.fullName}\n`;
      message += `📞 *Phone:* ${shippingAddress.phone}\n\n`;
      message += `📦 *Items:*\n`;
      for (const item of orderItems) {
        message += `• ${item.name} x${item.quantity} - ₦${(parseFloat(item.price) * item.quantity).toFixed(2)}\n`;
      }
      message += `\n💰 *Total:* ₦${result.order.total}\n`;
      message += `📍 *Address:* ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}\n`;
      message += `\nPlease confirm my order. Thank you!`;
      
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      res.redirect(whatsappUrl);
    } catch (error) {
      console.error('Checkout error:', error);
      res.redirect('/orders/checkout?error=' + encodeURIComponent('Failed to place order'));
    }
  }

  async directOrder(req, res) {
    try {
      const { productId, quantity = 1, fullName, phone, street, city, state, zipCode } = req.body;
      
      const product = await productService.getProductById(productId);
      if (!product) {
        return res.json({ success: false, message: 'Product not found' });
      }
      
      if (!req.session.user) {
        return res.json({ success: false, message: 'Please login to place order' });
      }
      
      const cartService = require('../services/cart.service');
      await cartService.addToCart(req.session, productId, parseInt(quantity));
      
      const orderResult = await orderService.createOrder(req.session, {
        shippingAddress: {
          fullName: fullName || (req.session.user.first_name + ' ' + req.session.user.last_name),
          phone: phone || req.session.user.phone || '',
          street: street || '',
          city: city || '',
          state: state || '',
          zipCode: zipCode || ''
        },
        paymentMethod: 'cash_on_delivery',
        shippingMethod: 'standard'
      });
      
      if (!orderResult.success) {
        return res.json({ success: false, message: orderResult.message });
      }
      
      const whatsappNumber = (process.env.WHATSAPP_NUMBER || '15551234567').replace(/[^0-9]/g, '');
      const orderItems = (orderResult.order && orderResult.order.items) || [];
      let message = `🛒 *New Order: ${orderResult.orderNumber}*\n\n`;
      message += `👤 *Customer:* ${fullName || req.session.user.first_name + ' ' + req.session.user.last_name}\n`;
      message += `📞 *Phone:* ${phone || 'N/A'}\n\n`;
      message += `📦 *Items:*\n`;
      for (const item of orderItems) {
        message += `• ${item.name} x${item.quantity} - ₦${(parseFloat(item.price) * item.quantity).toFixed(2)}\n`;
      }
      message += `\n💰 *Total:* ₦${orderResult.order.total}\n`;
      message += `\nPlease confirm my order. Thank you!`;
      
      res.json({ success: true, orderId: orderResult.orderId, orderNumber: orderResult.order.order_number, whatsappUrl: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}` });
    } catch (error) {
      console.error('Direct order error:', error);
      res.status(500).json({ success: false, message: 'Failed to place order' });
    }
  }

  async cancelOrder(req, res) {
    try {
      const { id } = req.params;
      const userId = req.session.user.id;
      
      const order = await orderService.getOrderById(id, userId);
      if (!order) {
        return res.redirect('/orders?error=Order not found');
      }
      
      if (!['pending', 'processing'].includes(order.status)) {
        return res.redirect(`/orders/${id}?error=Cannot cancel this order`);
      }
      
      await orderService.updateOrderStatus(id, 'cancelled');
      
      res.redirect(`/orders/${id}?cancelled=true`);
    } catch (error) {
      console.error('Cancel order error:', error);
      res.redirect('/orders?error=Failed to cancel order');
    }
  }

  async getTrackOrder(req, res) {
    try {
      res.render('pages/track-order', {
        title: 'Track Your Order - SegzTech',
        currentRoute: '',
        order: null,
        orderNumber: null
      });
    } catch (error) {
      console.error('Track order error:', error);
      res.status(500).render('pages/error', {
        title: 'Error',
        message: 'Unable to load tracking page',
        currentRoute: ''
      });
    }
  }

  async trackOrder(req, res) {
    try {
      const { orderNumber } = req.params;
      const order = await orderService.getOrderByOrderNumber(orderNumber);
      
      let timeline = [];
      if (order) {
        timeline = await orderService.getOrderTimeline(order.id);
      }
      
      const formattedOrder = order ? formatOrder({ ...order, timeline }) : null;
      
      res.render('pages/track-order', {
        title: `Track Order ${orderNumber} - SegzTech`,
        currentRoute: '',
        order: formattedOrder,
        orderNumber,
        timeline: formattedOrder ? formattedOrder.timeline : []
      });
    } catch (error) {
      console.error('Track order error:', error);
      res.status(500).render('pages/error', {
        title: 'Error',
        message: 'Unable to track order',
        currentRoute: ''
      });
    }
  }
}

module.exports = new OrderController();
