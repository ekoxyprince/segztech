// Admin API Routes
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { productService, userService, orderService } = require('../database/service');
const { Category, Brand, User } = require('../database/models');
const emailService = require('../services/email.service');
const categorySpecs = require('../config/category-specs.json');
const hierarchy = require('../config/product-hierarchy');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/uploads/products');
    require('fs').mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|webp|mp4|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Only images and videos are allowed'));
  }
});

// Middleware to check admin auth
const isAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
};

router.use(isAdmin);

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

// Dashboard Stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const { products, totalProducts } = await productService.getAllProducts({ limit: 1000 });
    const orders = await orderService.getAllOrders();
    const users = await userService.getAllUsers();
    
    res.json({
      success: true,
      stats: {
        totalProducts: totalProducts,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + parseFloat(o.total), 0),
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        lowStockProducts: products.filter(p => p.stock < 10).length
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Products API
router.get('/products', async (req, res) => {
  try {
    const { products } = await productService.getAllProducts({ limit: 1000 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/products', upload.fields([
  { name: 'newImages', maxCount: 6 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, brand, category, subcategory, model, series, shortDescription, description, price, originalPrice, stock, isFeatured, isFlashSale, isHotPick, sku, notifyUsers, notifySocial, existingImages, specs } = req.body;
    
    let processedImages = [];
    
    if (existingImages) {
      try {
        const existing = JSON.parse(existingImages);
        const validPaths = existing.filter(url => typeof url === 'string' && !url.startsWith('data:') && url.trim());
        processedImages = processedImages.concat(validPaths);
      } catch (e) {}
    }
    
    if (req.files && req.files.newImages) {
      const newImages = req.files.newImages.map(file => '/uploads/products/' + file.filename);
      processedImages = processedImages.concat(newImages);
    }
    
    let videos = [];
    if (req.files && req.files.video && req.files.video[0]) {
      videos.push('/uploads/products/' + req.files.video[0].filename);
    }
    
    let parsedSpecs = {};
    if (specs) {
      try {
        parsedSpecs = typeof specs === 'string' ? JSON.parse(specs) : specs;
      } catch (e) {
        console.error('Error parsing specs:', e);
      }
    }
    
    const productData = {
      name,
      brand,
      category_id: category, // This will be looked up below
      subcategory: subcategory || '',
      model_name: model || '',
      series: series || '',
      shortDescription: shortDescription || '',
      description,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
      stock: parseInt(stock),
      isFeatured: isFeatured === true || isFeatured === 'true' || isFeatured === 'on',
      isFlashSale: isFlashSale === true || isFlashSale === 'true' || isFlashSale === 'on',
      isHotPick: isHotPick === true || isHotPick === 'true' || isHotPick === 'on',
      tags: [],
      specs: parsedSpecs,
      images: processedImages,
      videos: videos,
      sku: sku || ''
    };
    
    // Look up category by slug to get numeric ID
    const categoryRecord = await Category.findOne({ where: { slug: category } });
    if (!categoryRecord) {
      return res.status(400).json({ success: false, message: 'Category not found: ' + category });
    }
    productData.category_id = categoryRecord.id;
    
    const product = await productService.createProduct(productData);
    
    if (notifyUsers === true || notifyUsers === 'true' || notifyUsers === 'on') {
      sendProductNotification(product);
    }
    
    res.json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/products/:id', upload.fields([
  { name: 'newImages', maxCount: 6 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const { name, brand, category, subcategory, model, series, shortDescription, description, price, originalPrice, stock, isFeatured, isFlashSale, isHotPick, sku, existingImages, specs } = req.body;
    
    const existingProduct = await productService.getProductById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    let processedImages = [];
    if (existingImages) {
      try {
        const existing = JSON.parse(existingImages);
        const validPaths = existing.filter(url => typeof url === 'string' && !url.startsWith('data:') && url.trim());
        processedImages = processedImages.concat(validPaths);
      } catch (e) {}
    }
    
    if (req.files && req.files.newImages) {
      const newImages = req.files.newImages.map(file => '/uploads/products/' + file.filename);
      processedImages = processedImages.concat(newImages);
    }
    
    let videos = existingProduct.videos ? existingProduct.videos.map(v => v.video_url || v) : [];
    if (req.files && req.files.video && req.files.video[0]) {
      videos.push('/uploads/products/' + req.files.video[0].filename);
    }
    
    let parsedSpecs = {};
    if (specs) {
      try {
        parsedSpecs = typeof specs === 'string' ? JSON.parse(specs) : specs;
      } catch (e) {
        console.error('Error parsing specs:', e);
      }
    }
    
    const updateData = {
      name,
      brand,
      subcategory: subcategory || '',
      model_name: model || '',
      series: series || '',
      shortDescription: shortDescription || '',
      description,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
      stock: parseInt(stock),
      isFeatured: isFeatured === true || isFeatured === 'true' || isFeatured === 'on',
      isFlashSale: isFlashSale === true || isFlashSale === 'true' || isFlashSale === 'on',
      isHotPick: isHotPick === true || isHotPick === 'true' || isHotPick === 'on',
      images: processedImages,
      videos: videos,
      specs: parsedSpecs,
      sku: sku || ''
    };
    
    // Look up category by slug to get numeric ID
    if (category) {
      const categoryRecord = await Category.findOne({ where: { slug: category } });
      if (!categoryRecord) {
        return res.status(400).json({ success: false, message: 'Category not found: ' + category });
      }
      updateData.category_id = categoryRecord.id;
    }
    
    const result = await productService.updateProduct(req.params.id, updateData);
    res.json({ success: true, product: result.product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Orders API
router.get('/orders', async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    const statusFilter = req.query.status;
    const userIdFilter = req.query.userId;
    
    const formattedOrders = orders.map(o => formatOrder(o));
    let filteredOrders = formattedOrders;
    
    if (statusFilter) {
      filteredOrders = filteredOrders.filter(o => o.status === statusFilter);
    }
    if (userIdFilter) {
      filteredOrders = filteredOrders.filter(o => o.userId === userIdFilter);
    }
    
    res.json({ success: true, orders: filteredOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/orders/:id', async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order: formatOrder(order) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const result = await orderService.updateOrderStatus(req.params.id, status);
    res.json({ success: true, order: result.order ? formatOrder(result.order) : null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/orders/:id', async (req, res) => {
  try {
    const { status, paymentStatus, shippingCarrier, trackingNumber, notes } = req.body;
    
    const updates = {};
    if (status) updates.status = status;
    if (paymentStatus) updates.payment_status = paymentStatus;
    if (shippingCarrier !== undefined) updates.shipping_carrier = shippingCarrier;
    if (trackingNumber !== undefined) updates.tracking_number = trackingNumber;
    if (notes !== undefined) updates.notes = notes;
    
    if (status) {
      await orderService.updateOrderStatus(req.params.id, status);
      delete updates.status;
    }
    
    if (Object.keys(updates).length > 0) {
      const { Order } = require('../database/models');
      await Order.update(updates, { where: { id: req.params.id } });
    }
    
    const order = await orderService.getOrderById(req.params.id);
    res.json({ success: true, order: formatOrder(order) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Users API
router.get('/users', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ success: true, users: users.map(u => formatUser(u)) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const userOrders = await orderService.getOrdersByUserId(req.params.id);
    res.json({ success: true, user: formatUser(user), orders: userOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/users/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await userService.updateUserStatus(req.params.id, status);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { role, status, phone, address } = req.body;
    const updates = {};
    if (role) updates.role = role;
    if (status) updates.status = status;
    if (phone !== undefined) updates.phone = phone;
    if (address !== undefined) updates.address = address;
    await User.update(updates, { where: { id: req.params.id } });
    const updatedUser = await userService.getUserById(req.params.id);
    res.json({ success: true, user: formatUser(updatedUser) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send email to user
router.post('/users/:id/email', async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const { subject, message } = req.body;
    if (!subject || !message) return res.status(400).json({ success: false, message: 'Subject and message are required' });
    const adminName = req.session.user ? (req.session.user.firstName + ' ' + req.session.user.lastName) : 'Admin';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #ff6a00; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h2 style="color: #fff; margin: 0;">${subject}</h2>
        </div>
        <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="color: #333; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          <br>
          <p style="color: #666;">Best regards,<br><strong>${adminName}</strong><br>SegzTech Team</p>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
          You received this email because you're registered at SegzTech.
        </p>
      </div>
    `;
    await emailService.sendEmail({ to: user.email, subject, html });
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Categories API
router.get('/categories', async (req, res) => {
  try {
    const categories = await productService.getCategories();
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Category Specs API - Returns dynamic fields for each category
router.get('/category-specs', (req, res) => {
  res.json({ success: true, specs: categorySpecs.categories });
});

// Category Specs by category slug
router.get('/category-specs/:slug', (req, res) => {
  const slug = req.params.slug;
  const spec = categorySpecs.categories[slug];
  if (!spec) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  res.json({ success: true, specs: spec });
});

// Product Hierarchy Cascade API
router.get('/hierarchy/types/:category', (req, res) => {
  try {
    const types = hierarchy.getTypes(req.params.category);
    res.json({ success: true, types });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/hierarchy/brands/:category', (req, res) => {
  try {
    const { type } = req.query;
    const brands = type ? hierarchy.getBrandsByType(req.params.category, type) : hierarchy.getBrands(req.params.category);
    res.json({ success: true, brands });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/hierarchy/models/:category/:brand', (req, res) => {
  try {
    const { type } = req.query;
    const models = type ? hierarchy.getModelsByType(req.params.category, req.params.brand, type) : hierarchy.getModels(req.params.category, req.params.brand);
    res.json({ success: true, models });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/hierarchy/series/:category/:brand/:model', (req, res) => {
  try {
    const series = hierarchy.getSeries(req.params.category, req.params.brand, req.params.model);
    res.json({ success: true, series });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/hierarchy/defaults/:category/:brand/:model', (req, res) => {
  try {
    const defaults = hierarchy.getDefaultSpecs(req.params.category, req.params.brand, req.params.model);
    res.json({ success: true, defaults });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Full hierarchy data for management page
router.get('/hierarchy-data', (req, res) => {
  try {
    res.json({ success: true, hierarchy: hierarchy.productHierarchy });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add item to hierarchy
router.post('/hierarchy/add', (req, res) => {
  try {
    const { mode, name, category, type, brand, model } = req.body;
    
    if (!name || !mode) {
      return res.status(400).json({ success: false, message: 'Name and mode are required' });
    }
    
    const ph = hierarchy.productHierarchy;
    
    if (mode === 'category') {
      const slug = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      if (ph[slug]) return res.json({ success: false, message: 'Category already exists' });
      ph[slug] = { name: name, types: [], brands: {} };
    } else if (mode === 'type') {
      if (!category || !ph[category]) return res.json({ success: false, message: 'Select a category first' });
      if (!ph[category].types) ph[category].types = [];
      if (ph[category].types.indexOf(name) > -1) return res.json({ success: false, message: 'Type already exists' });
      ph[category].types.push(name);
    } else if (mode === 'brand') {
      if (!category || !ph[category]) return res.json({ success: false, message: 'Select a category first' });
      if (!ph[category].brands) ph[category].brands = {};
      if (ph[category].brands[name]) return res.json({ success: false, message: 'Brand already exists' });
      ph[category].brands[name] = { models: {}, types: type ? [type] : [] };
    } else if (mode === 'model') {
      if (!category || !brand || !ph[category] || !ph[category].brands[brand]) return res.json({ success: false, message: 'Select a brand first' });
      if (!ph[category].brands[brand].models) ph[category].brands[brand].models = {};
      if (ph[category].brands[brand].models[name]) return res.json({ success: false, message: 'Model already exists' });
      ph[category].brands[brand].models[name] = { series: [], type: type || '' };
    } else if (mode === 'series') {
      if (!category || !brand || !model || !ph[category] || !ph[category].brands[brand] || !ph[category].brands[brand].models[model]) {
        return res.json({ success: false, message: 'Select a model first' });
      }
      if (!ph[category].brands[brand].models[model].series) ph[category].brands[brand].models[model].series = [];
      if (ph[category].brands[brand].models[model].series.indexOf(name) > -1) return res.json({ success: false, message: 'Series already exists' });
      ph[category].brands[brand].models[model].series.push(name);
    }
    
    // Save to file
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '../config/product-hierarchy.js');
    const content = `const productHierarchy = ${JSON.stringify(ph, null, 2)};\n\n` +
      `function getCategories() { return Object.keys(productHierarchy).map(slug => ({ slug, name: productHierarchy[slug].name, hasTypes: !!productHierarchy[slug].types, types: productHierarchy[slug].types || [], brands: Object.keys(productHierarchy[slug].brands) })); }\n` +
      `function getBrands(category) { if (!productHierarchy[category]) return []; return Object.keys(productHierarchy[category].brands).map(name => ({ name, models: Object.keys(productHierarchy[category].brands[name].models), types: productHierarchy[category].brands[name].types || productHierarchy[category].types || [] })); }\n` +
      `function getModels(category, brand) { if (!productHierarchy[category] || !productHierarchy[category].brands[brand]) return []; return Object.entries(productHierarchy[category].brands[brand].models).map(([modelName, data]) => ({ name: modelName, type: data.type || '', series: data.series, specs: data.specs || {} })); }\n` +
      `function getSeries(category, brand, model) { if (!productHierarchy[category] || !productHierarchy[category].brands[brand] || !productHierarchy[category].brands[brand].models[model]) return []; return productHierarchy[category].brands[brand].models[model].series; }\n` +
      `function getTypes(category) { if (!productHierarchy[category]) return []; return productHierarchy[category].types || []; }\n` +
      `function getBrandsByType(category, type) { if (!productHierarchy[category] || !type) return getBrands(category); const brands = productHierarchy[category].brands; return Object.entries(brands).filter(([_, data]) => !data.types || data.types.includes(type)).map(([name, data]) => ({ name, models: Object.keys(data.models).filter(m => !data.models[m].type || data.models[m].type === type) })); }\n` +
      `function getModelsByType(category, brand, type) { if (!productHierarchy[category] || !productHierarchy[category].brands[brand]) return []; const models = productHierarchy[category].brands[brand].models; return Object.entries(models).filter(([_, data]) => !data.type || data.type === type).map(([modelName, data]) => ({ name: modelName, type: data.type || '', series: data.series })); }\n` +
      `function getDefaultSpecs(category, brand, model) { if (!productHierarchy[category] || !productHierarchy[category].brands[brand] || !productHierarchy[category].brands[brand].models[model]) return {}; return productHierarchy[category].brands[brand].models[model].specs || {}; }\n\n` +
      `module.exports = { productHierarchy, getCategories, getBrands, getModels, getSeries, getTypes, getBrandsByType, getModelsByType, getDefaultSpecs };\n`;
    
    fs.writeFileSync(filePath, content);
    
    res.json({ success: true, message: name + ' added successfully' });
  } catch (error) {
    console.error('Hierarchy add error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete item from hierarchy
router.post('/hierarchy/delete', (req, res) => {
  try {
    const { mode, name, category, type, brand, model } = req.body;
    
    if (!mode || !name) {
      return res.status(400).json({ success: false, message: 'Mode and name are required' });
    }
    
    const ph = hierarchy.productHierarchy;
    
    if (mode === 'category') {
      if (!ph[name]) return res.json({ success: false, message: 'Category not found' });
      delete ph[name];
    } else if (mode === 'type') {
      if (!category || !ph[category] || !ph[category].types) return res.json({ success: false, message: 'Category or types not found' });
      const idx = ph[category].types.indexOf(name);
      if (idx > -1) ph[category].types.splice(idx, 1);
    } else if (mode === 'brand') {
      if (!category || !ph[category] || !ph[category].brands || !ph[category].brands[name]) return res.json({ success: false, message: 'Brand not found' });
      delete ph[category].brands[name];
    } else if (mode === 'model') {
      if (!category || !brand || !ph[category] || !ph[category].brands[brand] || !ph[category].brands[brand].models || !ph[category].brands[brand].models[name]) return res.json({ success: false, message: 'Model not found' });
      delete ph[category].brands[brand].models[name];
    } else if (mode === 'series') {
      if (!category || !brand || !model || !ph[category] || !ph[category].brands[brand] || !ph[category].brands[brand].models[model] || !ph[category].brands[brand].models[model].series) return res.json({ success: false, message: 'Series not found' });
      const idx = ph[category].brands[brand].models[model].series.indexOf(name);
      if (idx > -1) ph[category].brands[brand].models[model].series.splice(idx, 1);
    }
    
    // Save to file
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '../config/product-hierarchy.js');
    const content = `const productHierarchy = ${JSON.stringify(ph, null, 2)};\n\n` +
      `function getCategories() { return Object.keys(productHierarchy).map(slug => ({ slug, name: productHierarchy[slug].name, hasTypes: !!productHierarchy[slug].types, types: productHierarchy[slug].types || [], brands: Object.keys(productHierarchy[slug].brands) })); }\n` +
      `function getBrands(category) { if (!productHierarchy[category]) return []; return Object.keys(productHierarchy[category].brands).map(name => ({ name, models: Object.keys(productHierarchy[category].brands[name].models), types: productHierarchy[category].brands[name].types || productHierarchy[category].types || [] })); }\n` +
      `function getModels(category, brand) { if (!productHierarchy[category] || !productHierarchy[category].brands[brand]) return []; return Object.entries(productHierarchy[category].brands[brand].models).map(([modelName, data]) => ({ name: modelName, type: data.type || '', series: data.series, specs: data.specs || {} })); }\n` +
      `function getSeries(category, brand, model) { if (!productHierarchy[category] || !productHierarchy[category].brands[brand] || !productHierarchy[category].brands[brand].models[model]) return []; return productHierarchy[category].brands[brand].models[model].series; }\n` +
      `function getTypes(category) { if (!productHierarchy[category]) return []; return productHierarchy[category].types || []; }\n` +
      `function getBrandsByType(category, type) { if (!productHierarchy[category] || !type) return getBrands(category); const brands = productHierarchy[category].brands; return Object.entries(brands).filter(([_, data]) => !data.types || data.types.includes(type)).map(([name, data]) => ({ name, models: Object.keys(data.models).filter(m => !data.models[m].type || data.models[m].type === type) })); }\n` +
      `function getModelsByType(category, brand, type) { if (!productHierarchy[category] || !productHierarchy[category].brands[brand]) return []; const models = productHierarchy[category].brands[brand].models; return Object.entries(models).filter(([_, data]) => !data.type || data.type === type).map(([modelName, data]) => ({ name: modelName, type: data.type || '', series: data.series })); }\n` +
      `function getDefaultSpecs(category, brand, model) { if (!productHierarchy[category] || !productHierarchy[category].brands[brand] || !productHierarchy[category].brands[brand].models[model]) return {}; return productHierarchy[category].brands[brand].models[model].specs || {}; }\n\n` +
      `module.exports = { productHierarchy, getCategories, getBrands, getModels, getSeries, getTypes, getBrandsByType, getModelsByType, getDefaultSpecs };\n`;
    
    fs.writeFileSync(filePath, content);
    
    res.json({ success: true, message: name + ' deleted successfully' });
  } catch (error) {
    console.error('Hierarchy delete error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, category: category.toJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const category = await productService.createCategory(req.body);
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    const result = await productService.updateCategory(req.params.id, req.body);
    res.json({ success: true, category: result.category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    await productService.deleteCategory(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Brands API
router.get('/brands', async (req, res) => {
  try {
    const brands = await productService.getBrands();
    res.json({ success: true, brands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/brands/:id', async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }
    res.json({ success: true, brand: brand.toJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/brands', async (req, res) => {
  try {
    const { name, logo, website, categories } = req.body;
    const categoryArray = categories ? (Array.isArray(categories) ? categories : [categories]) : [];
    
    const brand = await productService.createBrand({
      name,
      logo,
      website,
      categories: categoryArray
    });
    
    res.json({ success: true, brand });
  } catch (error) {
    console.error('Create brand error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/brands/:id', async (req, res) => {
  try {
    const { name, logo, website, categories } = req.body;
    const categoryArray = categories ? (Array.isArray(categories) ? categories : [categories]) : [];
    
    const result = await productService.updateBrand(req.params.id, {
      name,
      logo,
      website,
      categories: categoryArray
    });
    
    res.json({ success: true, brand: result.brand });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/brands/:id', async (req, res) => {
  try {
    await productService.deleteBrand(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Analytics API
router.get('/analytics', async (req, res) => {
  try {
    const { products, totalProducts } = await productService.getAllProducts({ limit: 1000 });
    const orders = await orderService.getAllOrders();
    const users = await userService.getAllUsers();
    
    const months = {};
    orders.filter(o => o.status === 'delivered').forEach(order => {
      const date = new Date(order.created_at);
      const month = date.toLocaleString('default', { month: 'short' });
      months[month] = (months[month] || 0) + parseFloat(order.total);
    });
    
    res.json({
      success: true,
      analytics: {
        salesData: orders.filter(o => o.status === 'delivered').map(o => ({
          date: o.created_at,
          amount: parseFloat(o.total)
        })),
        topProducts: products.sort((a, b) => b.sold_count - a.sold_count).slice(0, 10),
        revenueByMonth: months,
        orderStatusCounts: {
          pending: orders.filter(o => o.status === 'pending').length,
          processing: orders.filter(o => o.status === 'processing').length,
          shipped: orders.filter(o => o.status === 'shipped').length,
          delivered: orders.filter(o => o.status === 'delivered').length,
          cancelled: orders.filter(o => o.status === 'cancelled').length
        }
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper function to send product notification emails
async function sendProductNotification(product) {
  try {
    const users = await userService.getAllUsers();
    const subscribers = users.filter(u => u.role === 'user' && u.email_notifications !== false);
    
    if (subscribers.length === 0) return;
    
    for (const user of subscribers) {
      const emailData = {
        to: user.email,
        subject: `New Product Alert: ${product.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #ff6a00;">New Product Available!</h2>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
              <h3 style="margin: 0 0 10px;">${product.name}</h3>
              <p style="color: #666; margin-bottom: 15px;">${product.shortDescription || product.description.substring(0, 150)}...</p>
              <p style="font-size: 24px; font-weight: bold; color: #ff6a00;">₦${product.price.toFixed(2)}</p>
            </div>
          </div>
        `
      };
      
      if (emailService && emailService.sendEmail) {
        emailService.sendEmail(emailData).catch(err => console.error('Email send error:', err));
      }
    }
    
    console.log(`Product notification sent to ${subscribers.length} users`);
  } catch (error) {
    console.error('Error sending product notifications:', error);
  }
}

module.exports = router;
