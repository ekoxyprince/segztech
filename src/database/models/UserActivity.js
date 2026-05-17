const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const UserActivity = sequelize.define('UserActivity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  session_id: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  activity_type: {
    type: DataTypes.ENUM(
      'page_view',
      'product_view',
      'search',
      'filter_apply',
      'add_to_cart',
      'remove_from_cart',
      'update_cart',
      'wishlist_add',
      'wishlist_remove',
      'checkout_start',
      'checkout_complete',
      'checkout_abandon',
      'payment_success',
      'payment_failed',
      'click',
      'scroll_depth',
      'time_on_page',
      'video_play',
      'image_zoom',
      'share',
      'review_submit',
      'compare',
      'sort_change'
    ),
    allowNull: false
  },
  page_url: {
    type: DataTypes.STRING(500)
  },
  page_name: {
    type: DataTypes.STRING(255)
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  product_name: {
    type: DataTypes.STRING(255)
  },
  product_category: {
    type: DataTypes.STRING(100)
  },
  product_price: {
    type: DataTypes.DECIMAL(10, 2)
  },
  product_brand: {
    type: DataTypes.STRING(100)
  },
  search_query: {
    type: DataTypes.STRING(500)
  },
  search_results_count: {
    type: DataTypes.INTEGER
  },
  filters_applied: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  sort_option: {
    type: DataTypes.STRING(50)
  },
  referrer_url: {
    type: DataTypes.STRING(500)
  },
  referrer_type: {
    type: DataTypes.ENUM('direct', 'search', 'social', 'email', 'affiliate', 'internal')
  },
  utm_source: {
    type: DataTypes.STRING(100)
  },
  utm_medium: {
    type: DataTypes.STRING(100)
  },
  utm_campaign: {
    type: DataTypes.STRING(100)
  },
  device_type: {
    type: DataTypes.ENUM('desktop', 'mobile', 'tablet'),
    defaultValue: 'desktop'
  },
  country: {
    type: DataTypes.STRING(100)
  },
  region: {
    type: DataTypes.STRING(100)
  },
  city: {
    type: DataTypes.STRING(100)
  },
  ip_address: {
    type: DataTypes.STRING(45)
  },
  user_agent: {
    type: DataTypes.TEXT
  },
  browser: {
    type: DataTypes.STRING(100)
  },
  os: {
    type: DataTypes.STRING(100)
  },
  screen_resolution: {
    type: DataTypes.STRING(20)
  },
  viewport_size: {
    type: DataTypes.STRING(20)
  },
  scroll_depth: {
    type: DataTypes.INTEGER
  },
  time_on_page: {
    type: DataTypes.INTEGER
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  tableName: 'user_activities',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['session_id'] },
    { fields: ['user_id'] },
    { fields: ['activity_type'] },
    { fields: ['product_id'] },
    { fields: ['timestamp'] },
    { fields: ['country'] },
    { fields: ['search_query'] }
  ]
});

module.exports = UserActivity;
