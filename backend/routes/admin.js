import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

const router = express.Router();
const JWT_SECRET = "secretkey"; // for demo only

// ✅ SIGNUP — Adds new user to `users` table
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (name, email, password, users_view) VALUES (?, ?, ?, 1)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup error:", error);
res.status(500).json({ error: 'Signup failed', details: err.message });  }
});

// ✅ LOGIN — works for both admin & user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0)
      return res.status(401).json({ error: "Invalid email" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, email: user.email, users_view: user.users_view },
      JWT_SECRET,
      { expiresIn: "10h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, users_view: user.users_view },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ DASHBOARD (for admins only)
router.get("/dashboard", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.users_view !== 0) {
      return res.status(403).json({ error: "Access denied: Admins only" });
    }

    const [[{ totalUsers }]] = await db.query("SELECT COUNT(*) AS totalUsers FROM users");
    const [[{ totalOrders }]] = await db.query("SELECT COUNT(*) AS totalOrders FROM orders");
    const [[{ totalSales }]] = await db.query("SELECT SUM(total_amount) AS totalSales FROM orders");

    res.json({
      totalUsers,
      totalOrders,
      totalSales: totalSales || 0,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Error fetching dashboard", details: error.message });
  }
});

export default router;
