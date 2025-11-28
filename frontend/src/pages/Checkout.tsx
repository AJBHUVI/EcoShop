// src/pages/Checkout.tsx
import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/components/CartContext";

// --- totals helper (same as Cart.tsx)
const TAX_RATE = 0.02;         // 5%
const SHIPPING_FLAT = 40;      // charged when subtotal < FREE_SHIPPING_MIN
const FREE_SHIPPING_MIN = 1000; // free if subtotal >= 500

function calcTotals(items: { price: number; quantity: number }[]) {
  const subtotal = items.reduce(
    (s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 0),
    0
  );
  const shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FLAT;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;
  return { subtotal, shipping, tax, total, taxRate: TAX_RATE };
}
// --- end helper

export default function Checkout() {
  const { cart: fullCart, removeMultiple } = useCart();
  const navigate = useNavigate();
  const { state } = useLocation();

  // selected items passed from cart OR fallback to full cart
  const cart = state?.items ?? fullCart;

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [method, setMethod] = useState<"card" | "cod">("card");
  const [card, setCard] = useState({ num: "", exp: "", cvc: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const { subtotal, shipping, tax, total, taxRate } = useMemo(
    () =>
      calcTotals(
        cart.map((i: any) => ({ price: i.price, quantity: i.quantity }))
      ),
    [cart]
  );

  const fmt = (n: number) => `₹${n.toFixed(2)}`;

  const placeOrder = async () => {
    if (!name.trim() || !address.trim()) {
      return setError("Please fill your name and address!");
    }
    if (method === "card") {
      const cardNumber = card.num.replace(/\D/g, "");
      if (cardNumber.length !== 12) {
        return setError("Card number must be exactly 12 digits.");
      }
      if (!card.exp.trim()) return setError("Please enter expiry date (MM/YY).");
      if (!card.cvc.trim()) return setError("Please enter CVC.");
    }

    const user_id = sessionStorage.getItem("user_id");
    if (!user_id) return setError("Login required");

    setLoading(true);
    try {
      const payload = {
        user_id,
        items: cart,
        customer_name: name,
        shipping_address: address,
        payment_method: method,
      };

      const { data } = await axios.post("/orders", payload);

      setOrderId(data.order?.order_id);
      setError("");

      if (cart.length > 0) {
        const ids = cart.map((i: any) => i.product_id);
        removeMultiple(ids);  // after order placed remove items from cart
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
          <h2 className="text-xl font-semibold">Your Order was Successful....!🎉</h2>
          <p className="text-sm text-gray-600 mt-2">Your order #{orderId} was placed.</p>
          <div className="flex gap-3 mt-5">
            <Button onClick={() => navigate("/profile?tab=orders")}>View Orders here..!</Button>
            <Button variant="ghost" onClick={() => navigate("/shop")}>Continue Shopping...</Button>
          </div>
        </div>
      </div>
    );

  if (!cart.length) return <div className="text-center py-20 text-gray-500">Your cart is empty.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <Card className="p-6 lg:col-span-2 space-y-4">

          <input placeholder="Full name" className="border p-2 rounded w-full" 
          value={name} 
          onChange={(e) => setName(e.target.value)} />

          <textarea placeholder="Shipping address" className="border p-2 rounded w-full h-24" 
          value={address} 
          onChange={(e) => setAddress(e.target.value)} />

          <div className="space-y-2">
            <label className="font-medium">Payment Method</label>
            <div className="flex gap-4">
              <label>
                <input type="radio" checked={method === "card"} onChange={() => setMethod("card")} /> Card
              </label>
              <label>
                <input type="radio" checked={method === "cod"} onChange={() => setMethod("cod")} /> COD
              </label>
            </div>
          </div>

          {method === "card" && (
            <div className="grid sm:grid-cols-3 gap-3">
              <input placeholder="2422 7680 3674" className="border p-2 rounded" 
              value={card.num} 
              onChange={(e) => setCard({ ...card, num: e.target.value })} />

              <input placeholder="MM/YY" className="border p-2 rounded" 
              value={card.exp} 
              onChange={(e) => setCard({ ...card, exp: e.target.value })} />

              <input placeholder="CVC" className="border p-2 rounded" 
              value={card.cvc} 
              onChange={(e) => setCard({ ...card, cvc: e.target.value })} />
            </div>
          )}

          {error && <p className="text-red-600">{error}</p>}
        </Card>

        {/* RIGHT */}
        <Card className="p-6 h-fit space-y-4">
          <h2 className="text-xl font-semibold">Order Summary</h2>

          <div className="space-y-2 max-h-40 overflow-auto">
            {cart.map((i: any) => (
              <div key={i.product_id} className="flex justify-between">
                <span>
                  {i.name} - {i.quantity}×
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
            <span>{shipping === 0 ? "Free" : fmt(shipping)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
            <span>{fmt(tax)}</span>
          </div>

          <div className="flex justify-between font-bold text-green-600 text-lg">
            <span>Total</span>
            <span>{fmt(total)}</span>
          </div>

          <Button className="w-full mt-4" onClick={placeOrder} disabled={loading}>
            place order
          </Button>
        </Card>
      </div>
    </div>
  );
}
