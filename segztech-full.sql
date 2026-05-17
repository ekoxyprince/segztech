-- =============================================================
-- SegzTech E-Commerce Database
-- Complete Schema + Seed Data
-- Compatible with MySQL 8.0+
-- =============================================================

USE znozxuze_root;

-- =============================================================
-- SCHEMA
-- =============================================================

-- Users
CREATE TABLE IF NOT EXISTS users (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Addresses
CREATE TABLE IF NOT EXISTS user_addresses (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories
CREATE TABLE IF NOT EXISTS categories (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Brands
CREATE TABLE IF NOT EXISTS brands (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo VARCHAR(500),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    website VARCHAR(255),
    categories JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products
CREATE TABLE IF NOT EXISTS products (
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
    `condition` ENUM('new', 'used_like_new', 'used_good', 'used_fair', 'refurbished') DEFAULT 'new',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Images
CREATE TABLE IF NOT EXISTS product_images (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Videos
CREATE TABLE IF NOT EXISTS product_videos (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    video_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    title VARCHAR(255),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders
CREATE TABLE IF NOT EXISTS orders (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order Shipping Addresses
CREATE TABLE IF NOT EXISTS order_addresses (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order Timeline
CREATE TABLE IF NOT EXISTS order_timeline (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    status VARCHAR(50) NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Flash Sale Banners
CREATE TABLE IF NOT EXISTS flash_sale_banners (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    subtitle VARCHAR(100),
    description TEXT,
    image VARCHAR(500),
    link VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    start_date TIMESTAMP NULL,
    end_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Wishlists
CREATE TABLE IF NOT EXISTS wishlists (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist_item (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Sessions (analytics tracking)
CREATE TABLE IF NOT EXISTS user_sessions (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Activities
CREATE TABLE IF NOT EXISTS user_activities (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Analytics
CREATE TABLE IF NOT EXISTS product_analytics (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Search Analytics
CREATE TABLE IF NOT EXISTS search_analytics (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Recommendation Cache
CREATE TABLE IF NOT EXISTS recommendation_cache (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Region Analytics
CREATE TABLE IF NOT EXISTS region_analytics (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    site_name VARCHAR(100) DEFAULT 'SegzTech',
    site_email VARCHAR(100) DEFAULT 'info@segztech.com',
    site_phone VARCHAR(50) DEFAULT '+234 800 000 0000',
    site_address VARCHAR(500) DEFAULT '123 Main Street, Lagos, Nigeria',
    currency VARCHAR(10) DEFAULT 'NGN',
    currency_symbol VARCHAR(10) DEFAULT '₦',
    payment_paystack BOOLEAN DEFAULT TRUE,
    payment_whatsapp BOOLEAN DEFAULT FALSE,
    whatsapp_number VARCHAR(50) DEFAULT '',
    notify_email BOOLEAN DEFAULT TRUE,
    notify_new_product BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- DROP ALL TABLES (run this section first to reset)
-- =============================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS recommendation_cache;
DROP TABLE IF EXISTS region_analytics;
DROP TABLE IF EXISTS search_analytics;
DROP TABLE IF EXISTS product_analytics;
DROP TABLE IF EXISTS user_activities;
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS wishlists;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS order_timeline;
DROP TABLE IF EXISTS order_addresses;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS flash_sale_banners;
DROP TABLE IF EXISTS product_videos;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS user_addresses;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS site_settings;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================
-- SEED DATA
-- =============================================================

-- Disable FK checks for clean insert
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE reviews;
TRUNCATE TABLE wishlists;
TRUNCATE TABLE cart_items;
TRUNCATE TABLE order_timeline;
TRUNCATE TABLE order_addresses;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE product_videos;
TRUNCATE TABLE product_images;
TRUNCATE TABLE products;
TRUNCATE TABLE brands;
TRUNCATE TABLE categories;
TRUNCATE TABLE user_addresses;
TRUNCATE TABLE users;
TRUNCATE TABLE flash_sale_banners;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------
-- Categories
-- ---------------------------------------------------------
INSERT INTO categories (id, name, slug, icon, sort_order, is_active) VALUES
('a0000000-0000-0000-0000-000000000001', 'Phones',        'phones',         'smartphone', 1, TRUE),
('a0000000-0000-0000-0000-000000000002', 'Laptops',       'laptops',        'laptop',     2, TRUE),
('a0000000-0000-0000-0000-000000000003', 'Tablets',       'tablets',        'tablet',     3, TRUE),
('a0000000-0000-0000-0000-000000000004', 'Accessories',   'accessories',    'headphones', 4, TRUE),
('a0000000-0000-0000-0000-000000000005', 'Wearables',     'wearables',      'watch',      5, TRUE),
('a0000000-0000-0000-0000-000000000006', 'Gaming',        'gaming',         'gamepad',    6, TRUE),
('a0000000-0000-0000-0000-000000000007', 'Monitors',      'monitors',       'desktop',    7, TRUE),
('a0000000-0000-0000-0000-000000000008', 'Game Consoles', 'game_consoles',  'gamepad',    8, TRUE);

-- ---------------------------------------------------------
-- Brands
-- ---------------------------------------------------------
INSERT INTO brands (id, name, slug, logo) VALUES
('b0000000-0000-0000-0000-000000000001', 'Apple',    'apple',    'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'),
('b0000000-0000-0000-0000-000000000002', 'Samsung',  'samsung',  'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg'),
('b0000000-0000-0000-0000-000000000003', 'Sony',     'sony',     'https://upload.wikimedia.org/wikipedia/commons/c/c2/Sony_logo_2.svg'),
('b0000000-0000-0000-0000-000000000004', 'Dell',     'dell',     'https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg'),
('b0000000-0000-0000-0000-000000000005', 'Google',   'google',   'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg'),
('b0000000-0000-0000-0000-000000000006', 'OnePlus',  'oneplus',  'https://upload.wikimedia.org/wikipedia/commons/2/29/OnePlus_logo_2020.svg'),
('b0000000-0000-0000-0000-000000000007', 'ASUS',     'asus',     'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg'),
('b0000000-0000-0000-0000-000000000008', 'Lenovo',   'lenovo',   'https://upload.wikimedia.org/wikipedia/commons/0/03/Lenovo_Global_Corporate_Logo.png'),
('b0000000-0000-0000-0000-000000000009', 'Anker',    'anker',    ''),
('b0000000-0000-0000-0000-000000000010', 'Logitech', 'logitech', 'https://upload.wikimedia.org/wikipedia/commons/3/30/Logitech_logo.svg');

-- ---------------------------------------------------------
-- Users
-- ---------------------------------------------------------
-- Passwords:
--   support@segztech.com / admin123
--   john@example.com    / password123
--   jane@example.com    / password123
INSERT INTO users (id, email, password, first_name, last_name, phone, avatar, role, status) VALUES
('u0000000-0000-0000-0000-000000000001', 'support@segztech.com', '$2a$10$z0jsHBwo7AiL2bEHfaLkquCX.nQAdTPvBGZ9tNcwAB7wmjW6Thz2e', 'Admin', 'User',   '+1987654321', 'https://ui-avatars.com/api/?name=Admin+User&background=ff9900&color=fff&size=200', 'admin', 'active'),
('u0000000-0000-0000-0000-000000000002', 'john@example.com',    '$2a$10$8IDLDxQ2cATyj5Y0NbnVI.nyuY3ZY8Eq83XUNgpIpT3ktp14BCY6m', 'John',  'Doe',    '+1234567890', 'https://ui-avatars.com/api/?name=John+Doe&background=ff9900&color=fff&size=200', 'user',  'active'),
('u0000000-0000-0000-0000-000000000003', 'jane@example.com',    '$2a$10$8IDLDxQ2cATyj5Y0NbnVI.nyuY3ZY8Eq83XUNgpIpT3ktp14BCY6m', 'Jane',  'Smith',  '+1987654321', 'https://ui-avatars.com/api/?name=Jane+Smith&background=0984e3&color=fff&size=200', 'user',  'active');

-- ---------------------------------------------------------
-- User Addresses
-- ---------------------------------------------------------
INSERT INTO user_addresses (id, user_id, label, full_name, phone, street, city, state, zip_code, country, is_default) VALUES
('ua000000-0000-0000-0000-000000000001', 'u0000000-0000-0000-0000-000000000002', 'Home',  'John Doe', '+1234567890', '123 Main Street',       'New York', 'NY', '10001', 'United States', TRUE),
('ua000000-0000-0000-0000-000000000002', 'u0000000-0000-0000-0000-000000000002', 'Office', 'John Doe', '+1234567890', '456 Business Ave, Suite 100', 'New York', 'NY', '10002', 'United States', FALSE);

-- ---------------------------------------------------------
-- Products
-- ---------------------------------------------------------
INSERT INTO products (id, name, slug, short_description, description, price, original_price, discount, category_id, subcategory, brand_id, brand, stock, ratings, review_count, sold_count, is_featured, is_flash_sale, is_hot_pick, tags, specs, `condition`) VALUES
(
  'p0000000-0000-0000-0000-000000000001',
  'iPhone 15 Pro Max 256GB',
  'iphone-15-pro-max-256gb',
  'Titanium design, A17 Pro chip, 5x optical zoom',
  'The iPhone 15 Pro Max features a titanium design, A17 Pro chip, and a pro camera system with 5x optical zoom. Experience the most powerful iPhone ever.',
  1199.99, 1299.99, 8,
  'a0000000-0000-0000-0000-000000000001', 'apple',
  'b0000000-0000-0000-0000-000000000001', 'Apple',
  50, 4.8, 245, 1850, TRUE, TRUE, TRUE,
  JSON_ARRAY('new', 'trending', 'premium'),
  JSON_OBJECT('display', '6.7-inch Super Retina XDR', 'processor', 'A17 Pro chip', 'ram', '8GB', 'storage', '256GB', 'camera', '48MP Main + 12MP Ultra Wide + 12MP Telephoto', 'battery', '4422mAh', 'os', 'iOS 17'),
  'new'
),
(
  'p0000000-0000-0000-0000-000000000002',
  'Samsung Galaxy S24 Ultra 512GB',
  'samsung-galaxy-s24-ultra-512gb',
  'Built-in S Pen, AI camera, Snapdragon 8 Gen 3',
  'Galaxy S24 Ultra with built-in S Pen, AI-powered camera, and Snapdragon 8 Gen 3 processor. The ultimate Galaxy experience.',
  1299.99, 1419.99, 8,
  'a0000000-0000-0000-0000-000000000001', 'samsung',
  'b0000000-0000-0000-0000-000000000002', 'Samsung',
  35, 4.7, 189, 1200, TRUE, TRUE, FALSE,
  JSON_ARRAY('new', 'trending', 'premium'),
  JSON_OBJECT('display', '6.8-inch Dynamic AMOLED 2X', 'processor', 'Snapdragon 8 Gen 3', 'ram', '12GB', 'storage', '512GB', 'camera', '200MP Main + 12MP Ultra Wide + 50MP Telephoto', 'battery', '5000mAh', 'os', 'Android 14, One UI 6.1'),
  'new'
),
(
  'p0000000-0000-0000-0000-000000000003',
  'MacBook Pro 14" M3 Pro 512GB',
  'macbook-pro-14-m3-pro-512gb',
  'M3 Pro chip, Liquid Retina XDR, 18hr battery',
  'MacBook Pro with M3 Pro chip delivers exceptional performance for pro workflows. Features Liquid Retina XDR display and up to 18 hours battery life.',
  1999.99, 2199.99, 9,
  'a0000000-0000-0000-0000-000000000002', 'apple',
  'b0000000-0000-0000-0000-000000000001', 'Apple',
  25, 4.9, 156, 890, TRUE, FALSE, TRUE,
  JSON_ARRAY('new', 'premium', 'bestseller'),
  JSON_OBJECT('display', '14.2-inch Liquid Retina XDR', 'processor', 'Apple M3 Pro', 'ram', '18GB Unified Memory', 'storage', '512GB SSD', 'graphics', '12-core GPU', 'battery', 'Up to 18 hours', 'weight', '1.61 kg'),
  'new'
),
(
  'p0000000-0000-0000-0000-000000000004',
  'Dell XPS 15 Intel i9 32GB 1TB',
  'dell-xps-15-intel-i9-32gb-1tb',
  'Intel i9, 32GB RAM, 15.6" OLED display',
  'Dell XPS 15 with 13th Gen Intel Core i9 processor, 32GB RAM, and stunning 15.6-inch OLED display. Perfect for creators and professionals.',
  1799.99, 2099.99, 14,
  'a0000000-0000-0000-0000-000000000002', 'dell',
  'b0000000-0000-0000-0000-000000000004', 'Dell',
  20, 4.6, 98, 456, TRUE, TRUE, TRUE,
  JSON_ARRAY('premium', 'creator'),
  JSON_OBJECT('display', '15.6-inch 3.5K OLED', 'processor', '13th Gen Intel Core i9-13900H', 'ram', '32GB DDR5', 'storage', '1TB SSD', 'graphics', 'NVIDIA RTX 4060 6GB', 'battery', '86Whr', 'weight', '1.86 kg'),
  'new'
),
(
  'p0000000-0000-0000-0000-000000000005',
  'AirPods Pro 2nd Generation',
  'airpods-pro-2nd-generation',
  'Active noise cancellation, spatial audio',
  'AirPods Pro with active noise cancellation, adaptive audio, and personalized spatial audio. Up to 6 hours of listening time.',
  229.99, 249.99, 8,
  'a0000000-0000-0000-0000-000000000004', 'earphones',
  'b0000000-0000-0000-0000-000000000001', 'Apple',
  100, 4.7, 567, 4500, FALSE, TRUE, TRUE,
  JSON_ARRAY('trending', 'bestseller'),
  JSON_OBJECT('type', 'In-ear', 'noiseCancellation', 'Active Noise Cancellation', 'battery', 'Up to 6 hours (30 hours with case)', 'connectivity', 'Bluetooth 5.3', 'features', 'Adaptive Audio, Personalized Spatial Audio'),
  'new'
),
(
  'p0000000-0000-0000-0000-000000000006',
  'Sony WH-1000XM5 Headphones',
  'sony-wh-1000xm5-headphones',
  'Industry-leading ANC, 30hr battery',
  'Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling and up to 30 hours battery life.',
  349.99, 399.99, 12,
  'a0000000-0000-0000-0000-000000000004', 'headphones',
  'b0000000-0000-0000-0000-000000000003', 'Sony',
  45, 4.8, 423, 2100, TRUE, FALSE, TRUE,
  JSON_ARRAY('premium', 'bestseller'),
  JSON_OBJECT('type', 'Over-ear', 'noiseCancellation', 'Industry-leading ANC', 'battery', 'Up to 30 hours', 'connectivity', 'Bluetooth 5.2, 3.5mm jack'),
  'new'
),
(
  'p0000000-0000-0000-0000-000000000007',
  'iPad Pro 12.9" M2 256GB WiFi',
  'ipad-pro-12-9-m2-256gb-wifi',
  'M2 chip, Liquid Retina XDR, Apple Pencil support',
  'iPad Pro with M2 chip, Liquid Retina XDR display, and Apple Pencil hover. The ultimate iPad experience for professionals.',
  1099.99, 1199.99, 8,
  'a0000000-0000-0000-0000-000000000003', 'apple',
  'b0000000-0000-0000-0000-000000000001', 'Apple',
  30, 4.8, 234, 1560, TRUE, TRUE, FALSE,
  JSON_ARRAY('premium', 'trending'),
  JSON_OBJECT('display', '12.9-inch Liquid Retina XDR', 'processor', 'Apple M2 chip', 'ram', '8GB', 'storage', '256GB', 'camera', '12MP Wide + 10MP Ultra Wide', 'battery', 'Up to 10 hours'),
  'new'
),
(
  'p0000000-0000-0000-0000-000000000008',
  'Apple Watch Ultra 2',
  'apple-watch-ultra-2',
  'Rugged design, 36hr battery, 100m water resistant',
  'The most rugged and capable Apple Watch with precision dual-frequency GPS, 36-hour battery life, and water resistance to 100m.',
  799.99, 849.99, 6,
  'a0000000-0000-0000-0000-000000000005', 'smartwatch',
  'b0000000-0000-0000-0000-000000000001', 'Apple',
  40, 4.9, 178, 1200, TRUE, TRUE, TRUE,
  JSON_ARRAY('premium', 'new'),
  JSON_OBJECT('display', '49mm Always-On Retina LTPO OLED', 'processor', 'S9 SiP', 'battery', 'Up to 36 hours', 'waterResistance', '100m'),
  'new'
),
(
  'p0000000-0000-0000-0000-000000000009',
  'OnePlus 12 256GB',
  'oneplus-12-256gb',
  'Snapdragon 8 Gen 3, 100W fast charging, Hasselblad camera',
  'OnePlus 12 with Snapdragon 8 Gen 3, 100W SUPERVOOC charging, and 50MP Hasselblad camera system.',
  799.99, 899.99, 11,
  'a0000000-0000-0000-0000-000000000001', 'oneplus',
  'b0000000-0000-0000-0000-000000000006', 'OnePlus',
  55, 4.5, 89, 780, FALSE, TRUE, FALSE,
  JSON_ARRAY('value', 'performance'),
  JSON_OBJECT('display', '6.82-inch LTPO AMOLED', 'processor', 'Snapdragon 8 Gen 3', 'ram', '12GB', 'storage', '256GB', 'camera', '50MP Main + 48MP Ultra Wide', 'battery', '5400mAh', 'charging', '100W SUPERVOOC'),
  'new'
),
(
  'p0000000-0000-0000-0000-000000000010',
  'Google Pixel 8 Pro 128GB',
  'google-pixel-8-pro-128gb',
  'Tensor G3 chip, AI features, 7 years updates',
  'Pixel 8 Pro with Google Tensor G3 chip, the best Pixel camera yet, and 7 years of OS and security updates.',
  899.99, 999.99, 10,
  'a0000000-0000-0000-0000-000000000001', 'google',
  'b0000000-0000-0000-0000-000000000005', 'Google',
  38, 4.6, 145, 920, TRUE, FALSE, TRUE,
  JSON_ARRAY('ai', 'camera'),
  JSON_OBJECT('display', '6.7-inch LTPO OLED', 'processor', 'Google Tensor G3', 'ram', '12GB', 'storage', '128GB', 'camera', '50MP Main + 48MP Ultra Wide', 'battery', '5050mAh'),
  'new'
),
(
  'p0000000-0000-0000-0000-000000000011',
  'ASUS ROG Zephyrus G14',
  'asus-rog-zephyrus-g14',
  'Ryzen 9, RTX 4090, 14" Nebula HDR display',
  'Ultra-thin gaming laptop with AMD Ryzen 9, RTX 4090, and 14-inch Nebula HDR display. Gaming power meets portability.',
  2199.99, 2499.99, 12,
  'a0000000-0000-0000-0000-000000000002', 'gaming',
  'b0000000-0000-0000-0000-000000000007', 'ASUS',
  15, 4.7, 67, 234, TRUE, TRUE, TRUE,
  JSON_ARRAY('gaming', 'premium', 'portable'),
  JSON_OBJECT('display', '14-inch 2.5K Nebula HDR 165Hz', 'processor', 'AMD Ryzen 9 7940HS', 'ram', '32GB DDR5', 'storage', '1TB SSD', 'graphics', 'NVIDIA RTX 4090 16GB', 'weight', '1.72 kg'),
  'new'
),
(
  'p0000000-0000-0000-0000-000000000012',
  'Sony PlayStation 5 Console',
  'sony-playstation-5-console',
  'Next-gen gaming, 4K 120fps, ray tracing',
  'Experience lightning-fast loading, deeper immersion with haptic feedback, and an all-new generation of PlayStation games.',
  499.99, 549.99, 9,
  'a0000000-0000-0000-0000-000000000008', 'consoles',
  'b0000000-0000-0000-0000-000000000003', 'Sony',
  25, 4.9, 2345, 8900, TRUE, TRUE, TRUE,
  JSON_ARRAY('gaming', 'bestseller', 'trending'),
  JSON_OBJECT('cpu', 'AMD Zen 2, 8 cores @ 3.5GHz', 'gpu', '10.28 TFLOPs, RDNA 2', 'storage', '825GB SSD', 'output', '4K 120fps, 8K support'),
  'new'
),
(
  'p0000000-0000-0000-0000-000000000013',
  'Logitech MX Master 3S',
  'logitech-mx-master-3s',
  '8K DPI, quiet clicks, MagSpeed scroll',
  'Advanced wireless mouse with 8K DPI sensor, quiet clicks, and MagSpeed scroll wheel. Works on any surface.',
  99.99, 109.99, 9,
  'a0000000-0000-0000-0000-000000000004', 'peripherals',
  'b0000000-0000-0000-0000-000000000010', 'Logitech',
  150, 4.8, 892, 5600, FALSE, TRUE, TRUE,
  JSON_ARRAY('productivity', 'bestseller'),
  JSON_OBJECT('sensor', '8000 DPI', 'connectivity', 'Bluetooth, USB-C', 'battery', 'Up to 70 days'),
  'new'
),
(
  'p0000000-0000-0000-0000-000000000014',
  'Samsung Galaxy Watch 6 Classic',
  'samsung-galaxy-watch-6-classic',
  'Rotating bezel, health monitoring, premium design',
  'Premium smartwatch with rotating bezel, advanced health monitoring, and sleek design.',
  399.99, 429.99, 7,
  'a0000000-0000-0000-0000-000000000005', 'smartwatch',
  'b0000000-0000-0000-0000-000000000002', 'Samsung',
  60, 4.5, 134, 890, FALSE, FALSE, FALSE,
  JSON_ARRAY('android', 'health'),
  JSON_OBJECT('display', '1.5-inch Super AMOLED', 'processor', 'Exynos W930', 'battery', 'Up to 40 hours', 'waterResistance', '5ATM + IP68'),
  'new'
),
(
  'p0000000-0000-0000-0000-000000000015',
  'Anker 737 Power Bank 24000mAh',
  'anker-737-power-bank-24000mah',
  '24000mAh, 140W output, charges laptops',
  'Ultra-high capacity power bank with 140W max output. Charge your laptop, phone, and more at full speed.',
  149.99, 169.99, 12,
  'a0000000-0000-0000-0000-000000000004', 'powerbanks',
  'b0000000-0000-0000-0000-000000000009', 'Anker',
  80, 4.7, 456, 3400, FALSE, TRUE, FALSE,
  JSON_ARRAY('portable', 'travel'),
  JSON_OBJECT('capacity', '24000mAh', 'output', '140W max', 'ports', '2x USB-C, 1x USB-A'),
  'new'
);

-- ---------------------------------------------------------
-- Product Images
-- ---------------------------------------------------------
-- Product 1: iPhone 15 Pro Max
INSERT INTO product_images (id, product_id, image_url, sort_order, is_primary) VALUES
('pi000001-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500', 0, TRUE),
('pi000001-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500', 1, FALSE),
('pi000001-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=500', 2, FALSE),
('pi000001-0000-0000-0000-000000000004', 'p0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1580910051074-3eb694886f4b?w=500', 3, FALSE);

-- Product 2: Galaxy S24 Ultra
INSERT INTO product_images (id, product_id, image_url, sort_order, is_primary) VALUES
('pi000002-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500', 0, TRUE),
('pi000002-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=500', 1, FALSE),
('pi000002-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500', 2, FALSE);

-- Product 3: MacBook Pro 14
INSERT INTO product_images (id, product_id, image_url, sort_order, is_primary) VALUES
('pi000003-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 0, TRUE),
('pi000003-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500', 1, FALSE),
('pi000003-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500', 2, FALSE);

-- Product 4: Dell XPS 15
INSERT INTO product_images (id, product_id, image_url, sort_order, is_primary) VALUES
('pi000004-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500', 0, TRUE),
('pi000004-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', 1, FALSE),
('pi000004-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500', 2, FALSE);

-- Product 5: AirPods Pro 2
INSERT INTO product_images (id, product_id, image_url, sort_order, is_primary) VALUES
('pi000005-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500', 0, TRUE),
('pi000005-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=500', 1, FALSE);

-- Product 6: Sony WH-1000XM5
INSERT INTO product_images (id, product_id, image_url, sort_order, is_primary) VALUES
('pi000006-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500', 0, TRUE),
('pi000006-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500', 1, FALSE),
('pi000006-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500', 2, FALSE);

-- Product 7: iPad Pro 12.9
INSERT INTO product_images (id, product_id, image_url, sort_order, is_primary) VALUES
('pi000007-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', 0, TRUE),
('pi000007-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=500', 1, FALSE);

-- Product 8: Apple Watch Ultra 2
INSERT INTO product_images (id, product_id, image_url, sort_order, is_primary) VALUES
('pi000008-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500', 0, TRUE),
('pi000008-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500', 1, FALSE);

-- Product 9: OnePlus 12
INSERT INTO product_images (id, product_id, image_url, sort_order, is_primary) VALUES
('pi000009-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500', 0, TRUE),
('pi000009-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 1, FALSE);

-- Product 10: Google Pixel 8 Pro
INSERT INTO product_images (id, product_id, image_url, sort_order, is_primary) VALUES
('pi000010-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500', 0, TRUE),
('pi000010-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500', 1, FALSE);

-- Product 11: ASUS ROG Zephyrus G14
INSERT INTO product_images (id, product_id, image_url, sort_order, is_primary) VALUES
('pi000011-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500', 0, TRUE),
('pi000011-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500', 1, FALSE);

-- Product 12: PlayStation 5
INSERT INTO product_images (id, product_id, image_url, sort_order, is_primary) VALUES
('pi000012-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500', 0, TRUE),
('pi000012-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=500', 1, FALSE);

-- Product 13: Logitech MX Master 3S
INSERT INTO product_images (id, product_id, image_url, sort_order, is_primary) VALUES
('pi000013-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000013', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', 0, TRUE),
('pi000013-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000013', 'https://images.unsplash.com/photo-1586953208270-767889f0a056?w=500', 1, FALSE);

-- Product 14: Galaxy Watch 6 Classic
INSERT INTO product_images (id, product_id, image_url, sort_order, is_primary) VALUES
('pi000014-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000014', 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500', 0, TRUE),
('pi000014-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000014', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 1, FALSE);

-- Product 15: Anker 737 Power Bank
INSERT INTO product_images (id, product_id, image_url, sort_order, is_primary) VALUES
('pi000015-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000015', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500', 0, TRUE),
('pi000015-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000015', 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500', 1, FALSE);

-- ---------------------------------------------------------
-- Product Videos
-- ---------------------------------------------------------
INSERT INTO product_videos (id, product_id, video_url, sort_order) VALUES
('pv000001-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 0);

-- ---------------------------------------------------------
-- Orders
-- ---------------------------------------------------------
-- Order 1: Delivered, John Doe, 1x iPhone 15 Pro Max
INSERT INTO orders (id, order_number, user_id, subtotal, shipping_cost, shipping_label, tax, total, status, payment_status, payment_method, shipping_carrier, tracking_number, estimated_delivery, delivered_at, created_at) VALUES
('o0000000-0000-0000-0000-000000000001', 'ST-20240115-001', 'u0000000-0000-0000-0000-000000000002', 1199.99, 0, 'Free Shipping', 120.00, 1319.99, 'delivered', 'paid', 'Credit Card', 'FedEx', 'TRK123456789', '2024-01-20', '2024-01-19 15:00:00', '2024-01-15 10:00:00');

INSERT INTO order_addresses (id, order_id, full_name, phone, email, street, city, state, zip_code, country) VALUES
('oa000001-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000001', 'John Doe', '+1234567890', 'john@example.com', '123 Main Street', 'New York', 'NY', '10001', 'United States');

INSERT INTO order_items (id, order_id, product_id, name, image, price, quantity, subtotal) VALUES
('oi000001-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'iPhone 15 Pro Max 256GB', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500', 1199.99, 1, 1199.99);

INSERT INTO order_timeline (id, order_id, status, note) VALUES
('ot000001-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000001', 'pending',    'Order placed'),
('ot000001-0000-0000-0000-000000000002', 'o0000000-0000-0000-0000-000000000001', 'confirmed',  'Payment confirmed'),
('ot000001-0000-0000-0000-000000000003', 'o0000000-0000-0000-0000-000000000001', 'processing', 'Order processing'),
('ot000001-0000-0000-0000-000000000004', 'o0000000-0000-0000-0000-000000000001', 'shipped',    'Order shipped via FedEx'),
('ot000001-0000-0000-0000-000000000005', 'o0000000-0000-0000-0000-000000000001', 'delivered',  'Delivered');

-- Order 2: Shipped, John Doe, 2x AirPods Pro + 1x Logitech MX Master 3S
INSERT INTO orders (id, order_number, user_id, subtotal, shipping_cost, shipping_label, tax, total, status, payment_status, payment_method, shipping_carrier, tracking_number, estimated_delivery, delivered_at, created_at) VALUES
('o0000000-0000-0000-0000-000000000002', 'ST-20240120-002', 'u0000000-0000-0000-0000-000000000002', 559.97, 0, 'Free Shipping', 56.00, 615.97, 'shipped', 'paid', 'PayPal', 'DHL', 'TRK987654321', '2024-01-25', NULL, '2024-01-20 11:00:00');

INSERT INTO order_addresses (id, order_id, full_name, phone, email, street, city, state, zip_code, country) VALUES
('oa000002-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000002', 'John Doe', '+1234567890', 'john@example.com', '123 Main Street', 'New York', 'NY', '10001', 'United States');

INSERT INTO order_items (id, order_id, product_id, name, image, price, quantity, subtotal) VALUES
('oi000002-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000005', 'AirPods Pro 2nd Generation',  'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500', 229.99, 2, 459.98),
('oi000002-0000-0000-0000-000000000002', 'o0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000013', 'Logitech MX Master 3S',      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',  99.99, 1,  99.99);

INSERT INTO order_timeline (id, order_id, status, note) VALUES
('ot000002-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000002', 'pending',    'Order placed'),
('ot000002-0000-0000-0000-000000000002', 'o0000000-0000-0000-0000-000000000002', 'confirmed',  'Payment confirmed'),
('ot000002-0000-0000-0000-000000000003', 'o0000000-0000-0000-0000-000000000002', 'processing', 'Order processing'),
('ot000002-0000-0000-0000-000000000004', 'o0000000-0000-0000-0000-000000000002', 'shipped',    'Order shipped via DHL');

-- Order 3: Processing, John Doe, 1x PS5
INSERT INTO orders (id, order_number, user_id, subtotal, shipping_cost, shipping_label, tax, total, status, payment_status, payment_method, shipping_carrier, tracking_number, estimated_delivery, delivered_at, created_at) VALUES
('o0000000-0000-0000-0000-000000000003', 'ST-20240125-003', 'u0000000-0000-0000-0000-000000000002', 499.99, 9.99, 'Standard Shipping', 50.00, 559.98, 'processing', 'paid', 'Credit Card', NULL, NULL, '2024-02-01', NULL, '2024-01-25 14:00:00');

INSERT INTO order_addresses (id, order_id, full_name, phone, email, street, city, state, zip_code, country) VALUES
('oa000003-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000003', 'John Doe', '+1234567890', 'john@example.com', '456 Business Ave, Suite 100', 'New York', 'NY', '10002', 'United States');

INSERT INTO order_items (id, order_id, product_id, name, image, price, quantity, subtotal) VALUES
('oi000003-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000012', 'Sony PlayStation 5 Console', 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500', 499.99, 1, 499.99);

INSERT INTO order_timeline (id, order_id, status, note) VALUES
('ot000003-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000003', 'pending',    'Order placed'),
('ot000003-0000-0000-0000-000000000002', 'o0000000-0000-0000-0000-000000000003', 'confirmed',  'Payment confirmed'),
('ot000003-0000-0000-0000-000000000003', 'o0000000-0000-0000-0000-000000000003', 'processing', 'Order processing');

-- ---------------------------------------------------------
-- Flash Sale Banners
-- ---------------------------------------------------------
INSERT INTO flash_sale_banners (id, title, subtitle, description, image, link, is_active, sort_order) VALUES
('f0000000-0000-0000-0000-000000000001', 'Flash Sale',    'Up to 50% OFF',  'Limited time offer on top gadgets',    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', '/products?sale=flash', TRUE, 1),
('f0000000-0000-0000-0000-000000000002', 'New Arrivals',  'Latest Tech',    'Discover the newest gadgets in town',  'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800', '/products?sort=newest', TRUE, 2),
('f0000000-0000-0000-0000-000000000003', 'Hot Deals',     'Best Prices',    'Unbeatable prices on premium brands',  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800', '/products', TRUE, 3);

-- ---------------------------------------------------------
-- Site Settings (default row)
-- ---------------------------------------------------------
INSERT INTO site_settings (id, site_name, site_email, site_phone, site_address, currency, currency_symbol, payment_paystack, payment_whatsapp, whatsapp_number, notify_email, notify_new_product) VALUES
(1, 'SegzTech', 'info@segztech.com', '+234 800 000 0000', '123 Main Street, Lagos, Nigeria', 'NGN', '₦', TRUE, FALSE, '', TRUE, FALSE)
ON DUPLICATE KEY UPDATE site_name = site_name;
