import express from "express";
import bcrypt from "bcrypt";
import db from "../config/db.js";
import { log } from "console";

const router = express.Router();

// Get all users
router.get("/users", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM users");
  res.json(rows);
});


// ✅ SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, is_admin } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)";
    await db.query(sql, [name, email, hashedPassword, is_admin ?? 0]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
});


// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("req.body");

    // Find user by email
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = rows[0];

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // ✅ Determine role based on is_admin
    const role = user.is_admin === 0 ? "admin" : "user";

    // ✅ Return user info and role
   res.json({
  success: true,
  message: "Login successful",
  role, // <-- sending that role
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
  },
});
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});


// ✅ DASHBOARD DATA (for admin)
router.get("/dashboard", async (req, res) => {
  try {
    const [[usersCount]] = await db.query("SELECT COUNT(*) AS total FROM users");
    const [[productsCount]] = await db.query("SELECT COUNT(*) AS total FROM products");
    const [[ordersCount]] = await db.query("SELECT COUNT(*) AS total FROM orders");

    res.json({
      totalUsers: usersCount.total,
      totalProducts: productsCount.total,
      totalOrders: ordersCount.total,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Error fetching dashboard data" });
  }
});


export default router;
