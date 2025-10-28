import express from "express";

const router = express.Router();

// Temporary in-memory storage
let messages = [];

// POST /api/contact - receive message
router.post("/", (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  if (!firstName || !lastName || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newMessage = {
    id: messages.length + 1,
    firstName,
    lastName,
    email,
    subject,
    message,
    date: new Date().toLocaleString(),
  };

  messages.push(newMessage);

  res.status(200).json({ success: true, message: "Message sent successfully" });
});

// GET /api/contact/messages - admin view
router.get("/messages", (req, res) => {
  res.json(messages);
});

export default router;
