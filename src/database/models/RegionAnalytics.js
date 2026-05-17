const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const RegionAnalytics = sequelize.define('RegionAnalytics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  region: {
    type: DataTypes.STRING(100)
  },
  city: {
    type: DataTypes.STRING(100)
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  sessions: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  unique_visitors: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  page_views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  avg_session_duration: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  bounce_rate: {
    type: DataTypes.DECIMAL(5, 4),
    defaultValue: 0
  },
  new_visitors: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  returning_visitors: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  conversions: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  conversion_rate: {
    type: DataTypes.DECIMAL(5, 4),
    defaultValue: 0
  },
  revenue: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  avg_order_value: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  cart_abandonment_rate: {
    type: DataTypes.DECIMAL(5, 4),
    defaultValue: 0
  },
  top_categories: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  top_products: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  top_searches: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  device_breakdown: {
    type: DataTypes.JSON,
    defaultValue: { desktop: 0, mobile: 0, tablet: 0 }
  },
  browser_breakdown: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  os_breakdown: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  popular_hours: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  popular_days: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  timezone: {
    type: DataTypes.STRING(100)
  },
  currency: {
    type: DataTypes.STRING(10)
  },
  language: {
    type: DataTypes.STRING(10)
  },
  interests: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  buying_power_index: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  engagement_score: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  market_potential: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  }
}, {
  tableName: 'region_analytics',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['country'] },
    { fields: ['region'] },
    { fields: ['city'] },
    { fields: ['date'] }
  ]
});

module.exports = RegionAnalytics;
