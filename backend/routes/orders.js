// routes/orders.js
import express from "express";
import db from "../config/db.js"; // mysql2/promise pool

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

const SHIPPING_THRESHOLD = 1000;
const SHIPPING_FEE = 40;
const TAX_RATE = 0.02;

function round2(v) {
  return Math.round(Number(v || 0) * 100) / 100;
}

// Create order
router.post("/", async (req, res) => {
  try {
    const { user_id, items, shipping_address, customer_name, payment_method } = req.body;

    if (!user_id) return res.status(400).json({ message: "Missing user_id" });
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "items must be a non-empty array" });
    }

    // Recalculate subtotal on server (do NOT trust client)
    const subtotalRaw = items.reduce((sum, it) => {
      const price = parseFloat(it.price ?? it.unit_price ?? 0) || 0;
      const qty = parseFloat(it.quantity ?? it.qty ?? it.count ?? 1) || 0;
      return sum + price * qty;
    }, 0);
    const subtotal = round2(subtotalRaw);

    // shipping rule: free when subtotal >= threshold
    const shippingAmount = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const tax = round2(subtotal * TAX_RATE);
    const total = round2(subtotal + shippingAmount + tax);

    // Build billing object but omit shipping key when it's zero
    const billingDetailsObj = { subtotal, tax, total };
    if (shippingAmount > 0) billingDetailsObj.shipping = shippingAmount;

    const productsJSON = JSON.stringify(items);
    const billingDetailsJSON = JSON.stringify(billingDetailsObj);

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

    // Fetch inserted row to return to client
    const [[orderRow]] = await db.query("SELECT * FROM orders WHERE order_id = ? LIMIT 1", [result.insertId]);

    if (orderRow) {
      orderRow.products = safeParse(orderRow.products, []);
      // ensure billing_details is an object and add shipping:0 if missing
      const billing = safeParse(orderRow.billing_details, {}) || {};
      if (billing.shipping == null) billing.shipping = 0; // ensure response always has shipping
      orderRow.billing_details = billing;
    }

    res.status(201).json({ message: "Order placed successfully", order: orderRow });
  } catch (err) {
    console.error("❌ Failed to place order:", err);
    res.status(500).json({ message: "Failed to place order", error: String(err) });
  }
});

// Get all orders, with optional user_id filter
router.get("/", async (req, res) => {
  try {
    const userFilter = req.query.user_id ? "WHERE user_id = ?" : "";
    const params = req.query.user_id ? [req.query.user_id] : [];

    const sql = `SELECT * FROM orders ${userFilter} ORDER BY order_date DESC`;
    const [rows] = await db.query(sql, params);

    const orders = rows.map((r) => {
      const billing = safeParse(r.billing_details, {}) || {};
      if (billing.shipping == null) billing.shipping = 0;
      return {
        ...r,
        products: safeParse(r.products, []),
        billing_details: billing,
      };
    });

    res.json(orders);
  } catch (err) {
    console.error("❌ Failed to fetch orders:", err);
    res.status(500).json({ message: "Failed to fetch orders", error: String(err) });
  }
});

// Get orders by user_id
router.get("/:user_id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC",
      [req.params.user_id]
    );

    const orders = rows.map((r) => {
      const billing = safeParse(r.billing_details, {}) || {};
      if (billing.shipping == null) billing.shipping = 0;
      return {
        ...r,
        products: safeParse(r.products, []),
        billing_details: billing,
      };
    });

    res.json(orders);
  } catch (err) {
    console.error("❌ Failed to fetch orders by user_id:", err);
    res.status(500).json({ message: "Failed to fetch orders", error: String(err) });
  }
});

export default router;
