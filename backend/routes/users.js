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


router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, is_admin } = req.body;

    // 1️⃣ Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 2️⃣ Check if the email is already registered
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      // ✅ Friendly error message
      return res.status(400).json({ error: "Email is already registered. Please login or use another email." });
    }

    // 3️⃣ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Insert the new user
    const sql = "INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)";
    await db.query(sql, [name, email, hashedPassword, is_admin ?? 0]);

    res.status(201).json({ message: "User registered successfully!" });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed due to server error." });
  }
});

// ✅ LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(400).json({ success: false, error: "User not found" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ success: false, error: "Invalid password" });
    }

    // ✅ Return correct user_id
    res.json({
      success: true,
      message: "Login successful",
      user: {
        user_id: user.user_id, // match DB
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, error: "Login failed" });
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