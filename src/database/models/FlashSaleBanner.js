const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const FlashSaleBanner = sequelize.define('FlashSaleBanner', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  subtitle: {
    type: DataTypes.STRING(100)
  },
  description: {
    type: DataTypes.TEXT
  },
  image: {
    type: DataTypes.STRING(500)
  },
  link: {
    type: DataTypes.STRING(255)
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  start_date: {
    type: DataTypes.DATE
  },
  end_date: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'flash_sale_banners',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = FlashSaleBanner;
