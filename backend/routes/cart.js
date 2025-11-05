import express from "express";
import db from "../config/db.js";

const router = express.Router();

// 🛒 Add item to cart
router.post("/add", async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id) {
      return res.status(400).json({ error: "Missing user_id or product_id" });
    }

    await db.query(
      "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)",
      [user_id, product_id, quantity]
    );

    res.json({ message: "✅ Item added to cart_items table" });
  } catch (err) {
    console.error("Error inserting cart item:", err);
    res.status(500).json({ error: "Failed to insert into DB" });
  }
});

// 🛒 Fetch user's cart items
router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const [rows] = await db.query(
      `SELECT c.id, c.quantity, p.name, p.price, p.image
       FROM cart_items c
       JOIN products p ON c.product_id = p.product_id
       WHERE c.user_id = ?`,
      [user_id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Server error fetching cart" });
  }
});

// 🗑️ Remove item
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM cart_items WHERE id = ?", [req.params.id]);
    res.json({ message: "🗑️ Item removed from cart" });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ message: "Server error deleting cart item" });
  }
});

export default router;
