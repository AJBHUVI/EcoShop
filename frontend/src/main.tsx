import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {CartProvider}  from "@/components/CartContext";
import { FavoriteProvider } from "@/components/FavoriteContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CartProvider>
      <FavoriteProvider>
        <App />
      </FavoriteProvider>
    </CartProvider>
  </React.StrictMode>
);
