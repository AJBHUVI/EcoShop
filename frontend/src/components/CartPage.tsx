import React, { useState } from "react";
import { useCart } from "@/components/CartContext";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  // ✅ Track selected items
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // ✅ Toggle selection
  const toggleSelect = (product_id: number) => {
    setSelectedItems((prev) =>
      prev.includes(product_id)
        ? prev.filter((id) => id !== product_id)
        : [...prev, product_id]
    );
  };

  // ✅ Filter selected products
  const selectedProducts = cart.filter((item) =>
    selectedItems.includes(item.product_id)
  );

  // ✅ Summary values
  const subtotal = selectedProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 500 ? 0 : selectedProducts.length > 0 ? 40 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  // ✅ Checkout Handler (only selected products)
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to checkout.");
      return;
    }

    navigate("/checkout", {
      state: { items: selectedProducts, total },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-14">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ✅ LEFT SIDE — CART ITEMS */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h1 className="text-4xl font-bold mb-4">Your Cart</h1>

          {cart.map((item) => (
            <div
              key={item.product_id}
              className="flex items-center gap-6 bg-white shadow-lg rounded-2xl p-6 border hover:shadow-xl transition"
            >
              {/* ✅ Checkbox */}
              <input
                type="checkbox"
                checked={selectedItems.includes(item.product_id)}
                onChange={() => toggleSelect(item.product_id)}
                className="w-5 h-5 cursor-pointer"
              />

              {/* Product Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-28 h-28 rounded-xl object-cover"
              />

              {/* Product Info */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-gray-500 mt-1 text-lg">
                  ₹{item.price}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.product_id, -1)}
                    disabled={item.quantity <= 1}
                  >
                    –
                  </Button>

                  <span className="text-lg font-semibold">
                    {item.quantity}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.product_id, 1)}
                  >
                    +
                  </Button>
                </div>

                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className="text-red-500 text-sm mt-3 hover:underline"
                >
                  Remove
                </button>
              </div>

              {/* Price */}
              <div className="text-lg font-bold text-gray-700">
                ₹{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* ✅ RIGHT SIDE — ORDER SUMMARY */}
        <div className="bg-white shadow-xl rounded-2xl p-8 h-fit border sticky top-24">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

          {selectedItems.length === 0 ? (
            <p className="text-gray-500 mb-6">Select the items first to checkout</p>
          ) : (
            <>
              <div className="space-y-4 text-lg">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-2xl font-bold">
                  <span>Total</span>
                  <span className="text-green-600">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="mt-8 space-y-4">
            <Button
              className="w-full py-3 text-lg bg-green-600 hover:bg-green-700"
              onClick={handleCheckout}
              disabled={selectedItems.length === 0}
            >
              Checkout Selected
            </Button>

            <Button
              variant="outline"
              className="w-full py-3 text-lg"
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
