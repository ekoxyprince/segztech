const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const ProductVideo = sequelize.define('ProductVideo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  video_url: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  thumbnail_url: {
    type: DataTypes.STRING(500)
  },
  title: {
    type: DataTypes.STRING(255)
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'product_videos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = ProductVideo;
