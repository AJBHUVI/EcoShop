import express from "express";
import db from "../config/db.js";

const router = express.Router();

// ➕ Add item to cart (insert or increment)
router.post("/add", async (req, res) => {
  try {
    const { user_id, product_id, quantity = 1 } = req.body;
    if (!user_id || !product_id) return res.status(400).json({ error: "Missing user_id or product_id" });

    // if exists -> increment; else insert
    const [rows] = await db.query(
      "SELECT quantity FROM cart_items WHERE user_id = ? AND product_id = ?",
      [user_id, product_id]
    );

    if (rows.length) {
      await db.query(
        "UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
        [quantity, user_id, product_id]
      );
    } else {
      await db.query(
        "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [user_id, product_id, quantity]
      );
    }

    res.json({ message: "✅ Item added to cart" });
  } catch (err) {
    console.error("Error inserting cart item:", err);
    res.status(500).json({ error: "Failed to insert into DB" });
  }
});

// 📦 Get user's cart (return product_id as expected by UI)
router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const [rows] = await db.query(
      `SELECT c.product_id AS product_id, c.quantity, p.name, p.price, p.image
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

// 🔄 Update quantity
router.post("/update", async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;
    if (!user_id || !product_id || quantity == null)
      return res.status(400).json({ message: "Missing user_id, product_id or quantity" });

    await db.query(
      "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?",
      [quantity, user_id, product_id]
    );
    res.json({ message: "🔄 Quantity updated" });
  } catch (err) {
    console.error("Error updating quantity:", err);
    res.status(500).json({ message: "Server error updating quantity" });
  }
});

// 🗑️ Remove a single product from user's cart
router.delete("/:user_id/:product_id", async (req, res) => {
  try {
    const { user_id, product_id } = req.params;
    await db.query("DELETE FROM cart_items WHERE user_id = ? AND product_id = ?", [user_id, product_id]);
    res.json({ message: "🗑️ Item removed from cart" });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ message: "Server error deleting cart item" });
  }
});

// 🧹 Clear all for user
router.delete("/clear/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    await db.query("DELETE FROM cart_items WHERE user_id = ?", [user_id]);
    res.json({ message: "🧹 Cart cleared" });
  } catch (err) {
    console.error("Error clearing cart:", err);
    res.status(500).json({ message: "Server error clearing cart" });
  }
});

export default router;
