import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js"; // your MySQL connection

const router = express.Router();

// ====================
// Admin Signup
// ====================
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "All fields required" });

    const [existingAdmin] = await db.query("SELECT * FROM admins WHERE username = ?", [username]);
    if (existingAdmin.length > 0) return res.status(400).json({ error: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO admins (username, password) VALUES (?, ?)", [username, hashedPassword]);

    res.status(201).json({ message: "Admin signed up successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ====================
// Admin Login
// ====================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "All fields required" });

    const [admins] = await db.query("SELECT * FROM admins WHERE username = ?", [username]);
    if (admins.length === 0) return res.status(400).json({ error: "Invalid credentials" });

    const admin = admins[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "10h" } // longer for testing
    );

    res.json({ message: "Admin logged in successfully!", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ====================
// Dashboard (Protected)
// ====================
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: "Invalid token" });
  }
};

router.get("/dashboard", verifyToken, async (req, res) => {
  // You can fetch real data here from DB if needed
  res.json({
    message: `Welcome Admin ${req.admin.username}`,
    stats: { users: 120, products: 50, orders: 75, categories: 10 },
  });
});

export default router;
