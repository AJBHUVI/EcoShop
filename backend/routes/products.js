import express from "express";
import db from "../config/db.js";

const router = express.Router();

// ✅ Get all products
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ message: "Server error fetching products" });
  }
});

// ✅ Bulk insert products — placed ABOVE :product_id
router.post("/bulk-insert", async (req, res) => {
  try {
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "No products received" });
    }

    // ✅ Check if products table already has data
    const [existing] = await db.query("SELECT COUNT(*) AS count FROM products");
    if (existing[0].count > 0) {
      return res.json({ message: "⚠️ Products already exist, skipping insert." });
    }

    // Prepare data for bulk insert
    const values = products.map((p) => [
      p.name,
      p.price,
      p.category,
      p.image,
      p.description || "",
    ]);

    await db.query(
      "INSERT INTO products (name, price, category, image, description) VALUES ?",
      [values]
    );

    res.json({ message: "✅ Bulk insert success", count: products.length });
  } catch (err) {
    console.error("❌ Bulk insert error:", err);
    res.status(500).json({ message: "Server error inserting products" });
  }
});

// ✅ Get single product
router.get("/:product_id", async (req, res) => {
  try {
    const { product_id } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM products WHERE product_id = ?",
      [product_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    res.status(500).json({ message: "Server error fetching product" });
  }
});

// ✅ Delete product
router.delete("/:product_id", async (req, res) => {
  try {
    const { product_id } = req.params;

    await db.query("DELETE FROM products WHERE product_id = ?", [product_id]);
    res.json({ message: "✅ Product deleted" });
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    res.status(500).json({ message: "Server error deleting product" });
  }
});

export default router;
