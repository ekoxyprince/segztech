// Admin Controller
const { productService, orderService, userService } = require('../database/service');
const hierarchy = require('../config/product-hierarchy');
const categorySpecs = require('../config/category-specs.json');
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

function formatUser(user) {
  const data = user.toJSON ? user.toJSON() : user;
  return {
    id: data.id,
    firstName: data.first_name || '',
    lastName: data.last_name || '',
    email: data.email || '',
    phone: data.phone || '',
    avatar: data.avatar || '',
    role: data.role || 'user',
    status: data.status || 'active',
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

// Admin Login Page
const getLogin = (req, res) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return res.redirect('/admin/dashboard');
  }
  
  res.render('admin/login', {
    title: 'Admin Login',
    error: null
  });
};

// Admin Login Process
const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await userService.findByEmail(email);
    
    if (!user) {
      return res.render('admin/login', {
        title: 'Admin Login',
        error: 'Invalid email or password'
      });
    }
    
    const bcrypt = require('bcryptjs');
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res.render('admin/login', {
        title: 'Admin Login',
        error: 'Invalid email or password'
      });
    }
    
    if (user.role !== 'admin') {
      return res.render('admin/login', {
        title: 'Admin Login',
        error: 'Access denied. Admin credentials required.'
      });
    }
    
    req.session.user = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      avatar: user.avatar,
      role: user.role
    };
    
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Admin login error:', error);
    res.render('admin/login', {
      title: 'Admin Login',
      error: 'An error occurred'
    });
  }
};

// Admin Logout
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
};

// Helper to render admin pages with layout
const renderPage = (res, view, title, page, extraData = {}) => {
  res.render(view, {
    title,
    page,
    user: res.locals.user,
    layout: false,
    ...extraData
  }, (err, body) => {
    if (err) {
      console.error('Error rendering view:', err);
      return res.status(500).send('Error rendering page');
    }
    res.render('admin-layout', {
      title,
      page,
      user: res.locals.user,
      body: body,
      ...extraData
    });
  });
};

// Dashboard
const getDashboard = async (req, res) => {
  try {
    const [productsResult, orders, users] = await Promise.all([
      productService.getAllProducts({ limit: 1000 }),
      orderService.getAllOrders(),
      userService.getAllUsers()
    ]);
    
    const products = productsResult.products || [];
    
    const stats = {
      totalProducts: productsResult.totalProducts,
      totalOrders: orders.length,
      totalUsers: users.length,
      totalRevenue: orders.filter(o => o.status === 'delivered').reduce((sum, order) => sum + parseFloat(order.total), 0),
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      lowStockProducts: products.filter(p => p.stock < 10).length
    };
    
    const recentOrders = orders.slice(0, 10).map(o => formatOrder(o));
    
    renderPage(res, 'admin/dashboard', 'Dashboard', 'dashboard', { stats, recentOrders });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.redirect('/admin/login');
  }
};

// Products
const getProducts = async (req, res) => {
  try {
    const [productsResult, categories] = await Promise.all([
      productService.getAllProducts({ limit: 1000 }),
      productService.getCategories()
    ]);
    
    const products = productsResult.products || [];
    
    renderPage(res, 'admin/products', 'Products', 'products', { products, categories, hierarchy, categorySpecs });
  } catch (error) {
    console.error('Products error:', error);
    renderPage(res, 'admin/products', 'Products', 'products', { products: [], categories: [], hierarchy, categorySpecs });
  }
};

const getNewProduct = async (req, res) => {
  try {
    const categories = await productService.getCategories();
    renderPage(res, 'admin/product-form', 'Add Product', 'products', { product: null, categories, hierarchy, categorySpecs });
  } catch (error) {
    console.error('New product error:', error);
    renderPage(res, 'admin/product-form', 'Add Product', 'products', { product: null, categories: [], hierarchy, categorySpecs });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, brand, category, subcategory, model, series, condition, shortDescription, description, price, originalPrice, stock, sku, isFeatured, isFlashSale, isHotPick, notifyUsers, specs } = req.body;
    
    let parsedSpecs = {};
    if (specs) {
      try { parsedSpecs = typeof specs === 'string' ? JSON.parse(specs) : specs; } catch (e) {}
    }
    
    await productService.createProduct({
      name,
      brand,
      category_id: category,
      subcategory: subcategory || '',
      model_name: model || '',
      series: series || '',
      condition: condition || 'new',
      shortDescription: shortDescription || '',
      description,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
      stock: parseInt(stock),
      sku: sku || '',
      isFeatured: isFeatured === 'on',
      isFlashSale: isFlashSale === 'on',
      isHotPick: isHotPick === 'on',
      tags: [],
      specs: parsedSpecs
    });
    
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Create product error:', error);
    res.redirect('/admin/products');
  }
};

const getEditProduct = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    const categories = await productService.getCategories();
    
    if (!product) {
      return res.redirect('/admin/products');
    }
    
    renderPage(res, 'admin/product-form', 'Edit Product', 'products', { product, categories, hierarchy, categorySpecs });
  } catch (error) {
    console.error('Edit product error:', error);
    res.redirect('/admin/products');
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, brand, category, subcategory, model, series, condition, shortDescription, description, price, originalPrice, stock, sku, isFeatured, isFlashSale, isHotPick, specs } = req.body;
    
    let parsedSpecs = {};
    if (specs) {
      try { parsedSpecs = typeof specs === 'string' ? JSON.parse(specs) : specs; } catch (e) {}
    }
    
    await productService.updateProduct(req.params.id, {
      name,
      brand,
      category_id: category,
      subcategory: subcategory || '',
      model_name: model || '',
      series: series || '',
      condition: condition || 'new',
      shortDescription: shortDescription || '',
      description,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
      stock: parseInt(stock),
      sku: sku || '',
      isFeatured: isFeatured === 'on',
      isFlashSale: isFlashSale === 'on',
      isHotPick: isHotPick === 'on',
      specs: parsedSpecs
    });
    
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Update product error:', error);
    res.redirect('/admin/products');
  }
};

const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Delete product error:', error);
    res.redirect('/admin/products');
  }
};

// Orders
const getOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    const statusFilter = req.query.status;
    
    const formattedOrders = orders.map(o => formatOrder(o));
    const filteredOrders = statusFilter 
      ? formattedOrders.filter(o => o.status === statusFilter)
      : formattedOrders;
    
    renderPage(res, 'admin/orders', 'Orders', 'orders', { orders: filteredOrders });
  } catch (error) {
    console.error('Orders error:', error);
    renderPage(res, 'admin/orders', 'Orders', 'orders', { orders: [] });
  }
};

const getOrderDetail = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    
    if (!order) {
      return res.redirect('/admin/orders');
    }
    
    renderPage(res, 'admin/order-detail', 'Order Details', 'orders', { order: formatOrder(order) });
  } catch (error) {
    console.error('Order detail error:', error);
    res.redirect('/admin/orders');
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await orderService.updateOrderStatus(req.params.id, status);
    res.redirect(`/admin/orders/${req.params.id}`);
  } catch (error) {
    console.error('Update order status error:', error);
    res.redirect('/admin/orders');
  }
};

// Users
const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    const roleFilter = req.query.role;
    
    const formattedUsers = users.map(u => formatUser(u));
    const filteredUsers = roleFilter
      ? formattedUsers.filter(u => u.role === roleFilter)
      : formattedUsers;
    
    renderPage(res, 'admin/users', 'Users', 'users', { users: filteredUsers });
  } catch (error) {
    console.error('Users error:', error);
    renderPage(res, 'admin/users', 'Users', 'users', { users: [] });
  }
};

const getUserDetail = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    
    if (!user) {
      return res.redirect('/admin/users');
    }
    
    const userOrders = await orderService.getOrdersByUserId(req.params.id);
    
    renderPage(res, 'admin/user-detail', 'User Details', 'users', { user: formatUser(user), orders: userOrders });
  } catch (error) {
    console.error('User detail error:', error);
    res.redirect('/admin/users');
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await userService.updateUserStatus(req.params.id, status);
    res.redirect(`/admin/users/${req.params.id}`);
  } catch (error) {
    console.error('Update user status error:', error);
    res.redirect('/admin/users');
  }
};

// Categories
const getCategories = async (req, res) => {
  try {
    const categories = await productService.getCategories();
    renderPage(res, 'admin/categories', 'Categories', 'categories', { categories });
  } catch (error) {
    console.error('Categories error:', error);
    renderPage(res, 'admin/categories', 'Categories', 'categories', { categories: [] });
  }
};

const createCategory = async (req, res) => {
  try {
    await productService.createCategory(req.body);
    res.redirect('/admin/categories');
  } catch (error) {
    console.error('Create category error:', error);
    res.redirect('/admin/categories');
  }
};

const updateCategory = async (req, res) => {
  try {
    await productService.updateCategory(req.params.id, req.body);
    res.redirect('/admin/categories');
  } catch (error) {
    console.error('Update category error:', error);
    res.redirect('/admin/categories');
  }
};

const deleteCategory = async (req, res) => {
  try {
    await productService.deleteCategory(req.params.id);
    res.redirect('/admin/categories');
  } catch (error) {
    console.error('Delete category error:', error);
    res.redirect('/admin/categories');
  }
};

// Brands Management
const getBrands = async (req, res) => {
  try {
    const { productService: ps } = require('../database/service');
    const categories = await ps.getCategories();
    const brands = await ps.getBrands();
    
    res.render('admin/brands', {
      title: 'Brands - SegzTech Admin',
      brands,
      categories,
      currentRoute: 'brands'
    });
  } catch (error) {
    console.error('Error loading brands:', error);
    res.status(500).render('admin/login', {
      title: 'Brands - SegzTech Admin',
      error: 'Failed to load brands'
    });
  }
};

const createBrand = async (req, res) => {
  try {
    const { productService: ps } = require('../database/service');
    const { name, logo, website, categories } = req.body;
    
    const categoryArray = categories ? (Array.isArray(categories) ? categories : [categories]) : [];
    
    await ps.createBrand({
      name,
      logo,
      website,
      categories: categoryArray
    });
    
    req.flash.success = 'Brand created successfully';
    res.redirect('/admin/brands');
  } catch (error) {
    console.error('Error creating brand:', error);
    req.flash.error = 'Failed to create brand';
    res.redirect('/admin/brands');
  }
};

const updateBrand = async (req, res) => {
  try {
    const { productService: ps, Brand } = require('../database/service');
    const { id } = req.params;
    const { name, logo, website, categories, is_active } = req.body;
    
    const categoryArray = categories ? (Array.isArray(categories) ? categories : [categories]) : [];
    
    await Brand.update({
      name,
      logo,
      website,
      categories: categoryArray,
      is_active: is_active === 'on'
    }, { where: { id } });
    
    req.flash.success = 'Brand updated successfully';
    res.redirect('/admin/brands');
  } catch (error) {
    console.error('Error updating brand:', error);
    req.flash.error = 'Failed to update brand';
    res.redirect('/admin/brands');
  }
};

const deleteBrand = async (req, res) => {
  try {
    const { Brand } = require('../database/service');
    const { id } = req.params;
    
    await Brand.destroy({ where: { id } });
    
    req.flash.success = 'Brand deleted successfully';
    res.redirect('/admin/brands');
  } catch (error) {
    console.error('Error deleting brand:', error);
    req.flash.error = 'Failed to delete brand';
    res.redirect('/admin/brands');
  }
};

// Hierarchy Management
const getHierarchy = async (req, res) => {
  try {
    renderPage(res, 'admin/hierarchy', 'Product Hierarchy', 'hierarchy', {});
  } catch (error) {
    console.error('Hierarchy error:', error);
    res.redirect('/admin/dashboard');
  }
};

// Analytics
const getAnalytics = async (req, res) => {
  try {
    const analytics = require('../services/analytics.service');
    
    const days = parseInt(req.query.days) || 30;
    const analyticsData = await analytics.getDashboardStats(days);
    
    renderPage(res, 'admin/analytics', 'Analytics', 'analytics', { 
      analytics: analyticsData 
    });
  } catch (error) {
    console.error('Error loading analytics:', error);
    res.redirect('/admin/dashboard');
  }
};

const getNotifications = async (req, res) => {
  try {
    const { type, page = 1 } = req.query;
    const result = await notificationService.getNotifications(parseInt(page), 20, type);
    const unreadCount = await notificationService.getUnreadCount();
    const stats = await notificationService.getStats();

    renderPage(res, 'admin/notifications', 'Notifications', 'notifications', {
      notifications: result.notifications,
      pagination: {
        total: result.total,
        totalPages: result.totalPages,
        currentPage: result.currentPage
      },
      unreadCount,
      stats,
      filter: type || 'all'
    });
  } catch (error) {
    console.error('Notifications error:', error);
    renderPage(res, 'admin/notifications', 'Notifications', 'notifications', {
      notifications: [],
      pagination: { total: 0, totalPages: 0, currentPage: 1 },
      unreadCount: 0,
      stats: { total: 0, unread: 0, orders: 0, signups: 0 },
      filter: 'all'
    });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    await notificationService.markAsRead(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ success: false });
  }
};

const markAllNotificationsAsRead = async (req, res) => {
  try {
    await notificationService.markAllAsRead();
    res.json({ success: true });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ success: false });
  }
};

const deleteNotification = async (req, res) => {
  try {
    await notificationService.deleteNotification(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ success: false });
  }
};

const getMessages = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const result = await notificationService.getContactMessages(parseInt(page), 20);
    const unreadCount = await notificationService.getUnreadMessageCount();

    renderPage(res, 'admin/messages', 'Messages', 'messages', {
      messages: result.messages,
      pagination: {
        total: result.total,
        totalPages: result.totalPages,
        currentPage: result.currentPage
      },
      unreadCount
    });
  } catch (error) {
    console.error('Messages error:', error);
    renderPage(res, 'admin/messages', 'Messages', 'messages', {
      messages: [],
      pagination: { total: 0, totalPages: 0, currentPage: 1 },
      unreadCount: 0
    });
  }
};

const viewMessage = async (req, res) => {
  try {
    const { ContactMessage } = require('../database/models');
    const message = await ContactMessage.findByPk(req.params.id);

    if (!message) {
      return res.redirect('/admin/messages');
    }

    if (!message.is_read) {
      await notificationService.markMessageAsRead(req.params.id);
      message.is_read = true;
    }

    renderPage(res, 'admin/message-view', 'View Message', 'messages', {
      message: message.toJSON()
    });
  } catch (error) {
    console.error('View message error:', error);
    res.redirect('/admin/messages');
  }
};

const deleteMessage = async (req, res) => {
  try {
    await notificationService.deleteMessage(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ success: false });
  }
};

const getNotificationCount = async (req, res) => {
  try {
    const [unreadNotifications, unreadMessages] = await Promise.all([
      notificationService.getUnreadCount(),
      notificationService.getUnreadMessageCount()
    ]);
    res.json({ unreadNotifications, unreadMessages });
  } catch (error) {
    console.error('Notification count error:', error);
    res.json({ unreadNotifications: 0, unreadMessages: 0 });
  }
};

const getSettings = async (req, res) => {
  try {
    const settingsService = require('../services/settings.service');
    const settings = await settingsService.getSettings();
    renderPage(res, 'admin/settings', 'Settings', 'settings', { settings });
  } catch (error) {
    console.error('Settings error:', error);
    res.redirect('/admin/dashboard');
  }
};

const saveSettings = async (req, res) => {
  try {
    const settingsService = require('../services/settings.service');
    const { site_name, site_email, site_phone, site_address, currency, currency_symbol, whatsapp_number } = req.body;
    const updates = { site_name, site_email, site_phone, site_address, currency, currency_symbol, whatsapp_number };
    updates.payment_paystack = req.body.payment_paystack === 'on';
    updates.payment_whatsapp = req.body.payment_whatsapp === 'on';
    updates.notify_email = req.body.notify_email === 'on';
    updates.notify_new_product = req.body.notify_new_product === 'on';
    await settingsService.updateSettings(updates);
    settingsService.invalidateCache();
    req.flash.success = 'Settings saved successfully';
    res.redirect('/admin/settings');
  } catch (error) {
    console.error('Save settings error:', error);
    req.flash.error = 'Failed to save settings';
    res.redirect('/admin/settings');
  }
};

const getChangePassword = async (req, res) => {
  renderPage(res, 'admin/password', 'Change Password', 'settings', {});
};

const postChangePassword = async (req, res) => {
  try {
    const { current_password, new_password, confirm_password } = req.body;
    if (!current_password || !new_password || !confirm_password) {
      req.flash.error = 'All fields are required';
      return res.redirect('/admin/password');
    }
    if (new_password.length < 6) {
      req.flash.error = 'New password must be at least 6 characters';
      return res.redirect('/admin/password');
    }
    if (new_password !== confirm_password) {
      req.flash.error = 'New passwords do not match';
      return res.redirect('/admin/password');
    }
    const bcrypt = require('bcryptjs');
    const { User } = require('../database/models');
    const admin = await User.findByPk(req.session.user.id);
    if (!admin) {
      req.flash.error = 'Admin not found';
      return res.redirect('/admin/password');
    }
    const isMatch = await bcrypt.compare(current_password, admin.password);
    if (!isMatch) {
      req.flash.error = 'Current password is incorrect';
      return res.redirect('/admin/password');
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(new_password, salt);
    await User.update({ password: hashed }, { where: { id: req.session.user.id } });
    req.flash.success = 'Password changed successfully';
    res.redirect('/admin/password');
  } catch (error) {
    console.error('Change password error:', error);
    req.flash.error = 'Failed to change password';
    res.redirect('/admin/password');
  }
};

// Flash Sales
const getFlashSales = async (req, res) => {
  try {
    const flashSales = await productService.getAllFlashSales();
    renderPage(res, 'admin/flash-sales', 'Flash Sales', 'flash-sales', { flashSales });
  } catch (error) {
    console.error('Flash sales error:', error);
    renderPage(res, 'admin/flash-sales', 'Flash Sales', 'flash-sales', { flashSales: [] });
  }
};

const getNewFlashSale = async (req, res) => {
  renderPage(res, 'admin/flash-sale-form', 'Add Flash Sale', 'flash-sales', { flashSale: null });
};

const createFlashSale = async (req, res) => {
  try {
    const { title, subtitle, description, image, link, sort_order, start_date, end_date } = req.body;
    await productService.createFlashSaleBanner({
      title, subtitle, description, image, link, sort_order,
      is_active: req.body.is_active === 'on',
      start_date: start_date || new Date(),
      end_date: end_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    req.flash.success = 'Flash sale created successfully';
    res.redirect('/admin/flash-sales');
  } catch (error) {
    console.error('Create flash sale error:', error);
    req.flash.error = 'Failed to create flash sale';
    res.redirect('/admin/flash-sales/new');
  }
};

const getEditFlashSale = async (req, res) => {
  try {
    const flashSale = await productService.getFlashSaleById(req.params.id);
    if (!flashSale) {
      return res.redirect('/admin/flash-sales');
    }
    renderPage(res, 'admin/flash-sale-form', 'Edit Flash Sale', 'flash-sales', { flashSale: flashSale.toJSON() });
  } catch (error) {
    console.error('Edit flash sale error:', error);
    res.redirect('/admin/flash-sales');
  }
};

const updateFlashSale = async (req, res) => {
  try {
    const { title, subtitle, description, image, link, sort_order, start_date, end_date } = req.body;
    await productService.updateFlashSaleBanner(req.params.id, {
      title, subtitle, description, image, link,
      sort_order: parseInt(sort_order) || 0,
      is_active: req.body.is_active === 'on',
      start_date, end_date
    });
    req.flash.success = 'Flash sale updated successfully';
    res.redirect('/admin/flash-sales');
  } catch (error) {
    console.error('Update flash sale error:', error);
    req.flash.error = 'Failed to update flash sale';
    res.redirect('/admin/flash-sales');
  }
};

const deleteFlashSale = async (req, res) => {
  try {
    await productService.deleteFlashSaleBanner(req.params.id);
    req.flash.success = 'Flash sale deleted';
    res.redirect('/admin/flash-sales');
  } catch (error) {
    console.error('Delete flash sale error:', error);
    req.flash.error = 'Failed to delete flash sale';
    res.redirect('/admin/flash-sales');
  }
};

module.exports = {
  getLogin,
  postLogin,
  logout,
  getDashboard,
  getProducts,
  getNewProduct,
  createProduct,
  getEditProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  getOrderDetail,
  updateOrderStatus,
  getUsers,
  getUserDetail,
  updateUserStatus,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  getAnalytics,
  getHierarchy,
  getFlashSales,
  getNewFlashSale,
  createFlashSale,
  getEditFlashSale,
  updateFlashSale,
  deleteFlashSale,
  getSettings,
  saveSettings,
  getChangePassword,
  postChangePassword,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getMessages,
  viewMessage,
  deleteMessage,
  getNotificationCount
};