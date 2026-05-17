require('dotenv').config();
const mysql = require('mysql2/promise');

const tables = [
  'recommendation_cache',
  'region_analytics',
  'search_analytics',
  'product_analytics',
  'user_activities',
  'user_sessions',
  'reviews',
  'wishlists',
  'cart_items',
  'order_timeline',
  'order_addresses',
  'order_items',
  'orders',
  'flash_sale_banners',
  'product_videos',
  'product_images',
  'products',
  'brands',
  'categories',
  'user_addresses',
  'users',
  'notifications',
  'contact_messages',
  'site_settings',
];

async function runTeardown() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'segztech',
    });

    console.log('Connected to database. Dropping all tables...\n');

    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

    for (const table of tables) {
      try {
        await connection.execute(`DROP TABLE IF EXISTS \`${table}\``);
        console.log(`  ✓ ${table} dropped`);
      } catch (err) {
        console.log(`  ✗ ${table}: ${err.message}`);
      }
    }

    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    console.log('\nAll tables dropped successfully!');
  } catch (error) {
    console.error('Teardown failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

if (require.main === module) {
  runTeardown();
}

module.exports = { runTeardown };
