import React from "react";
import { useCart } from "./CartContext";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, removeFromCart, clearCart, updateQuantity } = useCart();

  const navigate = useNavigate();

  // ✅ Checkout Handler
  const handleCheckout = () => {
    closeCart(); // close the drawer
    navigate("/checkout"); // go to checkout page
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isCartOpen) return null;

  return (
    <div className="fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-lg z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-bold">Your Cart</h2>
        <Button variant="ghost" onClick={closeCart}>
          <X />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cart.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div
              key={item.product_id}
              className="flex gap-4 items-center border-b pb-2"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-gray-500">${item.price}</p>

                <div className="flex gap-2 mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.product_id, -1)}
                  >
                    -
                  </Button>

                  <span className="px-2">{item.quantity}</span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.product_id, 1)}
                  >
                    +
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFromCart(item.product_id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="p-4 border-t">
          <p className="text-lg font-bold mb-4">Total: ${total.toFixed(2)}</p>

          {/* ✅ FIXED BUTTON */}
          <Button className="w-full mb-2 bg-green-600" onClick={handleCheckout}>
            Checkout
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={clearCart}
          >
            Clear Cart
          </Button>
        </div>
      )}
    </div>
  );
}
