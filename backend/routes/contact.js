import express from "express";
import db from "../config/db.js";

const router = express.Router();

// ✅ POST /contact → save feedback
router.post("/", async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  if (!firstName || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO contact_messages (firstname, lastname, email, subject, message) VALUES (?, ?, ?, ?, ?)",
      [firstName, lastName, email, subject, message]
    );
    res.status(200).json({ success: true, id: result.insertId });
  } catch (error) {
    console.error("❌ Error saving contact message:", error);
    res.status(500).json({ error: "Failed to save contact message" });
  }
});

// ✅ GET /contact/messages → fetch all feedbacks
router.get("/messages", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM contact_messages ORDER BY date DESC"
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

export default router;
