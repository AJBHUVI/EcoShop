// src/components/CartDrawer.tsx
import React from "react";
import { useCart } from "./CartContext";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${
        isCartOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className="bg-white w-96 h-full shadow-lg p-6 flex flex-col transform transition-transform duration-300"
           style={{ transform: isCartOpen ? "translateX(0)" : "translateX(100%)" }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          <button onClick={closeCart}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
  {cart.length === 0 ? (
    <p className="text-center text-muted-foreground mt-10">
      Your cart is empty.
    </p>
  ) : (
    cart.map((item) => (
      <div
        key={item.product_id || item.product_id || item.name}
        className="flex justify-between items-center border-b pb-2"
      >
        <div className="flex items-center gap-3">
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rounded-md object-cover"
            />
          )}
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity ?? 1} × ${item.price}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <>
            <div className="mt-4 font-semibold">Total: ${total.toFixed(2)}</div>
            <div className="mt-4 flex gap-3">
              <Button variant="outline" onClick={clearCart} className="flex-1">
                Clear Cart
              </Button>
              <Button className="flex-1">Checkout</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

