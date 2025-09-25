// Only load dotenv in development - Railway provides variables automatically
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { Pool } = require('pg');

// Database configuration
const isDevelopment = process.env.NODE_ENV !== 'production';

// Construct connection string if DATABASE_URL is not available
let connectionString = process.env.DATABASE_URL;

if (!connectionString && process.env.PGHOST && process.env.PGUSER && process.env.PGPASSWORD && process.env.PGDATABASE) {
  connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE}`;
}

if (!connectionString) {
  throw new Error('Database connection string not found. Please set DATABASE_URL or individual PGHOST, PGUSER, PGPASSWORD, PGDATABASE environment variables.');
}

const dbConfig = {
  connectionString,
  
  // SSL configuration for Railway
  ssl: process.env.NODE_ENV === 'production' ? {
    require: true,
    rejectUnauthorized: false
  } : false,
  
  // Connection pool settings
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Create the connection pool
const pool = new Pool(dbConfig);

// Handle pool errors
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Test connection
pool.connect()
  .then(client => {
    console.log('🐘 PostgreSQL connected successfully');
    console.log(`📍 Connected to: ${process.env.PGHOST || 'localhost'}:${process.env.PGPORT || 5432}`);
    client.release();
  })
  .catch(err => {
    console.error('❌ PostgreSQL connection failed:', err.message);
  });

module.exports = pool;