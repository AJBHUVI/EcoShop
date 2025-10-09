// backend/db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql_db', // Use Docker service name
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpass',
  database: process.env.DB_NAME || 'ecoshop',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
