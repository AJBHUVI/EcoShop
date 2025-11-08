// src/pages/Checkout.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/components/CartContext";

type PaymentMethod = "card" | "cod";

export default function Checkout(): JSX.Element {
  const { cart: rawCart, clearCart } = useCart();
  const cart = rawCart ?? []; // safety fallback
  const navigate = useNavigate();

  // form state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<number | null>(null);

  const subtotal = useMemo(
    () => cart.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0),
    [cart]
  );
  const shipping = cart.length > 0 ? 10 : 0;
  const total = subtotal + shipping;

  const fmt = (n: number) => `$${n.toFixed(2)}`;

  const validate = () => {
    if (!name.trim() || !address.trim()) {
      setError("Please enter your name and shipping address.");
      return false;
    }
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return false;
    }
    if (paymentMethod === "card") {
      const digits = cardNumber.replace(/\D/g, "");
      if (digits.length < 12) {
        setError("Please enter a valid (demo) card number.");
        return false;
      }
    }
    setError(null);
    return true;
  };

  const placeOrder = async () => {
    if (!validate()) return;
    const user_id = sessionStorage.getItem("user_id");
    if (!user_id) {
      setError("Please log in to place an order.");
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

      if (paymentMethod === "card") {
        payload.payment_details = {
          last4: cardNumber.replace(/\D/g, "").slice(-4) || null,
          expiry: cardExpiry || null,
        };
      } else {
        payload.payment_details = { note: "Cash on Delivery" };
      }

      const { data } = await axios.post("/orders", payload);
      const createdId = data?.order?.order_id ?? data?.order_id ?? null;

      // 1) show success modal immediately
      setSuccessOrder(createdId ?? -1);
      setError(null);

      // 2) clear cart shortly after so modal isn't lost by a synchronous re-render
      setTimeout(() => {
        clearCart();
      }, 200);

      // Do NOT auto-redirect here — allow user to click the actions
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // If there is a successOrder, show only the modal and hide the form behind it.
  // If no success and cart is empty, optionally show a friendly message:
  const showEmptyFallback = !successOrder && cart.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        {showEmptyFallback ? (
          <div className="py-20 text-center text-gray-500">Your cart is empty.</div>
        ) : (
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-3">Shipping</h2>
                <input
                  aria-label="Full name"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border rounded p-2 w-[600px]"
                />

                <textarea
                  aria-label="Shipping address"
                  placeholder="Street, city, state, ZIP"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="border rounded p-2 w-[600px] h-24 mt-3"
                />

                <h3 className="text-lg font-medium mt-4">Payment</h3>
                <div className="flex gap-4 my-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                    />
                    <span>Card</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <span>Cash on Delivery (COD)</span>
                  </label>
                </div>

                {paymentMethod === "card" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      placeholder="1234 5678 9012 "
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="border rounded p-2 w-full"
                    />
                    <input
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="border rounded p-2 flex-1"
                    />
                    <input
                      placeholder="CVC"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="border rounded p-2 flex-1"
                    />
                  </div>
                )}

                {error && <div className="text-red-600 mt-3">{error}</div>}
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="p-6 sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                <div className="space-y-2 max-h-40 overflow-auto mb-4">
                  {cart.map((it: any, i: number) => (
                    <div key={i} className="flex justify-between">
                      <div>
                        <div className="font-medium">{it.name}</div>
                        <div className="text-sm text-gray-500">{it.quantity} × {fmt(Number(it.price) || 0)}</div>
                      </div>
                      <div className="font-medium">{fmt((Number(it.price) || 0) * (Number(it.quantity) || 0))}</div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>{fmt(shipping)}</span></div>
                  <div className="flex justify-between font-bold text-green-600 text-lg"><span>Total</span><span>{fmt(total)}</span></div>
                </div>

                <Button className="w-full mt-6" onClick={placeOrder} disabled={loading}>
                  {loading ? "Placing order..." : "Place Order"}
                </Button>

                <p className="text-xs text-gray-500 mt-2">After successful placement you'll see a confirmation here with actions.</p>
              </Card>

              <Card className="p-4 text-sm text-center text-gray-600">Secure Checkout — demo only</Card>
            </div>
          </div>
        )}
      </div>

      {/* Success modal (always rendered when successOrder exists) */}
      {successOrder !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative max-w-md w-full bg-white rounded-xl shadow-lg p-6 z-10">
            <h2 className="text-xl font-semibold">Your order was placed successfully 🎉</h2>
            <p className="mt-2 text-sm text-gray-600">{`Your order #${successOrder} was placed. You can view your orders page to see details.`}</p>

            <div className="mt-5 flex gap-3">
              {/* navigate to profile orders tab */}
              <Button onClick={() => navigate("/profile?tab=orders")}>View Orders</Button>
              <Button variant="ghost" onClick={() => navigate("/")}>Continue Shopping</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
