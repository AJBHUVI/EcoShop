import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
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
  updateQuantity: (product_id: number, delta: number) => void;
  removeMultiple: (productIds: number[]) => void;   
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const getUserId = () =>
    sessionStorage.getItem("user_id") ?? sessionStorage.getItem("userId") ?? null;

  const loadCart = async () => {
    const userId = getUserId();
    if (!userId) {
      setCart([]);
      return;
    }
    try {
      const res = await axios.get(`/cart/${userId}`);
      const normalized = res.data.map((r: any) => ({
        product_id: Number(r.product_id),
        name: String(r.name),
        price: Number(r.price),
        quantity: Number(r.quantity),
        image: r.image ?? "",
      }));
      setCart(normalized);
    } catch (err) {
      console.error("❌ Error loading cart:", err);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = async (item: CartItem) => {
    const userId = getUserId();
    if (!userId) {
      alert("Please login to add items to cart");
      return;
    }

    setCart((prev) => {
      const found = prev.find((p) => p.product_id === item.product_id);
      if (found) {
        return prev.map((p) =>
          p.product_id === item.product_id
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }
      return [...prev, item];
    });

    setIsCartOpen(true);

    try {
      await axios.post("/cart/add", {
        user_id: userId,
        product_id: item.product_id,
        quantity: item.quantity,
      });
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
    }
  };

  const removeFromCart = async (product_id: number) => {
    const userId = getUserId();
    if (!userId) return;

    setCart((prev) => prev.filter((i) => i.product_id !== product_id));

    try {
      await axios.delete(`/cart/${userId}/${product_id}`);
    } catch (err) {
      console.error("❌ Error removing from cart:", err);
    }
  };

  // ✅ NEW: Remove multiple selected items
  const removeMultiple = async (productIds: number[]) => {
    const userId = getUserId();
    if (!userId) return;

    // ✅ Remove selected items UI
    setCart((prev) => prev.filter((item) => !productIds.includes(item.product_id)));

    try {
      // ✅ Remove from backend
      for (const pid of productIds) {
        await axios.delete(`/cart/${userId}/${pid}`);
      }
    } catch (err) {
      console.error("❌ Error removing multiple items:", err);
    }
  };

  const clearCart = async () => {
    const userId = getUserId();
    if (!userId) return;

    setCart([]);
    try {
      await axios.delete(`/cart/clear/${userId}`);
    } catch (err) {
      console.error("❌ Error clearing cart:", err);
    }
  };

  const updateQuantity = async (product_id: number, delta: number) => {
    setCart((prev) =>
      prev.map((i) =>
        i.product_id === product_id
          ? { ...i, quantity: Math.max(1, i.quantity + delta) }
          : i
      )
    );

    const userId = getUserId();
    if (!userId) return;

    const item = cart.find((i) => i.product_id === product_id);

    try {
      await axios.post("/cart/update", {
        user_id: userId,
        product_id,
        quantity: item?.quantity,
      });
    } catch (err) {
      console.error("❌ Error updating quantity:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        removeMultiple,   // ✅ Added
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};
