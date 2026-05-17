// Admin Routes
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const adminMiddleware = require('../middleware/admin.middleware');

// Admin Login (public)
router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/logout', adminController.logout);

// Apply admin authentication check to all other routes
router.use(adminMiddleware.isAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Products
router.get('/products', adminController.getProducts);
router.get('/products/new', adminController.getNewProduct);
router.post('/products', adminController.createProduct);
router.get('/products/:id/edit', adminController.getEditProduct);
router.post('/products/:id', adminController.updateProduct);
router.post('/products/:id/delete', adminController.deleteProduct);

// Orders
router.get('/orders', adminController.getOrders);
router.get('/orders/:id', adminController.getOrderDetail);
router.post('/orders/:id/status', adminController.updateOrderStatus);

// Users
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserDetail);
router.post('/users/:id/status', adminController.updateUserStatus);

// Categories
router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.createCategory);
router.post('/categories/:id', adminController.updateCategory);
router.post('/categories/:id/delete', adminController.deleteCategory);

// Brands
router.get('/brands', adminController.getBrands);
router.post('/brands', adminController.createBrand);
router.post('/brands/:id', adminController.updateBrand);
router.post('/brands/:id/delete', adminController.deleteBrand);

// Flash Sales
router.get('/flash-sales', adminController.getFlashSales);
router.get('/flash-sales/new', adminController.getNewFlashSale);
router.post('/flash-sales', adminController.createFlashSale);
router.get('/flash-sales/:id/edit', adminController.getEditFlashSale);
router.post('/flash-sales/:id', adminController.updateFlashSale);
router.post('/flash-sales/:id/delete', adminController.deleteFlashSale);

// Analytics
router.get('/analytics', adminController.getAnalytics);

// Hierarchy Management
router.get('/hierarchy', adminController.getHierarchy);

// Settings
router.get('/settings', adminController.getSettings);
router.post('/settings', adminController.saveSettings);

// Password
router.get('/password', adminController.getChangePassword);
router.post('/password', adminController.postChangePassword);

// Notifications
router.get('/notifications', adminController.getNotifications);
router.post('/notifications/:id/read', adminController.markNotificationAsRead);
router.post('/notifications/read-all', adminController.markAllNotificationsAsRead);
router.delete('/notifications/:id', adminController.deleteNotification);

// Messages
router.get('/messages', adminController.getMessages);
router.get('/messages/:id', adminController.viewMessage);
router.delete('/messages/:id', adminController.deleteMessage);

// API
router.get('/api/notification-count', adminController.getNotificationCount);

// Default to dashboard
router.get('/', (req, res) => res.redirect('/admin/dashboard'));

module.exports = router;
