// src/pages/Checkout.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext";

/**
 * Checkout page with payment method options including Cash on Delivery (COD).
 * - If payment_method === "card", cardNumber must be provided (demo).
 * - If payment_method === "cod", card inputs are optional and not required.
 * - POST to /orders includes payment_method and (optional) payment_details.
 */

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  // Shipping / customer
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<null | { order_id: number }>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cart.length > 0 ? 10 : 0;
  const total = subtotal + shipping;

  const formatCurrency = (n: number) => `$${n.toFixed(2)}`;

  const validate = () => {
    if (!name.trim()) {
      setError("Please enter your full name.");
      return false;
    }
    if (!address.trim()) {
      setError("Please enter your shipping address.");
      return false;
    }
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return false;
    }
    if (paymentMethod === "card") {
      // very basic demo validation
      const num = cardNumber.replace(/\s+/g, "");
      if (!/^\d{12,19}$/.test(num)) {
        setError("Please enter a valid card number (demo).");
        return false;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        setError("Enter expiry in MM/YY format (demo).");
        return false;
      }
      if (!/^\d{3,4}$/.test(cardCvc)) {
        setError("Enter CVC (3 or 4 digits).");
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;

    const user_id = sessionStorage.getItem("user_id");
    if (!user_id) {
      setError("Please login to place an order.");
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        user_id,
        items: cart,
        subtotal,
        shipping,
        total,
        shipping_address: address,
        customer_name: name,
        payment_method: paymentMethod,
      };

      // Only include payment details in demo mode when card selected
      if (paymentMethod === "card") {
        payload.payment_details = {
          cardNumber: cardNumber.replace(/\s+/g, "").slice(-4) ? `**** **** **** ${cardNumber.replace(/\s+/g, "").slice(-4)}` : null,
          cardExpiry,
        };
        // NOTE: in production, never send raw card numbers to your backend; use a payment gateway tokenization.
      } else {
        payload.payment_details = { note: "Cash on Delivery selected" };
      }

      const resp = await axios.post("/orders", payload);
      const created = resp.data && resp.data.order ? resp.data.order : resp.data;

      clearCart();
      setSuccessOrder({ order_id: created.order_id || created.order_id || -1 });

      // optional: quick redirect after showing success
      setTimeout(() => navigate("/orders"), 1500);
    } catch (err: any) {
      console.error("Place order failed:", err);
      setError(err?.response?.data?.message || "Failed to place order. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-gray-900">Checkout</h1>

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* LEFT: Forms */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 shadow-lg border-0">
              <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
              <p className="text-sm text-gray-500 mb-4">Provide shipping details so we can deliver your order.</p>

              <div className="grid grid-cols-1 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Full name</span>
                  <input
                    className="mt-1 block w-full rounded-md border-gray-200 bg-white px-4 py-3 shadow-sm focus:ring-2 focus:ring-green-400 transition"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-label="Full name"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Shipping address</span>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-200 bg-white px-4 py-3 shadow-sm focus:ring-2 focus:ring-green-400 transition"
                    placeholder="Street, city, state, ZIP"
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    aria-label="Shipping address"
                  />
                </label>
              </div>
            </Card>

            <Card className="p-8 shadow-lg border-0">
              <h2 className="text-2xl font-semibold mb-4">Payment Information</h2>
              <p className="text-sm text-gray-500 mb-4">Choose a payment method. Demo mode — do not enter real card details.</p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="form-radio"
                    />
                    <span className="ml-2 font-medium">Card</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="form-radio"
                    />
                    <span className="ml-2 font-medium">Cash on Delivery (COD)</span>
                  </label>
                </div>

                {paymentMethod === "card" ? (
                  <>
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700">Card number</span>
                      <input
                        className="mt-1 block w-full rounded-md border-gray-200 bg-white px-4 py-3 shadow-sm focus:ring-2 focus:ring-green-400 transition"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        inputMode="numeric"
                      />
                    </label>

                    <div className="flex gap-4">
                      <input
                        className="mt-1 block w-1/2 rounded-md border-gray-200 bg-white px-4 py-3 shadow-sm focus:ring-2 focus:ring-green-400 transition"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                      />
                      <input
                        className="mt-1 block w-1/2 rounded-md border-gray-200 bg-white px-4 py-3 shadow-sm focus:ring-2 focus:ring-green-400 transition"
                        placeholder="CVC"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        inputMode="numeric"
                      />
                    </div>
                  </>
                ) : (
                  <div className="p-3 bg-green-50 text-sm rounded">
                    <strong>Cash on Delivery:</strong> Pay the courier when your order arrives. A small verification may be requested.
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* RIGHT: Order summary */}
          <div className="space-y-4">
            <Card className="p-6 shadow-xl border-0 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

              <div className="space-y-3 max-h-44 overflow-auto pr-2">
                {cart.length === 0 ? (
                  <div className="text-sm text-gray-500">Your cart is empty.</div>
                ) : (
                  cart.map((item) => (
                    <div key={item.product_id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.quantity} × {formatCurrency(item.price)}</div>
                        </div>
                      </div>
                      <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between text-lg mt-2">
                  <span className="font-bold">Total</span>
                  <span className="font-extrabold text-green-600">{formatCurrency(total)}</span>
                </div>
              </div>

              {error && <div className="text-sm text-red-600 mt-3">{error}</div>}

              <Button
                className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transform hover:-translate-y-0.5 transition"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? "Placing order..." : "Place Order"}
              </Button>

              <div className="mt-3 text-xs text-gray-500">
                You will be redirected to the orders page after successful placement.
              </div>
            </Card>

            <Card className="p-4 text-center text-sm text-gray-600">
              <div className="font-medium">Secure Checkout</div>
              <div className="mt-1">All payments are encrypted. This demo does not process real payments.</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Success modal */}
      {successOrder && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative max-w-md w-full bg-white rounded-xl shadow-2xl p-6 z-10 transform transition">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-100 p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <div className="text-lg font-semibold">Order Placed</div>
                <div className="text-sm text-gray-600">Thanks — your order #{successOrder.order_id} was submitted.</div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button onClick={() => navigate("/orders")} className="flex-1">View Orders</Button>
              <Button variant="ghost" onClick={() => setSuccessOrder(null)} className="flex-1">Continue Shopping</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
