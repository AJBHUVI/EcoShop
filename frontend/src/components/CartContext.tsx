import React, { createContext, useContext, useState, useEffect } from "react";
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

  // ✅ Load cart from DB
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`/api/cart/${userId}`)
        .then((res) => setCart(res.data))
        .catch((err) => console.error("❌ Error fetching cart from DB:", err));
    }
  }, []);

  // ✅ Add item to cart + save to DB
  const addToCart = async (item: CartItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((p) => p.product_id === item.product_id);
      if (existing) {
        return prevCart.map((p) =>
          p.product_id === item.product_id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });

    setIsCartOpen(true);

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      await axios.post("/api/cart/add", {
        userId,
        productId: item.product_id,
        quantity: 1,
      });
      console.log("✅ Cart item saved to DB");
    } catch (err) {
      console.error("❌ Error saving cart item to DB:", err);
    }
  };

  // ✅ Remove item from cart + DB
  const removeFromCart = async (product_id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.product_id !== product_id));

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      await axios.delete(`/api/cart/${userId}/${product_id}`);
      console.log("🗑️ Cart item removed from DB");
    } catch (err) {
      console.error("❌ Error removing item from DB:", err);
    }
  };

  // ✅ Clear entire cart
  const clearCart = async () => {
    setCart([]);

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      await axios.delete(`/api/cart/clear/${userId}`);
      console.log("🧹 Cart cleared from DB");
    } catch (err) {
      console.error("❌ Error clearing cart in DB:", err);
    }
  };

  // ✅ Update quantity + save to DB
  const updateQuantity = async (id: number, delta: number) => {
    const updatedCart = cart.map((item) =>
      item.product_id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    setCart(updatedCart);

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const updatedItem = updatedCart.find((i) => i.product_id === id);
    if (updatedItem) {
      try {
        await axios.post("/api/cart/update", {
          userId,
          productId: id,
          quantity: updatedItem.quantity,
        });
        console.log("🔄 Quantity updated in DB");
      } catch (err) {
        console.error("❌ Error updating quantity in DB:", err);
      }
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

export const useCart = () => useContext(CartContext);
