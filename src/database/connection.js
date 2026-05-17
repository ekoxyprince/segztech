/**
 * Sequelize Database Connection
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'segztech',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully!');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
}

module.exports = {
  sequelize,
  testConnection
};
