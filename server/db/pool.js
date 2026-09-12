import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL Connection Pool configuration
// Supports standard DATABASE_URL (e.g. Neon, Supabase, Render, Railway, AWS RDS, or local PostgreSQL)
// or individual PG* variables.
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

const defaultUser = process.env.PGUSER || process.env.USER || 'krishjindal';
const poolConfig = connectionString
  ? {
      connectionString,
      ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
        ? false
        : { rejectUnauthorized: false }
    }
  : {
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT || '5432'),
      database: process.env.PGDATABASE || 'gagan_mobile_care',
      user: defaultUser,
      password: process.env.PGPASSWORD || undefined,
      ssl: false
    };

export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.warn('⚠️ PostgreSQL Pool idle client notice:', err.message);
});

let isConnected = false;

export async function testConnection() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() as current_time');
    client.release();
    isConnected = true;
    console.log('✅ Connected to PostgreSQL Database successfully at:', res.rows[0].current_time);
    return true;
  } catch (err) {
    isConnected = false;
    console.warn('⚠️ PostgreSQL database not reachable yet:', err.message);
    console.warn('ℹ️ To connect your PostgreSQL database, provide DATABASE_URL in .env');
    return false;
  }
}

export function isDbConnected() {
  return isConnected;
}
