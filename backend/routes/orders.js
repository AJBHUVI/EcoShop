import express from "express";
import db from "../config/db.js";

const router = express.Router();

// 📦 POST /orders — Place a new order (supports COD + Card)
router.post("/", async (req, res) => {
  // Destructure all expected fields from frontend
  const {
    user_id,
    items,
    subtotal = 0,
    shipping = 0,
    total = 0,
    shipping_address = "",
    customer_name = "",
    payment_method = "card",
    payment_details = null,
  } = req.body;

  // Basic validation
  if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    // 🧮 Calculate total amount (fallback if total not passed)
    const total_amount =
      typeof total === "number" && total > 0
        ? total
        : items.reduce(
            (sum, item) =>
              sum + Number(item.price || 0) * Number(item.quantity || 0),
            0
          ) + Number(shipping || 0);

    // Convert arrays/objects to JSON strings for DB storage
    const productsJSON = JSON.stringify(items);
    const paymentJSON = payment_details
      ? JSON.stringify(payment_details)
      : null;

    // ✅ Insert the order into DB with full details
    const sql = `
      INSERT INTO orders (
        user_id,
        products,
        total_amount,
        shipping,
        payment_method,
        payment_details,
        status,
        order_date,
        shipping_address,
        customer_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)
    `;

    const params = [
      user_id,
      productsJSON,
      total_amount,
      shipping,
      payment_method,
      paymentJSON,
      "submitted",
      shipping_address,
      customer_name,
    ];

    const [result] = await db.query(sql, params);
    const order_id = result.insertId;

    // 🔍 Fetch inserted record
    const [rows] = await db.query("SELECT * FROM orders WHERE order_id = ?", [
      order_id,
    ]);
    const createdOrder = rows[0];

    // 🧩 Parse JSON fields for frontend
    if (createdOrder && typeof createdOrder.products === "string") {
      createdOrder.products = JSON.parse(createdOrder.products);
    }
    if (createdOrder && typeof createdOrder.payment_details === "string") {
      try {
        createdOrder.payment_details = JSON.parse(createdOrder.payment_details);
      } catch {
        createdOrder.payment_details = null;
      }
    }

    res.status(201).json({
      message: "Order placed successfully",
      order: createdOrder,
    });
  } catch (err) {
    console.error("❌ Failed to place order:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
});

// 🧾 GET /orders/:user_id — Get all orders for a user
router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC",
      [user_id]
    );

    // Parse JSON columns
    const orders = rows.map((row) => ({
      ...row,
      products:
        typeof row.products === "string"
          ? JSON.parse(row.products)
          : row.products,
      payment_details:
        typeof row.payment_details === "string"
          ? JSON.parse(row.payment_details)
          : row.payment_details,
    }));

    res.json(orders);
  } catch (err) {
    console.error("❌ Failed to fetch orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

export default router;
