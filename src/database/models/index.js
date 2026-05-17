const { sequelize } = require('../connection');
const User = require('./User');
const UserAddress = require('./UserAddress');
const Category = require('./Category');
const Brand = require('./Brand');
const Product = require('./Product');
const ProductImage = require('./ProductImage');
const ProductVideo = require('./ProductVideo');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const OrderAddress = require('./OrderAddress');
const OrderTimeline = require('./OrderTimeline');
const FlashSaleBanner = require('./FlashSaleBanner');
const UserSession = require('./UserSession');
const UserActivity = require('./UserActivity');
const ProductAnalytics = require('./ProductAnalytics');
const SearchAnalytics = require('./SearchAnalytics');
const RecommendationCache = require('./RecommendationCache');
const RegionAnalytics = require('./RegionAnalytics');
const Review = require('./Review');
const Notification = require('./Notification');
const ContactMessage = require('./ContactMessage');
const SiteSetting = require('./SiteSetting');

User.hasMany(UserAddress, { foreignKey: 'user_id', as: 'addresses' });
UserAddress.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

Brand.hasMany(Product, { foreignKey: 'brand_id', as: 'brandProducts' });
Product.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brandInfo' });

Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

Product.hasMany(ProductVideo, { foreignKey: 'product_id', as: 'videos' });
ProductVideo.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

Order.hasOne(OrderAddress, { foreignKey: 'order_id', as: 'shippingAddress' });
OrderAddress.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

Order.hasMany(OrderTimeline, { foreignKey: 'order_id', as: 'timeline' });
OrderTimeline.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

User.hasMany(UserSession, { foreignKey: 'user_id', as: 'sessions' });
UserSession.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Product.hasMany(UserActivity, { foreignKey: 'product_id', as: 'activities' });

Product.hasMany(Review, { foreignKey: 'product_id', as: 'reviews' });
Review.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Product.hasMany(ProductAnalytics, { foreignKey: 'product_id', as: 'analytics' });

module.exports = {
  sequelize,
  User,
  UserAddress,
  Category,
  Brand,
  Product,
  ProductImage,
  ProductVideo,
  Order,
  OrderItem,
  OrderAddress,
  OrderTimeline,
  FlashSaleBanner,
  UserSession,
  UserActivity,
  ProductAnalytics,
  SearchAnalytics,
  RecommendationCache,
  RegionAnalytics,
  Review,
  Notification,
  ContactMessage,
  SiteSetting
};
