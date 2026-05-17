const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const ProductAnalytics = sequelize.define('ProductAnalytics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  product_name: {
    type: DataTypes.STRING(255)
  },
  product_category: {
    type: DataTypes.STRING(100)
  },
  product_brand: {
    type: DataTypes.STRING(100)
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  unique_views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  cart_adds: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  cart_removes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  purchases: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  wishlist_adds: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  search_impressions: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  search_clicks: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  click_through_rate: {
    type: DataTypes.DECIMAL(5, 4),
    defaultValue: 0
  },
  conversion_rate: {
    type: DataTypes.DECIMAL(5, 4),
    defaultValue: 0
  },
  add_to_cart_rate: {
    type: DataTypes.DECIMAL(5, 4),
    defaultValue: 0
  },
  avg_time_on_page: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  avg_scroll_depth: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  bounce_rate: {
    type: DataTypes.DECIMAL(5, 4),
    defaultValue: 0
  },
  revenue: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  stock_level: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  demand_score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  trending_score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  region_data: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  device_breakdown: {
    type: DataTypes.JSON,
    defaultValue: { desktop: 0, mobile: 0, tablet: 0 }
  },
  source_breakdown: {
    type: DataTypes.JSON,
    defaultValue: { direct: 0, search: 0, social: 0, email: 0 }
  }
}, {
  tableName: 'product_analytics',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['product_id'] },
    { fields: ['date'] },
    { fields: ['product_category'] },
    { fields: ['trending_score'] },
    { fields: ['demand_score'] }
  ]
});

module.exports = ProductAnalytics;
