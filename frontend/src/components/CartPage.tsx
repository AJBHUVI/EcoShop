import React from "react";
import { useCart } from "@/components/CartContext";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="text-gray-600 text-lg">Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.product_id}
                className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm"
              >
                <div className="flex items-center gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-500">
                      {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="flex justify-between items-center mt-6">
              <h2 className="text-xl font-semibold">
                Total: ₹{total.toFixed(2)}
              </h2>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="px-6"
                >
                  Clear Cart
                </Button>

                <Button
                  className="px-6 bg-green-600 text-white"
                  onClick={() => (window.location.href = "/checkout")}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
