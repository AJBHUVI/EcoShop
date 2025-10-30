// backend/db.js
import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpass',
  database: process.env.DB_NAME || 'ecoshop',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: process.env.DB_PORT || 3306
});

// ✅ Optional test connection (async check)
try {
  const connection = await db.getConnection();
  console.log("✅ Connected to MySQL database");
  connection.release();
} catch (err) {
  console.error("❌ Database connection failed:", err);
}

export default db;
