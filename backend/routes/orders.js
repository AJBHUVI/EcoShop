// routes/orders.js
import express from "express";
import db from "../config/db.js"; // assumes mysql2/promise pool

const router = express.Router();
const safeParse = (val, fallback = null) => {
  if (val == null) return fallback;
  if (typeof val === "object") return val;
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return fallback;
};

router.post("/", async (req, res) => {
  try {
    const { user_id, items, shipping_address, customer_name, payment_method } = req.body;

    if (!user_id) return res.status(400).json({ message: "Missing user_id" });
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "items must be a non-empty array" });
    }

    // Calculate billing
    const subtotalRaw = items.reduce((sum, it) => {
      const price = Number(it.price ?? 0);
      const qty = Number(it.quantity ?? it.qty ?? 1);
      return sum + price * qty;
    }, 0);
    const subtotal = Number(subtotalRaw.toFixed(2));
    const shipping = 40.0;
    const tax = Number((subtotal * 0.02).toFixed(2));
    const total = Number((subtotal + shipping + tax).toFixed(2));

    const productsJSON = JSON.stringify(items);
    const billingDetailsJSON = JSON.stringify({
      subtotal,
      shipping,
      tax,
      total,
    });

    const sql = `
      INSERT INTO orders (
        user_id,
        customer_name,
        shipping_address,
        products,
        billing_details,
        payment_method,
        status,
        order_date
      ) VALUES (?, ?, ?, ?, ?, ?, 'submitted', NOW())
    `;

    const [result] = await db.query(sql, [
      user_id,
      customer_name ?? "",
      shipping_address ?? "",
      productsJSON,
      billingDetailsJSON,
      payment_method ?? "cod",
    ]);

    // Fetch the inserted order by order_id (insertId)
    const [[orderRow]] = await db.query("SELECT * FROM orders WHERE order_id = ? LIMIT 1", [result.insertId]);

    // safe-parse JSON columns if driver returned strings
    if (orderRow) {
      orderRow.products = safeParse(orderRow.products, []);
      orderRow.billing_details = safeParse(orderRow.billing_details, null);
    }

    res.status(201).json({ message: "Order placed successfully", order: orderRow });
  } catch (err) {
    console.error("❌ Failed to place order:", err);
    res.status(500).json({ message: "Failed to place order", error: String(err) });
  }
});

router.get("/", async (req, res) => {
  try {
    const userFilter = req.query.user_id ? "WHERE user_id = ?" : "";
    const params = req.query.user_id ? [req.query.user_id] : [];

    const sql = `SELECT * FROM orders ${userFilter} ORDER BY order_date DESC`;
    const [rows] = await db.query(sql, params);

    const orders = rows.map((r) => {
      return {
        ...r,
        products: safeParse(r.products, []),
        billing_details: safeParse(r.billing_details, null),
      };
    });

    res.json(orders);
  } catch (err) {
    console.error("❌ Failed to fetch orders:", err);
    res.status(500).json({ message: "Failed to fetch orders", error: String(err) });
  }
});


router.get("/:user_id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC", [
      req.params.user_id,
    ]);

    const orders = rows.map((r) => ({
      ...r,
      products: safeParse(r.products, []),
      billing_details: safeParse(r.billing_details, null),
    }));

    res.json(orders);
  } catch (err) {
    console.error("❌ Failed to fetch orders by user_id:", err);
    res.status(500).json({ message: "Failed to fetch orders", error: String(err) });
  }
});

export default router;
