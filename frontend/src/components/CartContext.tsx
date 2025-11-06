// src/components/CartContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (product_id: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  updateQuantity: (product_id: number, delta: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const getUserId = () =>
    sessionStorage.getItem("user_id") ?? sessionStorage.getItem("userId") ?? null;

  // Load cart from backend and normalize fields to expected UI shape
  useEffect(() => {
    const user_id = getUserId();
    if (!user_id) return;

    axios
      .get(`/cart/${user_id}`)
      .then((res) => {
        const rows = res.data || [];
        const normalized: CartItem[] = rows.map((r: any, i: number) => ({
          product_id: Number(r.product_id ?? r.productId ?? r.id ?? 0),
          name: String(r.name ?? r.title ?? `Product ${i + 1}`),
          price: Number(r.price ?? 0) || 0,
          quantity: Math.max(1, Number(r.quantity ?? r.qty ?? 1) || 1),
          image: r.image ?? r.img ?? "",
        }));
        setCart(normalized);
      })
      .catch((err) => {
        console.error("❌ Error fetching cart from DB:", err);
      });
  }, []);

  const addToCart = async (item: CartItem) => {
    setCart((prev) => {
      const found = prev.find((p) => p.product_id === item.product_id);
      return found
        ? prev.map((p) =>
            p.product_id === item.product_id ? { ...p, quantity: p.quantity + 1 } : p
          )
        : [...prev, { ...item, quantity: 1 }];
    });

    setIsCartOpen(true);

    const user_id = getUserId();
    if (!user_id) return;

    try {
      await axios.post("/cart/add", {
        user_id,
        product_id: item.product_id,
        quantity: 1,
      });
    } catch (err) {
      console.error("❌ Error saving cart item to DB:", err);
    }
  };

  const removeFromCart = async (product_id: number) => {
    setCart((prev) => prev.filter((i) => i.product_id !== product_id));

    const user_id = getUserId();
    if (!user_id) return;

    try {
      await axios.delete(`/cart/${user_id}/${product_id}`);
    } catch (err) {
      console.error("❌ Error removing item from DB:", err);
    }
  };

  const clearCart = async () => {
    setCart([]);
    const user_id = getUserId();
    if (!user_id) return;

    try {
      await axios.delete(`/cart/clear/${user_id}`);
    } catch (err) {
      console.error("❌ Error clearing cart in DB:", err);
    }
  };

  const updateQuantity = async (product_id: number, delta: number) => {
    const updated = cart.map((i) =>
      i.product_id === product_id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
    );
    setCart(updated);

    const user_id = getUserId();
    if (!user_id) return;

    const item = updated.find((i) => i.product_id === product_id);
    if (!item) return;

    try {
      await axios.post("/cart/update", {
        user_id,
        product_id,
        quantity: item.quantity,
      });
    } catch (err) {
      console.error("❌ Error updating quantity in DB:", err);
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
