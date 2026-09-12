import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, testConnection } from './pool.js';
import { PRODUCTS } from '../../src/data/products.js';
import { INITIAL_ORDERS } from '../../src/data/orders.js';
import { INITIAL_CUSTOMER_STORIES } from '../../src/data/customerStories.js';
import { INITIAL_REGISTERED_USERS } from '../../src/data/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initDatabase() {
  const connected = await testConnection();
  if (!connected) {
    console.warn('⚠️ Skipping PostgreSQL database initialization (database not connected).');
    return false;
  }

  const client = await pool.connect();
  try {
    console.log('🔄 Initializing PostgreSQL database tables...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await client.query(schemaSql);
    console.log('✅ PostgreSQL Schema and Tables created successfully.');

    // Migration check: Ensure last_login_at exists on users
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name='users' AND column_name='last_login_at'
        ) THEN
          ALTER TABLE users ADD COLUMN last_login_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
        END IF;
      END $$;
    `);

    // 1. Seed Initial Admin Account if users table is empty
    const userCountRes = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCountRes.rows[0].count) === 0) {
      console.log('🌱 Seeding initial admin account into PostgreSQL...');
      for (const u of INITIAL_REGISTERED_USERS) {
        await client.query(
          `INSERT INTO users (id, name, email, phone, password, role, avatar, address, is_email_verified, provider, last_login_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NULL)
           ON CONFLICT (email) DO NOTHING`,
          [
            u.id,
            u.name,
            u.email,
            u.phone || '+91 98726-22624',
            u.password,
            u.role,
            u.avatar,
            'Maur Mandi, Punjab',
            u.isEmailVerified ?? true,
            u.provider || 'email'
          ]
        );
      }
      console.log('✅ Base user accounts ready.');
    }

    // Clean up any old dummy seed users so users table only contains genuine registrations + admin
    await client.query(`DELETE FROM users WHERE id IN ('usr_customer_demo', 'usr_krish_jindal')`);
    await client.query(`DELETE FROM login_sessions WHERE id IN ('sess_1', 'sess_2', 'sess_3') OR user_id IN ('usr_customer_demo', 'usr_krish_jindal')`);
    console.log('✅ User database cleaned: Only genuine registered accounts will be listed.');

    // 2. Seed Products if table is empty
    const productCountRes = await client.query('SELECT COUNT(*) FROM products');
    if (parseInt(productCountRes.rows[0].count) === 0) {
      console.log('🌱 Seeding products catalog into PostgreSQL...');
      for (const p of PRODUCTS) {
        await client.query(
          `INSERT INTO products (id, name, subtitle, brand, category, price, original_price, rating, reviews_count, image, in_stock, is_new, specs)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
           ON CONFLICT (id) DO NOTHING`,
          [
            p.id,
            p.name,
            p.subtitle || '',
            p.brand,
            p.category,
            p.price,
            p.originalPrice || p.price,
            p.rating || 4.8,
            p.reviewsCount || 100,
            p.image,
            p.inStock ?? true,
            p.isNew ?? false,
            JSON.stringify(p.specs || {})
          ]
        );
      }
      console.log('✅ Products catalog seeded.');
    }

    // 3. Seed Initial Orders if empty
    const ordersCountRes = await client.query('SELECT COUNT(*) FROM orders');
    if (parseInt(ordersCountRes.rows[0].count) === 0) {
      console.log('🌱 Seeding initial orders into PostgreSQL...');
      for (const o of INITIAL_ORDERS) {
        await client.query(
          `INSERT INTO orders (id, user_id, customer_name, customer_email, customer_phone, items, total_amount, payment_method, status, shipping_address, date)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (id) DO NOTHING`,
          [
            o.id,
            'usr_krish_jindal',
            o.customerName || 'Krish Jindal',
            'krish@gmail.com',
            '+91 98765 43210',
            JSON.stringify(o.items || []),
            o.total || 0,
            o.paymentMethod || 'UPI Payment (GPay)',
            o.status || 'Delivered',
            o.shippingAddress || 'Maur Mandi, Bathinda District, Punjab',
            o.date || 'Recent'
          ]
        );
      }
      console.log('✅ Orders seeded.');
    }

    // 4. Seed Customer Stories if empty
    // 4. Seed Customer Stories if empty or refresh
    console.log('🌱 Seeding/updating customer experience stories into PostgreSQL...');
    for (const s of INITIAL_CUSTOMER_STORIES) {
      await client.query(
        `INSERT INTO customer_stories (id, customer_name, location, device_name, brand, tag, review, rating, image, date, verified_purchase)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO UPDATE SET
           customer_name = EXCLUDED.customer_name,
           location = EXCLUDED.location,
           device_name = EXCLUDED.device_name,
           brand = EXCLUDED.brand,
           tag = EXCLUDED.tag,
           review = EXCLUDED.review,
           rating = EXCLUDED.rating,
           image = EXCLUDED.image,
           date = EXCLUDED.date,
           verified_purchase = EXCLUDED.verified_purchase`,
        [
          s.id,
          s.customerName,
          s.storeLocation || s.location || 'Maur Mandi, Punjab',
          s.phoneBought || s.deviceName || 'Smartphone',
          s.brand || 'all',
          s.tag || 'Verified Buyer',
          s.feedback || s.review || 'Great service and authentic product from Gagan Mobile Care.',
          parseFloat(s.rating || 5.0),
          s.image,
          s.date || 'Recent Delivery',
          s.verified ?? s.verifiedPurchase ?? true
        ]
      );
    }
    console.log('✅ Customer stories synchronized with brand and tags.');

    console.log('🎉 PostgreSQL Database is ready and fully synchronized!');
    return true;
  } catch (err) {
    console.error('❌ Error during database initialization:', err);
    return false;
  } finally {
    client.release();
  }
}

// Allow direct CLI execution: node server/db/initDb.js
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initDatabase().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

