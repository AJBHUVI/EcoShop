import express from 'express';
import db from '../config/db.js'; // your MySQL connection

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    console.log('Fetched products:', rows); // <-- log for debug
    res.json(rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
