import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';
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
app.use(cors()); // optional; can remove later if same origin

// ----------------------------
// API ROUTES
// ----------------------------
app.use('/', usersRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/orders', ordersRouter);
app.use('/contact', contactRouter);

// ----------------------------
// FRONTEND HANDLING
// ----------------------------
if (process.env.NODE_ENV === 'development') {
  // ✅ Use proxy during npm run watch
  app.use(
    '/',
    createProxyMiddleware({
      target: 'http://localhost:5173', // your Vite dev server
      changeOrigin: true,
      ws: true, // WebSocket support for hot reload
    })
  );
}
//  else {
//   // ✅ Use built files for production
//   app.use(express.static(path.join(__dirname, '../frontend/dist')));
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
//   });
// }

// ----------------------------
// START SERVER
// ----------------------------
const PORT = 80; // 👈 No need for port number in URL
app.listen(PORT, () => {
  console.log(`✅ EcoShop running on http://localhost`);
});
