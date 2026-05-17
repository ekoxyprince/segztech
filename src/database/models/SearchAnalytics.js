const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const SearchAnalytics = sequelize.define('SearchAnalytics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  search_query: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  normalized_query: {
    type: DataTypes.STRING(500)
  },
  search_count: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  unique_users: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  results_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  clicks_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  click_through_rate: {
    type: DataTypes.DECIMAL(5, 4),
    defaultValue: 0
  },
  add_to_cart_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  conversion_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  no_results_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  avg_results: {
    type: DataTypes.DECIMAL(6, 2),
    defaultValue: 0
  },
  avg_position_clicked: {
    type: DataTypes.DECIMAL(4, 2),
    defaultValue: 0
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  hour: {
    type: DataTypes.INTEGER
  },
  country: {
    type: DataTypes.STRING(100)
  },
  region: {
    type: DataTypes.STRING(100)
  },
  device_type: {
    type: DataTypes.ENUM('desktop', 'mobile', 'tablet'),
    defaultValue: 'desktop'
  },
  top_clicked_products: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  category_intent: {
    type: DataTypes.STRING(100)
  },
  brand_intent: {
    type: DataTypes.STRING(100)
  },
  price_range_intent: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  feature_intent: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  sentiment: {
    type: DataTypes.ENUM('positive', 'neutral', 'negative'),
    defaultValue: 'neutral'
  },
  related_queries: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  autocomplete_suggestion: {
    type: DataTypes.STRING(255)
  },
  ai_enhanced: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  intent_score: {
    type: DataTypes.DECIMAL(5, 4),
    defaultValue: 0
  },
  personalization_applied: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  tableName: 'search_analytics',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['search_query'] },
    { fields: ['normalized_query'] },
    { fields: ['date'] },
    { fields: ['search_count'] },
    { fields: ['click_through_rate'] }
  ]
});

module.exports = SearchAnalytics;
