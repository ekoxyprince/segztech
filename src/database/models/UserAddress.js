const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const UserAddress = sequelize.define('UserAddress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  label: {
    type: DataTypes.STRING(50)
  },
  full_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: false
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
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'user_addresses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = UserAddress;
