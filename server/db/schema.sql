-- GAGAN MOBILE CARE - PostgreSQL Relational Database Schema

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(80) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(40),
  password VARCHAR(255) NOT NULL,
  role VARCHAR(30) DEFAULT 'user',
  avatar TEXT,
  address TEXT,
  is_email_verified BOOLEAN DEFAULT TRUE,
  provider VARCHAR(30) DEFAULT 'email',
  last_login_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1B. LOGIN SESSIONS & AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS login_sessions (
  id VARCHAR(80) PRIMARY KEY,
  user_id VARCHAR(80) REFERENCES users(id) ON DELETE CASCADE,
  user_name VARCHAR(150) NOT NULL,
  user_email VARCHAR(150) NOT NULL,
  role VARCHAR(30) DEFAULT 'user',
  ip_address VARCHAR(80),
  device_info TEXT,
  login_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(40) DEFAULT 'Success'
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(80) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  subtitle TEXT,
  brand VARCHAR(60) NOT NULL,
  category VARCHAR(60) NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  original_price NUMERIC(12, 2),
  rating NUMERIC(3, 1) DEFAULT 4.8,
  reviews_count INTEGER DEFAULT 120,
  image TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT TRUE,
  is_new BOOLEAN DEFAULT FALSE,
  specs JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(80) PRIMARY KEY,
  user_id VARCHAR(80) REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(150),
  customer_phone VARCHAR(40),
  items JSONB NOT NULL,
  total_amount NUMERIC(12, 2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'Cash on Delivery',
  status VARCHAR(50) DEFAULT 'Confirmed',
  shipping_address TEXT,
  date VARCHAR(80),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. CUSTOMER STORIES TABLE (Diaries / Deliveries)
CREATE TABLE IF NOT EXISTS customer_stories (
  id VARCHAR(80) PRIMARY KEY,
  customer_name VARCHAR(150) NOT NULL,
  location VARCHAR(150) NOT NULL,
  device_name VARCHAR(150) NOT NULL,
  brand VARCHAR(60) DEFAULT 'all',
  tag VARCHAR(80) DEFAULT 'Verified Buyer',
  review TEXT NOT NULL,
  rating NUMERIC(2, 1) DEFAULT 5.0,
  image TEXT NOT NULL,
  date VARCHAR(80),
  verified_purchase BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TRADE-IN EXCHANGE INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS trade_in_inquiries (
  id VARCHAR(80) PRIMARY KEY,
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(40) NOT NULL,
  device_name VARCHAR(150) NOT NULL,
  condition VARCHAR(80) NOT NULL,
  estimated_value NUMERIC(12, 2) NOT NULL,
  target_device VARCHAR(150),
  status VARCHAR(60) DEFAULT 'Pending Review',
  date VARCHAR(80),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. REPAIRS DESK TABLE
CREATE TABLE IF NOT EXISTS repairs (
  id VARCHAR(80) PRIMARY KEY,
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(40) NOT NULL,
  device_model VARCHAR(150) NOT NULL,
  issue TEXT NOT NULL,
  estimated_cost NUMERIC(12, 2) NOT NULL,
  notes TEXT,
  status VARCHAR(60) DEFAULT 'Repairing',
  received_date VARCHAR(80),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. USER CARTS TABLE (Per-user persistent cart)
CREATE TABLE IF NOT EXISTS user_carts (
  user_id VARCHAR(80) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. USER WISHLISTS TABLE (Per-user persistent wishlist)
CREATE TABLE IF NOT EXISTS user_wishlists (
  user_id VARCHAR(80) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CREATE INDEXES FOR FAST LOOKUPS
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
