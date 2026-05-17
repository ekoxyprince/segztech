const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const ProductImage = sequelize.define('ProductImage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  alt_text: {
    type: DataTypes.STRING(255)
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_primary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'product_images',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = ProductImage;
