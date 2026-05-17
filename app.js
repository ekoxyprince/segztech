require('dotenv').config();

const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');

// Import routes
const homeRoutes = require('./src/routes/homeRoutes');
const productRoutes = require('./src/routes/productRoutes');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const wishlistRoutes = require('./src/routes/wishlistRoutes');
const apiRoutes = require('./src/routes/apiRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const adminApiRoutes = require('./src/routes/adminApiRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');

// Import database
const { sequelize, testConnection } = require('./src/database/connection');
const { productService } = require('./src/database/service');

// Import middleware
const { geoMiddleware } = require('./src/middleware/geolocation');
const settingsService = require('./src/services/settings.service');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Middleware
app.use(express.static(path.join(__dirname, 'src/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());

// Session configuration
const sessionStore = new SequelizeStore({ db: sequelize });
app.use(session({
  secret: process.env.SESSION_SECRET || 'segztech-secret-key-2024',
  store: sessionStore,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));
sessionStore.sync();

// Flash messages middleware (must come after session)
app.use((req, res, next) => {
  if (!req.session) req.session = {};
  if (!req.session.flash) req.session.flash = {};
  res.locals.success = req.session.flash.success || null;
  res.locals.error = req.session.flash.error || null;
  delete req.session.flash.success;
  delete req.session.flash.error;
  req.flash = req.session.flash;
  next();
});

// Make user data available to all views
let cachedCategories = null;
app.use(async (req, res, next) => {
  if (req.session.user) {
    res.locals.user = {
      id: req.session.user.id,
      firstName: req.session.user.first_name || '',
      lastName: req.session.user.last_name || '',
      email: req.session.user.email || '',
      phone: req.session.user.phone || '',
      avatar: req.session.user.avatar || '/images/default-avatar.png',
      role: req.session.user.role || 'user'
    };
  } else {
    res.locals.user = null;
  }
  res.locals.cartCount = req.session.cart ? req.session.cart.reduce((sum, item) => sum + item.quantity, 0) : 0;
  res.locals.wishlistCount = req.session.wishlist ? req.session.wishlist.length : 0;
  if (!cachedCategories) {
    try {
      cachedCategories = await productService.getCategories();
    } catch (e) {
      cachedCategories = [];
    }
  }
  res.locals.categories = cachedCategories;
  try {
    const siteSettings = await settingsService.getSettings();
    res.locals.siteSettings = siteSettings;
  } catch (e) {
    res.locals.siteSettings = {
      site_name: 'SegzTech', site_email: 'info@segztech.com', site_phone: '+234 800 000 0000',
      site_address: '123 Main Street, Lagos, Nigeria', currency: 'NGN', currency_symbol: '₦'
    };
  }
  next();
});

// Geolocation middleware
app.use(geoMiddleware);

// Server-side page view tracking
const analyticsService = require('./src/services/analytics.service');
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/admin/api') && !req.path.startsWith('/js/') && !req.path.startsWith('/css/') && !req.path.startsWith('/images/') && !req.path.startsWith('/fonts/')) {
    const sessionId = req.cookies?.segz_session || req.sessionID;
    if (sessionId) {
      analyticsService.trackActivity(sessionId, req, {
        type: 'page_view',
        url: req.originalUrl,
        pageName: req.path !== '/' ? req.path : 'home'
      }).catch(() => {});
    }
  }
  next();
});

// Routes
app.use('/', homeRoutes);
app.use('/products', productRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/cart', cartRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/api', apiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/admin/api', adminApiRoutes);
app.use('/admin', adminRoutes);
app.use('/orders', orderRoutes);

// Backwards compatibility redirect for old checkout URL
app.get('/checkout', (req, res) => res.redirect('/orders/checkout'));

// 404 handler
app.use((req, res) => {
  res.status(404).render('pages/404', { 
    title: 'Page Not Found',
    currentRoute: ''
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('pages/error', { 
    title: 'Error',
    message: 'Something went wrong!',
    currentRoute: ''
  });
});

// Start server with database check
async function startServer() {
  console.log('========================================');
  console.log('SegzTech E-commerce Server');
  console.log('========================================\n');

  // Test database connection
  console.log('Connecting to database...');
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.error('Failed to connect to database. Please check your .env configuration.');
    console.error('Make sure MySQL is running and credentials are correct.');
    console.error('\nTo set up the database:');
    console.error('  1. Run: npm run migrate');
    console.error('  2. Run: npm run seed');
    console.error('  3. Then: npm start\n');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`\nServer running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('\n========================================');
    console.log('Admin Panel: http://localhost:3000/admin');
    console.log('Store:       http://localhost:3000');
    console.log('========================================\n');
  });
}

// Only start the server when run directly (not under LiteSpeed's lsnode)
if (require.main === module) {
  startServer();
}

module.exports = app;
