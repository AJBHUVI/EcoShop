// src/pages/CartPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/components/CartContext";
import { Button } from "@/components/ui/button";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart } = useCart();

  const subtotal = cart.reduce((total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
  const shipping = cart.length > 0 ? 10 : 0;
  const total = subtotal + shipping;

  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="flex justify-between p-8">
      <div className="w-2/3">
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map((item, idx) => (
            <div key={`${item.product_id ?? "p"}-${idx}`} className="flex items-center justify-between mb-6">
              {item.image ? <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" /> : null}
              <div className="flex-1 ml-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p>${(Number(item.price) || 0).toFixed(2)}</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => updateQuantity(item.product_id, -1)}
                    aria-label={`Decrease quantity of ${item.name}`}
                    className="px-2 py-1 border rounded"
                  >
                    -
                  </button>
                  <span className="mx-3">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product_id, 1)}
                    aria-label={`Increase quantity of ${item.name}`}
                    className="px-2 py-1 border rounded"
                  >
                    +
                  </button>
                </div>
              </div>
              <Button variant="destructive" onClick={() => removeFromCart(item.product_id)}>
                Remove
              </Button>
            </div>
          ))
        )}
      </div>

      <div className="w-1/3 p-6 bg-white shadow rounded-xl">
        <h2 className="font-bold mb-4 text-lg">Order Summary</h2>
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Shipping: ${shipping.toFixed(2)}</p>
        <p className="font-bold text-green-600 mt-2">Total: ${total.toFixed(2)}</p>
        <Button className="mt-4 w-full" onClick={handleProceedToCheckout}>
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
