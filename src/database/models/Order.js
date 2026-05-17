const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  order_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  user_id: {
    type: DataTypes.UUID
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  shipping_cost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  shipping_label: {
    type: DataTypes.STRING(100)
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  payment_method: {
    type: DataTypes.STRING(50)
  },
  shipping_carrier: {
    type: DataTypes.STRING(100)
  },
  tracking_number: {
    type: DataTypes.STRING(100)
  },
  estimated_delivery: {
    type: DataTypes.DATEONLY
  },
  delivered_at: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Order;
