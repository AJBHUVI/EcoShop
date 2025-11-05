import express from 'express';
import db from '../config/db.js'; // your MySQL pool

const router = express.Router();

// Add favorite
router.post("/", async (req, res) => {
  const { user_id, product_id } = req.body;
  try {
    await db.query(
      "INSERT INTO favorites (user_id, product_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP",
      [user_id, product_id]
    );
    res.status(201).json({ message: "Added to favorites" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add favorite" });
  }
});

// Remove favorite
router.delete("/:product_id", async (req, res) => {
  const { product_id } = req.params;
  const { user_id } = req.body;
  try {
    await db.query(
      "DELETE FROM favorites WHERE user_id = ? AND product_id = ?",
      [user_id, product_id]
    );
    res.json({ message: "Removed from favorites" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove favorite" });
  }
});

// Get user favorites
router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT p.* FROM favorites f
       JOIN products p ON f.product_id = p.product_id
       WHERE f.user_id = ?`,
      [user_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
});

export default router;