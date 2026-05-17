const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const OrderAddress = sequelize.define('OrderAddress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  full_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255)
  },
  street: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  state: {
    type: DataTypes.STRING(100)
  },
  zip_code: {
    type: DataTypes.STRING(20)
  },
  country: {
    type: DataTypes.STRING(100),
    defaultValue: 'United States'
  }
}, {
  tableName: 'order_addresses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = OrderAddress;
