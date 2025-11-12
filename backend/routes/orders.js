import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { user_id, items, shipping_address, customer_name, payment_method } = req.body;

    if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // ✅ same logic as frontend
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
      0
    );
    const shipping = 40;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    const productsJSON = JSON.stringify(items);

    const sql = `
      INSERT INTO orders (
        user_id, customer_name, shipping_address, products,
        subtotal, shipping, tax, total_amount, payment_method,
        status, order_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted', NOW())
    `;

    const [result] = await db.query(sql, [
      user_id,
      customer_name,
      shipping_address,
      productsJSON,
      subtotal,
      shipping,
      tax,
      total,
      payment_method,
    ]);

    const [rows] = await db.query("SELECT * FROM orders WHERE order_id = ?", [
      result.insertId,
    ]);
    const order = rows[0];

    if (typeof order.products === "string") {
      try {
        order.products = JSON.parse(order.products);
      } catch {
        order.products = [];
      }
    }

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("❌ Failed to place order:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM orders ORDER BY order_date DESC");
    const orders = rows.map((row) => ({
      ...row,
      products:
        typeof row.products === "string"
          ? (() => {
              try {
                return JSON.parse(row.products);
              } catch {
                return [];
              }
            })()
          : row.products,
    }));
    res.json(orders);
  } catch (err) {
    console.error("❌ Failed to fetch orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

router.get("/:user_id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC",
      [req.params.user_id]
    );
    const orders = rows.map((row) => ({
      ...row,
      products:
        typeof row.products === "string"
          ? (() => {
              try {
                return JSON.parse(row.products);
              } catch {
                return [];
              }
            })()
          : row.products,
    }));
    res.json(orders);
  } catch (err) {
    console.error("❌ Failed to fetch orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

export default router;
