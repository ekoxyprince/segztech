const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const RecommendationCache = sequelize.define('RecommendationCache', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  cache_type: {
    type: DataTypes.ENUM(
      'product_complementary',
      'user_similar',
      'category_popular',
      'trending',
      'region_based',
      'purchase_pattern',
      'viewed_together',
      'search_related',
      'frequently_bought'
    ),
    allowNull: false
  },
  seed_product_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  seed_category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  seed_region: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  session_id: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  recommended_products: {
    type: DataTypes.JSON,
    allowNull: false
  },
  recommendation_scores: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  recommendation_reasons: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  confidence_score: {
    type: DataTypes.DECIMAL(5, 4),
    defaultValue: 0
  },
  algorithm_version: {
    type: DataTypes.STRING(20),
    defaultValue: '1.0'
  },
  data_points_used: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  impressions: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  clicks: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  conversions: {
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
  expires_at: {
    type: DataTypes.DATE
  },
  last_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  metadata: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  tableName: 'recommendation_cache',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['cache_type'] },
    { fields: ['seed_product_id'] },
    { fields: ['user_id'] },
    { fields: ['session_id'] },
    { fields: ['seed_region'] },
    { fields: ['expires_at'] }
  ]
});

module.exports = RecommendationCache;
