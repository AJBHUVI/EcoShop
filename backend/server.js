import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import usersRouter from './routes/users.js';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import ordersRouter from './routes/orders.js';
import contactRouter from './routes/contact.js';
import './config/db.js'; // ✅ ensures MySQL connects

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors()); // optional; can be removed later when frontend+backend share domain

// ----------------------------
// API ROUTES
// ----------------------------
app.use("/", usersRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/orders', ordersRouter);
app.use('/contact', contactRouter);

// ----------------------------
// SERVE FRONTEND BUILD (React)
// ----------------------------
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// For any non-API routes → send index.html (so React Router works)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// ----------------------------
// START SERVER
// ----------------------------
const PORT = 80; // 👈 now runs on port 80 (no need :5002)
app.listen(PORT, () => {
  console.log(`✅ EcoShop running on http://localhost`);
});
