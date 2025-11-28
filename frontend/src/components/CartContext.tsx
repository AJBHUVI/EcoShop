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
  updateQuantity: (product_id: number, delta: number) => void;
  removeMultiple: (ids: number[]) => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const getUserId = () => sessionStorage.getItem("user_id");

  // load cart from backend
  const loadCart = async () => {
    const userId = getUserId();
    if (!userId) {
      setCart([]);
      return;
    }

    try {
      const res = await axios.get(`/cart/${userId}`);
      setCart(
        res.data.map((r: any) => ({
          product_id: Number(r.product_id),
          name: r.name,
          price: Number(r.price),
          quantity: Number(r.quantity),
          image: r.image ?? "",
        }))
      );
    } catch {
      setCart([]);
    }
  };

  // 🚀 On app start + whenever user logs in/out
  useEffect(() => {
    loadCart();

    const userChangeHandler = () => loadCart();
    window.addEventListener("userChanged", userChangeHandler);

    return () => {
      window.removeEventListener("userChanged", userChangeHandler);
    };
  }, []);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = async (item: CartItem) => {
    const userId = getUserId();
    if (!userId) return alert("Please login");

    // optimistic UI
    setCart((prev) => {
      const existing = prev.find((p) => p.product_id === item.product_id);
      if (existing) {
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
    } catch {
      loadCart();
    }
  };

  const removeFromCart = async (product_id: number) => {
    const userId = getUserId();
    if (!userId) return;

    setCart((prev) => prev.filter((i) => i.product_id !== product_id));

    try {
      await axios.delete(`/cart/${userId}/${product_id}`);
    } catch {
      loadCart();
    }
  };

  const removeMultiple = async (ids: number[]) => {
    const userId = getUserId();
    if (!userId) return;

    setCart((prev) => prev.filter((i) => !ids.includes(i.product_id)));

    try {
      await Promise.all(ids.map((id) => axios.delete(`/cart/${userId}/${id}`)));
    } catch {
      loadCart();
    }
  };

  const clearCart = async () => {
    const userId = getUserId();
    setCart([]); // clear UI immediately

    if (!userId) return;

    try {
      await axios.delete(`/cart/clear/${userId}`);
    } catch {
      loadCart();
    }
  };

  const updateQuantity = async (product_id: number, delta: number) => {
    const userId = getUserId();
    if (!userId) return;

    // optimistic change
    let newQty = 1;
    setCart((prev) =>
      prev.map((item) => {
        if (item.product_id === product_id) {
          newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );

    try {
      await axios.post("/cart/update", {
        user_id: userId,
        product_id,
        quantity: newQty,
      });
    } catch {
      loadCart();
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
        removeMultiple,
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
