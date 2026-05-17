const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const SiteSetting = sequelize.define('SiteSetting', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  site_name: {
    type: DataTypes.STRING(100),
    defaultValue: 'SegzTech'
  },
  site_email: {
    type: DataTypes.STRING(100),
    defaultValue: 'info@segztech.com'
  },
  site_phone: {
    type: DataTypes.STRING(50),
    defaultValue: '+234 800 000 0000'
  },
  site_address: {
    type: DataTypes.STRING(500),
    defaultValue: '123 Main Street, Lagos, Nigeria'
  },
  currency: {
    type: DataTypes.STRING(10),
    defaultValue: 'NGN'
  },
  currency_symbol: {
    type: DataTypes.STRING(10),
    defaultValue: '₦'
  },
  payment_paystack: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  payment_whatsapp: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  whatsapp_number: {
    type: DataTypes.STRING(50),
    defaultValue: ''
  },
  notify_email: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notify_new_product: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'site_settings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = SiteSetting;
