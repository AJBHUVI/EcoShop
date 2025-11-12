// backend/routes/cart.js
import express from "express";
import db from "../config/db.js";

const router = express.Router();

/* ---------------- Add to cart ---------------- */
router.post("/add", async (req, res) => {
  try {
    const { user_id, product_id, quantity = 1 } = req.body;

    if (!user_id || !product_id) {
      return res.status(400).json({ message: "Missing user_id or product_id" });
    }

    const [rows] = await db.query(
      "SELECT quantity FROM cart_items WHERE user_id = ? AND product_id = ?",
      [user_id, product_id]
    );

    if (rows.length>0) {
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

    res.json({ message: "✅ Added to cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB error" });
  }
});

/* ---------------- Get cart for user ---------------- */
router.get("/:user_id", async (req, res) => {
  try {
    const user_id = Number(req.params.user_id);

    const [rows] = await db.query(
      `SELECT c.product_id, c.quantity, p.name, p.price, p.image
       FROM cart_items c
       JOIN products p ON c.product_id = p.product_id
       WHERE c.user_id = ?`,
      [user_id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB error fetching cart" });
  }
});

/* ---------------- Update quantity ---------------- */
router.post("/update", async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    await db.query(
      "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?",
      [quantity, user_id, product_id]
    );

    res.json({ message: "✅ Quantity updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});

/* ---------------- Clear one user's cart ---------------- */
router.delete("/clear/:user_id", async (req, res) => {
  try {
    const user_id = Number(req.params.user_id);

    await db.query("DELETE FROM cart_items WHERE user_id = ?", [user_id]);

    res.json({ message: "✅ Cart cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Clear failed" });
  }
});

/* ---------------- Remove single item ---------------- */
router.delete("/:user_id/:product_id", async (req, res) => {
  try {
    const user_id = Number(req.params.user_id);
    const product_id = Number(req.params.product_id);

    await db.query(
      "DELETE FROM cart_items WHERE user_id = ? AND product_id = ?",
      [user_id, product_id]
    );

    res.json({ message: "✅ Item removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
