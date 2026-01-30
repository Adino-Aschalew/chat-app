require('dotenv').config()

module.exports = {
  port: Number(process.env.PORT || 4000),
  // Comma-separated list of allowed origins for CORS (e.g. "http://localhost:5173,http://localhost:3000")
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'chatapp',
    port: Number(process.env.DB_PORT || 3306),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_secret_change_me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
}

