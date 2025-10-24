import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users.js';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import ordersRouter from './routes/orders.js';
import adminRouter from './routes/admin.js';   // ✅ add this
import './config/db.js';  // ✅ ensures MySQL connects

const app = express();
app.use(express.json());

// Allow frontend access
app.use(cors({ origin: 'http://localhost:5173' }));

// Routes
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/orders', ordersRouter);
//app.use('/api/admin', adminRouter);  // ✅ admin routes

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to EcoShop API! Use /users, /products, /categories, /orders');
});

// Start server
const PORT = 5002;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
