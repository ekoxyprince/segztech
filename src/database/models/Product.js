const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  short_description: {
    type: DataTypes.STRING(500)
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  original_price: {
    type: DataTypes.DECIMAL(10, 2)
  },
  discount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  category_id: {
    type: DataTypes.UUID
  },
  subcategory: {
    type: DataTypes.STRING(100)
  },
  brand_id: {
    type: DataTypes.UUID
  },
  brand: {
    type: DataTypes.STRING(100)
  },
  model_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  series: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  sold_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  ratings: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0
  },
  review_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_flash_sale: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_hot_pick: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sku: {
    type: DataTypes.STRING(100)
  },
  specs: {
    type: DataTypes.JSON
  },
  tags: {
    type: DataTypes.JSON
  }
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Product;
