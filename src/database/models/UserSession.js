const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const UserSession = sequelize.define('UserSession', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  session_id: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  ip_address: {
    type: DataTypes.STRING(45)
  },
  user_agent: {
    type: DataTypes.TEXT
  },
  device_type: {
    type: DataTypes.ENUM('desktop', 'mobile', 'tablet', 'bot'),
    defaultValue: 'desktop'
  },
  browser: {
    type: DataTypes.STRING(100)
  },
  os: {
    type: DataTypes.STRING(100)
  },
  country: {
    type: DataTypes.STRING(100)
  },
  region: {
    type: DataTypes.STRING(100)
  },
  city: {
    type: DataTypes.STRING(100)
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8)
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8)
  },
  timezone: {
    type: DataTypes.STRING(100)
  },
  language: {
    type: DataTypes.STRING(10)
  },
  cookies_accepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  marketing_accepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  first_visit: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  last_activity: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  total_page_views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_time_spent: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  pages_visited: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  searches_made: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  products_viewed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  products_added_to_cart: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  checkout_attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  orders_completed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_spent: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  interests: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  search_history: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  view_history: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  purchase_history: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  conversion_path: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  tableName: 'user_sessions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = UserSession;
