const mysql = require('mysql2/promise');

// Load .env variables FIRST
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',  // Empty for XAMPP root
  database: process.env.DB_NAME || 'chatapp',
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  enableKeepAlive: true
};

// Debug log (remove after testing)
console.log('DB Config loaded:', {
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password ? 'SET' : 'EMPTY',
  database: dbConfig.database,
  port: dbConfig.port
});

const pool = mysql.createPool(dbConfig);

async function query(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

module.exports = { pool, query };
