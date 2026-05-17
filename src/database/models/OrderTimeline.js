const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const OrderTimeline = sequelize.define('OrderTimeline', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  note: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'order_timeline',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = OrderTimeline;
