const { Pool } = require('pg');

// 1. Define the SSL configuration object conditionally
const isProduction = process.env.NODE_ENV === 'production';

// Use SSL only if in a production environment
const sslConfig = isProduction ? {
  ssl: {
    // This setting is REQUIRED for Render and other cloud databases
    rejectUnauthorized: false
  }
} : {}; 

// 2. Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...sslConfig, // Spread the SSL object only if in production
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// ... rest of your connection code ...

module.exports = pool;