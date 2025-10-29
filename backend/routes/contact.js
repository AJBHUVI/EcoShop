import express from "express";
import db from "../config/db.js"; // ✅ make sure this connects to MySQL

const router = express.Router();

// POST /contact — receive message and save to DB
router.post("/", (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  if (!firstName || !lastName || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql =
    "INSERT INTO contact_messages (firstname, lastname, email, subject, message) VALUES (?, ?, ?, ?, ?)";

  db.query(sql, [firstName, lastName, email, subject, message], (err, result) => {
    if (err) {
      console.error("❌ Error inserting message:", err);
      return res.status(500).json({ error: "Database insert failed" });
    }

    res.status(200).json({ success: true, message: "Message stored successfully" });
  });
});

// GET /contact/messages — fetch all feedback
router.get("/messages", (req, res) => {
  const sql = "SELECT * FROM contact_messages ORDER BY date DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching messages:", err);
      return res.status(500).json({ error: "Database fetch failed" });
    }
    res.json(results);
  });
});

export default router;
