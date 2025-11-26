// src/pages/Cart.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Minus } from "lucide-react";
import axios from "axios";

type Item = {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  selected?: boolean;
};

// --- small totals helper (copy into Checkout.tsx too)
const TAX_RATE = 0.05; // 5%
const SHIPPING = 40;   // flat shipping

function calcTotals(items: { price: number; quantity: number }[]) {
  const subtotal = items.reduce(
    (s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 0),
    0
  );
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100; // round to 2 decimals
  const total = Math.round((subtotal + SHIPPING + tax) * 100) / 100;
  return { subtotal, shipping: SHIPPING, tax, total, taxRate: TAX_RATE };
}
// --- end helper

export default function Cart(): JSX.Element {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = typeof window !== "undefined" ? sessionStorage.getItem("user_id") : null;

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!userId) {
        setItems([]);
        setLoading(false);
        return;
      }
      try {
        const url = `/cart/${encodeURIComponent(userId)}`;
        const res = await axios.get(url);
        const rows = res.data || [];
        setItems(
          rows.map((d: any) => ({
            product_id: Number(d.product_id),
            name: d.name ?? String(d.product_id),
            price: Number(d.price ?? 0),
            quantity: Number(d.quantity ?? 1),
            image: d.image ?? "",
            selected: true,
          }))
        );
      } catch (err) {
        console.error("Failed to load cart", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const selectedItems = useMemo(() => items.filter((i) => i.selected), [items]);

  const { subtotal, shipping, tax, total, taxRate } = useMemo(
    () =>
      calcTotals(
        selectedItems.map((it) => ({ price: it.price, quantity: it.quantity }))
      ),
    [selectedItems]
  );

  // ---------------- Remove Item (Axios) ----------------
  const removeItem = async (product_id: number) => {
    if (!userId) return alert("Login required");

    const snapshot = items.slice(); // save for rollback
    setItems((cur) => cur.filter((i) => i.product_id !== product_id)); // optimistic UI

    try {
      await axios.delete(`/cart/${encodeURIComponent(userId)}/${encodeURIComponent(product_id)}`);
    } catch (err) {
      console.error("remove failed", err);
      setItems(snapshot); // rollback
      alert("Could not remove item");
    }
  };

  // ---------------- Update Quantity (Axios) ----------------
  const updateQty = async (product_id: number, delta: number) => {
    if (!userId) return alert("Login required");

    const snapshot = items.slice();
    const current = snapshot.find((i) => i.product_id === product_id);
    const newQty = Math.max(1, (current?.quantity ?? 1) + delta);

    setItems((cur) => cur.map((i) => (i.product_id === product_id ? { ...i, quantity: newQty } : i)));

    try {
      await axios.post("/cart/update", {
        user_id: userId,
        product_id,
        quantity: newQty,
      });
    } catch (err) {
      console.error("updateQty error", err);
      setItems(snapshot); // rollback
      alert("Could not update quantity");
    }
  };

  // ---------------- Clear Cart (Axios) ----------------
  const clearCart = async () => {
    if (!userId) return alert("Login required");
    if (!confirm("Clear cart?")) return;

    try {
      const url = `/cart/clear/${encodeURIComponent(userId)}`;
      const res = await axios.delete(url);
      if (res.status < 200 || res.status >= 300) throw new Error("Clear failed");
      setItems([]);
    } catch (err) {
      console.error("clearCart error", err);
      alert("Could not clear cart");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {loading ? (
        <div>Loading…</div>
      ) : items.length === 0 ? (
        <Card className="p-6 text-center">
          <div>Your cart is empty.</div>
          <Link to="/shop">
            <Button className="mt-3">Shop</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map((it) => (
              <Card key={it.product_id} className="p-4 flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={!!it.selected}
                  onChange={() =>
                    setItems((prev) => prev.map((x) => (x.product_id === it.product_id ? { ...x, selected: !x.selected } : x)))
                  }
                />
                <img src={it.image} alt={it.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm">₹{it.price.toLocaleString()}</div>

                  <div className="flex items-center gap-2 mt-2">
                    <Button size="sm" variant="outline" onClick={() => updateQty(it.product_id, -1)}>
                      <Minus className="h-4 w-4" />
                    </Button>

                    <div className="px-3">{it.quantity}</div>

                    <Button size="sm" variant="outline" onClick={() => updateQty(it.product_id, +1)}>
                      <Plus className="h-4 w-4" />
                    </Button>

                    <button onClick={() => removeItem(it.product_id)} className="ml-3 text-red-600 flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />Remove
                    </button>
                  </div>
                </div>

                <div className="text-right font-bold">₹{(it.price * it.quantity).toLocaleString()}</div>
              </Card>
            ))}
          </div>

          <Card className="p-4">
            <h2 className="font-semibold text-lg mb-3">Summary</h2>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{shipping.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>

            <div className="mt-3 border-t pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <div className="mt-4 space-y-2">
              <Link to="/checkout" state={{ items: selectedItems }}>
                <Button className="w-full" disabled={subtotal === 0}>
                  Checkout
                </Button>
              </Link>
              <button onClick={clearCart} className="w-full border rounded px-3 py-2">
                Clear Cart
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
