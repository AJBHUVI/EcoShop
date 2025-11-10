// ✅ short & optimized Checkout.tsx
import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/components/CartContext";

export default function Checkout() {
  const { cart: fullCart, removeMultiple } = useCart();
  const navigate = useNavigate();
  const { state } = useLocation();

  // ✅ only selected items OR whole cart
  const cart = state?.items ?? fullCart;

  // ✅ form state
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [method, setMethod] = useState<"card" | "cod">("card");
  const [card, setCard] = useState({ num: "", exp: "", cvc: "" });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  // ✅ totals
  const subtotal = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.quantity, 0),
    [cart]
  );
  const shipping = 10;
  const total = subtotal + shipping;

  const fmt = (n: number) => `$${n.toFixed(2)}`;

  // ✅ place order
  const placeOrder = async () => {
    if (!name.trim() || !address.trim()) {
      return setError("Enter name & address");
    }
    if (method === "card" && card.num.replace(/\D/g, "").length < 12) {
      return setError("Invalid card");
    }

    const user_id = sessionStorage.getItem("user_id");
    if (!user_id) return setError("Login required");

    setLoading(true);
    try {
      const payload = {
        user_id,
        items: cart,
        subtotal,
        shipping,
        total,
        shipping_address: address,
        customer_name: name,
        payment_method: method,
        payment_details:
          method === "card"
            ? { last4: card.num.slice(-4), expiry: card.exp }
            : { note: "Cash on Delivery" },
      };

      const { data } = await axios.post("/orders", payload);

      setOrderId(data.order?.order_id);
      setError("");

      // ✅ remove only selected items
      if (state?.items) {
        const ids = cart.map((i) => i.product_id);
        removeMultiple(ids);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Order failed");
    }
    setLoading(false);
  };

  if (orderId)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
        <div className="bg-white p-6 rounded-xl max-w-sm w-full">
          <h2 className="text-xl font-semibold">Order Successful 🎉</h2>
          <p className="text-sm text-gray-600 mt-2">
            Your order #{orderId} was placed.
          </p>
          <div className="flex gap-3 mt-5">
            <Button onClick={() => navigate("/profile?tab=orders")}>
              View Orders
            </Button>
            <Button variant="ghost" onClick={() => navigate("/")}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );

  if (!cart.length)
    return (
      <div className="text-center py-20 text-gray-500">Your cart is empty.</div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <Card className="p-6 lg:col-span-2 space-y-4">
          <input
            placeholder="Full name"
            className="border p-2 rounded w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            placeholder="Shipping address"
            className="border p-2 rounded w-full h-24"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="space-y-2">
            <label className="font-medium">Payment Method</label>
            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  checked={method === "card"}
                  onChange={() => setMethod("card")}
                />{" "}
                Card
              </label>
              <label>
                <input
                  type="radio"
                  checked={method === "cod"}
                  onChange={() => setMethod("cod")}
                />{" "}
                COD
              </label>
            </div>
          </div>

          {method === "card" && (
            <div className="grid sm:grid-cols-3 gap-3">
              <input
                placeholder="Card number"
                className="border p-2 rounded"
                value={card.num}
                onChange={(e) => setCard({ ...card, num: e.target.value })}
              />
              <input
                placeholder="MM/YY"
                className="border p-2 rounded"
                value={card.exp}
                onChange={(e) => setCard({ ...card, exp: e.target.value })}
              />
              <input
                placeholder="CVC"
                className="border p-2 rounded"
                value={card.cvc}
                onChange={(e) => setCard({ ...card, cvc: e.target.value })}
              />
            </div>
          )}

          {error && <p className="text-red-600">{error}</p>}
        </Card>

        {/* RIGHT */}
        <Card className="p-6 h-fit space-y-4">
          <h2 className="text-xl font-semibold">Order Summary</h2>

          <div className="space-y-2 max-h-40 overflow-auto">
            {cart.map((i) => (
              <div key={i.product_id} className="flex justify-between">
                <span>
                  {i.name} — {i.quantity}×
                </span>
                <span>{fmt(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>

          <hr />

          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{fmt(subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{fmt(shipping)}</span>
          </div>

          <div className="flex justify-between font-bold text-green-600 text-lg">
            <span>Total</span>
            <span>{fmt(total)}</span>
          </div>

          <Button className="w-full mt-4" onClick={placeOrder} disabled={loading}>
            {loading ? "Placing..." : "Place Order"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
