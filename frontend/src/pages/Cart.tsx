// src/pages/Cart.tsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Minus } from "lucide-react";

type CartItem = {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selected?: boolean;
};

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product_id: 1,
      name: "Organic Cotton Hoodie",
      price: 780,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&auto=format&fit=crop&q=60",
      selected: true,
    },
    {
      product_id: 2,
      name: "Wireless Mouse",
      price: 249,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1585386959984-a4155226a2d7?w=600&auto=format&fit=crop&q=60",
      selected: false,
    },
    {
      product_id: 3,
      name: "Racing Helmet",
      price: 2750,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=60",
      selected: false,
    },
  ]);

  const updateQuantity = (id: number, delta: number) =>
    setCartItems((prev) =>
      prev.map((it) =>
        it.product_id === id ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it
      )
    );

  const removeItem = (id: number) => setCartItems((prev) => prev.filter((it) => it.product_id !== id));

  const toggleSelect = (id: number) =>
    setCartItems((prev) => prev.map((it) => (it.product_id === id ? { ...it, selected: !it.selected } : it)));

  const selectAll = (checked: boolean) => setCartItems((prev) => prev.map((it) => ({ ...it, selected: checked })));

  const subtotal = useMemo(
    () => cartItems.filter((i) => i.selected).reduce((s, i) => s + i.price * i.quantity, 0),
    [cartItems]
  );

  const shipping = subtotal > 0 ? 99 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Prevent page-level overflow */}
      <div className="max-w-5xl mx-auto px-4 py-10 overflow-x-hidden">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: items list (spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-4 overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    aria-label="Select all"
                    className="w-4 h-4"
                    type="checkbox"
                    checked={cartItems.length > 0 && cartItems.every((i) => i.selected)}
                    onChange={(e) => selectAll(e.target.checked)}
                  />
                  <span className="text-sm font-medium">Select all</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
                </div>
              </div>
            </Card>

            {cartItems.map((item) => (
              /* each card keeps content inside via overflow-hidden */
              <Card key={item.product_id} className="p-4 overflow-hidden">
                {              
                  
                }
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-[40px_72px_minmax(0,1fr)] sm:grid-cols-[40px_84px_minmax(0,1fr)_auto] gap-3 items-start sm:items-center">
                    {/* checkbox */}
                    <div className="flex items-start sm:items-center">
                      <input
                        aria-label={`Select ${item.name}`}
                        className="w-4 h-4"
                        type="checkbox"
                        checked={!!item.selected}
                        onChange={() => toggleSelect(item.product_id)}
                      />
                    </div>

                    {/* image */}
                    <div className="w-full flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-20 object-cover rounded-lg shadow-sm"
                      />
                    </div>

                    {/* details column (flexible) */}
                    <div className="min-w-0">
                      <h3 className="font-semibold text-lg leading-snug break-words">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">₹{item.price.toLocaleString()}</p>

                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white border rounded-full px-2 py-1 shadow-sm">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product_id, -1)}
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <div className="px-3 text-sm min-w-[36px] text-center">{item.quantity}</div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product_id, +1)}
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="text-sm text-destructive ml-1 flex items-center gap-2"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>

                    {/* price - keep as auto column on sm+; no fixed min-width to avoid pushing */}
                    <div className="hidden sm:flex flex-col items-end justify-start">
                      <div className="text-sm text-muted-foreground">Total</div>
                      <div className="font-bold text-base">₹{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  </div>

                  {/* MOBILE: price row under details (prevents pushing layout) */}
                  <div className="sm:hidden flex justify-end">
                    <div className="text-sm text-muted-foreground mr-3">Total</div>
                    <div className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                </div>
              </Card>
            ))}

            {cartItems.length === 0 && (
              <Card className="p-6 text-center">
                <p className="text-lg">Your cart is empty.</p>
                <Link to="/shop">
                  <Button className="mt-4">Continue Shopping</Button>
                </Link>
              </Card>
            )}
          </div>

          {/* RIGHT: order summary (sticky only on lg to avoid overlay on mobile) */}
          <div>
            <Card className="p-6 lg:sticky lg:top-20">
              <h2 className="text-2xl font-bold mb-3">Order Summary</h2>

              <p className="text-sm text-muted-foreground mb-4">Select the items first to checkout</p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">₹{shipping.toLocaleString()}</span>
                </div>

                <div className="border-t pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link to="/checkout">
                  <Button className="w-full" disabled={subtotal === 0}>
                    Checkout Selected
                  </Button>
                </Link>

                <button
                  onClick={() => setCartItems([])}
                  className="w-full inline-flex items-center justify-center border rounded px-3 py-2"
                >
                  Clear Cart
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
