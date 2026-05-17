/**
 * Database Schema / Migrations
 * Creates all necessary tables for SegzTech e-commerce
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const migrations = [
  // Users Table
  `CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(50),
    avatar VARCHAR(500),
    role ENUM('user', 'admin') DEFAULT 'user',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    email_notifications BOOLEAN DEFAULT TRUE,
    total_spent DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // User Addresses Table
  `CREATE TABLE IF NOT EXISTS user_addresses (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    label VARCHAR(50),
    full_name VARCHAR(200) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'United States',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Categories Table
  `CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    parent_id VARCHAR(36),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_parent (parent_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Brands Table
  `CREATE TABLE IF NOT EXISTS brands (
id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo VARCHAR(255),
    website VARCHAR(255),
    categories JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Products Table
  `CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    short_description VARCHAR(500),
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    discount INT DEFAULT 0,
    category_id VARCHAR(36),
    subcategory VARCHAR(100),
    brand_id VARCHAR(36),
    brand VARCHAR(100),
    model_name VARCHAR(255),
    series VARCHAR(255),
    stock INT DEFAULT 0,
    sold_count INT DEFAULT 0,
    ratings DECIMAL(3, 2) DEFAULT 0,
    review_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_flash_sale BOOLEAN DEFAULT FALSE,
    is_hot_pick BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sku VARCHAR(100),
    specs JSON,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_category (category_id),
    INDEX idx_brand (brand_id),
    INDEX idx_model (model_name),
    INDEX idx_featured (is_featured),
    INDEX idx_flash_sale (is_flash_sale),
    INDEX idx_price (price),
    INDEX idx_stock (stock),
    FULLTEXT idx_search (name, short_description, description)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Product Images Table
  `CREATE TABLE IF NOT EXISTS product_images (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Product Videos Table
  `CREATE TABLE IF NOT EXISTS product_videos (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    title VARCHAR(255),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Orders Table
  `CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id VARCHAR(36),
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    shipping_label VARCHAR(100),
    tax DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    shipping_carrier VARCHAR(100),
    tracking_number VARCHAR(100),
    estimated_delivery DATE,
    delivered_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_order_number (order_number),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Order Items Table
  `CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36),
    name VARCHAR(255) NOT NULL,
    image VARCHAR(500),
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    specs JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Order Shipping Address Table
  `CREATE TABLE IF NOT EXISTS order_addresses (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) UNIQUE NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'United States',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Order Timeline Table
  `CREATE TABLE IF NOT EXISTS order_timeline (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    status VARCHAR(50) NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Flash Sale Banners Table
  `CREATE TABLE IF NOT EXISTS flash_sale_banners (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    subtitle VARCHAR(100),
    description TEXT,
    image VARCHAR(500),
    link VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active (is_active)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Cart Items Table
  `CREATE TABLE IF NOT EXISTS cart_items (
    id VARCHAR(36) PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    user_id VARCHAR(36),
    product_id VARCHAR(36) NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_id (session_id),
    INDEX idx_user_id (user_id),
    UNIQUE KEY unique_cart_item (session_id, product_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Wishlist Table
  `CREATE TABLE IF NOT EXISTS wishlists (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist_item (user_id, product_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Reviews Table
  `CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_user_id (user_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // User Sessions Table - Tracks individual user sessions
  `CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR(36) PRIMARY KEY,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    user_id VARCHAR(36),
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_type ENUM('desktop', 'mobile', 'tablet', 'bot') DEFAULT 'desktop',
    browser VARCHAR(100),
    os VARCHAR(100),
    country VARCHAR(100),
    region VARCHAR(100),
    city VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    timezone VARCHAR(100),
    language VARCHAR(10),
    cookies_accepted BOOLEAN DEFAULT FALSE,
    marketing_accepted BOOLEAN DEFAULT FALSE,
    first_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    total_page_views INT DEFAULT 0,
    total_time_spent INT DEFAULT 0,
    pages_visited JSON,
    searches_made INT DEFAULT 0,
    products_viewed INT DEFAULT 0,
    products_added_to_cart INT DEFAULT 0,
    checkout_attempts INT DEFAULT 0,
    orders_completed INT DEFAULT 0,
    total_spent DECIMAL(12, 2) DEFAULT 0,
    interests JSON,
    search_history JSON,
    view_history JSON,
    purchase_history JSON,
    conversion_path JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_session_id (session_id),
    INDEX idx_user_id (user_id),
    INDEX idx_country (country),
    INDEX idx_last_activity (last_activity)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // User Activities Table - Tracks all user interactions
  `CREATE TABLE IF NOT EXISTS user_activities (
    id VARCHAR(36) PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    user_id VARCHAR(36),
    activity_type ENUM('page_view', 'product_view', 'search', 'filter_apply', 'add_to_cart', 'remove_from_cart', 'update_cart', 'wishlist_add', 'wishlist_remove', 'checkout_start', 'checkout_complete', 'checkout_abandon', 'payment_success', 'payment_failed', 'click', 'scroll_depth', 'time_on_page', 'video_play', 'image_zoom', 'share', 'review_submit', 'compare', 'sort_change') NOT NULL,
    page_url VARCHAR(500),
    page_name VARCHAR(255),
    product_id VARCHAR(36),
    product_name VARCHAR(255),
    product_category VARCHAR(100),
    product_price DECIMAL(10, 2),
    product_brand VARCHAR(100),
    search_query VARCHAR(500),
    search_results_count INT,
    filters_applied JSON,
    sort_option VARCHAR(50),
    referrer_url VARCHAR(500),
    referrer_type ENUM('direct', 'search', 'social', 'email', 'affiliate', 'internal'),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    device_type ENUM('desktop', 'mobile', 'tablet') DEFAULT 'desktop',
    country VARCHAR(100),
    region VARCHAR(100),
    city VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    browser VARCHAR(100),
    os VARCHAR(100),
    screen_resolution VARCHAR(20),
    viewport_size VARCHAR(20),
    scroll_depth INT,
    time_on_page INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_session_id (session_id),
    INDEX idx_user_id (user_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_product_id (product_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_country (country),
    INDEX idx_search_query (search_query)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Product Analytics Table - Daily product-level metrics
  `CREATE TABLE IF NOT EXISTS product_analytics (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    product_name VARCHAR(255),
    product_category VARCHAR(100),
    product_brand VARCHAR(100),
    date DATE NOT NULL,
    views INT DEFAULT 0,
    unique_views INT DEFAULT 0,
    cart_adds INT DEFAULT 0,
    cart_removes INT DEFAULT 0,
    purchases INT DEFAULT 0,
    wishlist_adds INT DEFAULT 0,
    search_impressions INT DEFAULT 0,
    search_clicks INT DEFAULT 0,
    click_through_rate DECIMAL(5, 4) DEFAULT 0,
    conversion_rate DECIMAL(5, 4) DEFAULT 0,
    add_to_cart_rate DECIMAL(5, 4) DEFAULT 0,
    avg_time_on_page INT DEFAULT 0,
    avg_scroll_depth INT DEFAULT 0,
    bounce_rate DECIMAL(5, 4) DEFAULT 0,
    revenue DECIMAL(12, 2) DEFAULT 0,
    stock_level INT DEFAULT 0,
    demand_score DECIMAL(5, 2) DEFAULT 0,
    trending_score DECIMAL(5, 2) DEFAULT 0,
    region_data JSON,
    device_breakdown JSON,
    source_breakdown JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_product_id (product_id),
    INDEX idx_date (date),
    INDEX idx_category (product_category),
    INDEX idx_trending (trending_score),
    INDEX idx_demand (demand_score)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Search Analytics Table - Search query tracking
  `CREATE TABLE IF NOT EXISTS search_analytics (
    id VARCHAR(36) PRIMARY KEY,
    search_query VARCHAR(500) NOT NULL,
    normalized_query VARCHAR(500),
    search_count INT DEFAULT 1,
    unique_users INT DEFAULT 0,
    results_count INT DEFAULT 0,
    clicks_count INT DEFAULT 0,
    click_through_rate DECIMAL(5, 4) DEFAULT 0,
    add_to_cart_count INT DEFAULT 0,
    conversion_count INT DEFAULT 0,
    no_results_count INT DEFAULT 0,
    avg_results DECIMAL(6, 2) DEFAULT 0,
    avg_position_clicked DECIMAL(4, 2) DEFAULT 0,
    date DATE NOT NULL,
    hour INT,
    country VARCHAR(100),
    region VARCHAR(100),
    device_type ENUM('desktop', 'mobile', 'tablet') DEFAULT 'desktop',
    top_clicked_products JSON,
    category_intent VARCHAR(100),
    brand_intent VARCHAR(100),
    price_range_intent JSON,
    feature_intent JSON,
    sentiment ENUM('positive', 'neutral', 'negative') DEFAULT 'neutral',
    related_queries JSON,
    autocomplete_suggestion VARCHAR(255),
    ai_enhanced BOOLEAN DEFAULT FALSE,
    intent_score DECIMAL(5, 4) DEFAULT 0,
    personalization_applied BOOLEAN DEFAULT FALSE,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_search_query (search_query),
    INDEX idx_normalized (normalized_query),
    INDEX idx_date (date),
    INDEX idx_count (search_count),
    INDEX idx_ctr (click_through_rate)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Recommendation Cache Table - Stores computed recommendations
  `CREATE TABLE IF NOT EXISTS recommendation_cache (
    id VARCHAR(36) PRIMARY KEY,
    cache_type ENUM('product_complementary', 'user_similar', 'category_popular', 'trending', 'region_based', 'purchase_pattern', 'viewed_together', 'search_related', 'frequently_bought') NOT NULL,
    seed_product_id VARCHAR(36),
    seed_category VARCHAR(100),
    seed_region VARCHAR(100),
    user_id VARCHAR(36),
    session_id VARCHAR(100),
    recommended_products JSON NOT NULL,
    recommendation_scores JSON,
    recommendation_reasons JSON,
    confidence_score DECIMAL(5, 4) DEFAULT 0,
    algorithm_version VARCHAR(20) DEFAULT '1.0',
    data_points_used INT DEFAULT 0,
    impressions INT DEFAULT 0,
    clicks INT DEFAULT 0,
    conversions INT DEFAULT 0,
    click_through_rate DECIMAL(5, 4) DEFAULT 0,
    conversion_rate DECIMAL(5, 4) DEFAULT 0,
    expires_at TIMESTAMP NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cache_type (cache_type),
    INDEX idx_seed_product (seed_product_id),
    INDEX idx_user (user_id),
    INDEX idx_session (session_id),
    INDEX idx_region (seed_region),
    INDEX idx_expires (expires_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Region Analytics Table - Geographic analytics
  `CREATE TABLE IF NOT EXISTS region_analytics (
    id VARCHAR(36) PRIMARY KEY,
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    city VARCHAR(100),
    date DATE NOT NULL,
    sessions INT DEFAULT 0,
    unique_visitors INT DEFAULT 0,
    page_views INT DEFAULT 0,
    avg_session_duration INT DEFAULT 0,
    bounce_rate DECIMAL(5, 4) DEFAULT 0,
    new_visitors INT DEFAULT 0,
    returning_visitors INT DEFAULT 0,
    conversions INT DEFAULT 0,
    conversion_rate DECIMAL(5, 4) DEFAULT 0,
    revenue DECIMAL(12, 2) DEFAULT 0,
    avg_order_value DECIMAL(10, 2) DEFAULT 0,
    cart_abandonment_rate DECIMAL(5, 4) DEFAULT 0,
    top_categories JSON,
    top_products JSON,
    top_searches JSON,
    device_breakdown JSON,
    browser_breakdown JSON,
    os_breakdown JSON,
    popular_hours JSON,
    popular_days JSON,
    timezone VARCHAR(100),
    currency VARCHAR(10),
    language VARCHAR(10),
    interests JSON,
    buying_power_index DECIMAL(5, 2) DEFAULT 0,
    engagement_score DECIMAL(5, 2) DEFAULT 0,
    market_potential DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_country (country),
    INDEX idx_region (region),
    INDEX idx_city (city),
    INDEX idx_date (date)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Notifications Table
  `CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSON,
    is_read BOOLEAN DEFAULT FALSE,
    email_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Contact Messages Table
  `CREATE TABLE IF NOT EXISTS contact_messages (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  // Site Settings Table
  `CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    site_name VARCHAR(100) DEFAULT 'SegzTech',
    site_email VARCHAR(100) DEFAULT 'info@segztech.com',
    site_phone VARCHAR(50) DEFAULT '+234 800 000 0000',
    site_address VARCHAR(500) DEFAULT '123 Main Street, Lagos, Nigeria',
    currency VARCHAR(10) DEFAULT 'NGN',
    currency_symbol VARCHAR(10) DEFAULT '\u20a6',
    payment_paystack BOOLEAN DEFAULT TRUE,
    payment_whatsapp BOOLEAN DEFAULT FALSE,
    whatsapp_number VARCHAR(50) DEFAULT '',
    notify_email BOOLEAN DEFAULT TRUE,
    notify_new_product BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
];

async function runMigrations() {
  let connection;
  
  try {
    // First connect without database to create it if needed
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD
    });

    // Create database if not exists
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'segztech'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log('Database created or already exists');

    // Switch to the database
    await connection.changeUser({ database: process.env.DB_NAME || 'segztech' });

    // Run all migrations
    console.log('Running migrations...');
    for (let i = 0; i < migrations.length; i++) {
      const migration = migrations[i];
      const tableName = migration.match(/CREATE TABLE IF NOT EXISTS `?(\w+)/)?.[1] || `Table ${i + 1}`;
      try {
        await connection.execute(migration);
        console.log(`✓ ${tableName} table created/migrated`);
      } catch (error) {
        console.error(`✗ Error in ${tableName}:`, error.message);
      }
    }

    // Add condition column to products table if it doesn't exist
    try {
      await connection.execute(`ALTER TABLE products ADD COLUMN IF NOT EXISTS condition ENUM('new', 'used_like_new', 'used_good', 'used_fair', 'refurbished') DEFAULT 'new'`);
      console.log('✓ Added condition column to products table');
    } catch (error) {
      // Ignore if column already exists or other errors
      console.log('  (condition column may already exist)');
    }

    // Add model_name column to products table if it doesn't exist
    try {
      await connection.execute(`ALTER TABLE products ADD COLUMN IF NOT EXISTS model_name VARCHAR(255)`);
      console.log('✓ Added model_name column to products table');
    } catch (error) {
      console.log('  (model_name column may already exist)');
    }

    // Add series column to products table if it doesn't exist
    try {
      await connection.execute(`ALTER TABLE products ADD COLUMN IF NOT EXISTS series VARCHAR(255)`);
      console.log('✓ Added series column to products table');
    } catch (error) {
      console.log('  (series column may already exist)');
    }

    console.log('\nAll migrations completed!');
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run if called directly
if (require.main === module) {
  runMigrations().then(() => {
    console.log('Migration script finished');
    process.exit(0);
  });
}

module.exports = { runMigrations };
