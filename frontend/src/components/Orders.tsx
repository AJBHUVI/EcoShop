// src/pages/Orders.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

interface ProductItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  order_id: number;
  user_id?: number;
  products: ProductItem[] | string;
  total_amount: number;
  status: string;
  order_date: string;
  payment_method?: string | null;
  payment_details?: any;
  shipping_address?: string | null;
  customer_name?: string | null;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const user_id = sessionStorage.getItem("user_id");
      if (!user_id) {
        setOrders([]);
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`/orders/${user_id}`);
        // Ensure products are parsed to arrays
        const normalized = Array.isArray(res.data)
          ? res.data.map((o: any) => {
              const copy: Order = { ...o };
              if (typeof copy.products === "string") {
                try {
                  copy.products = JSON.parse(copy.products);
                } catch {
                  // fallback: leave as string or wrap
                  copy.products = [];
                }
              }
              // Normalize payment_details if JSON string
              if (copy.payment_details && typeof copy.payment_details === "string") {
                try {
                  copy.payment_details = JSON.parse(copy.payment_details);
                } catch {}
              }
              return copy;
            })
          : [];
        setOrders(normalized);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const maskCard = (paymentDetails: any) => {
    if (!paymentDetails) return null;
    // if backend sent last4 or masked string, show it
    if (paymentDetails.cardLast4) return `Card •••• ${paymentDetails.cardLast4}`;
    if (paymentDetails.cardNumber && typeof paymentDetails.cardNumber === "string") {
      // cardNumber might be masked already like "**** **** **** 1234"
      const s = paymentDetails.cardNumber;
      const last = s.slice(-4);
      return `Card •••• ${last}`;
    }
    if (paymentDetails.note) return paymentDetails.note;
    return null;
  };

  if (loading) return <p className="p-4">Loading your orders…</p>;
  if (orders.length === 0) return <p className="p-4">No orders yet.</p>;

  return (
    <div className="p-4 container mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {orders.map((order) => (
        <div key={order.order_id} className="border p-4 mb-4 rounded shadow-sm bg-white">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Order #{order.order_id}</span>
            <span className="text-sm text-gray-600">{new Date(order.order_date).toLocaleString()}</span>
          </div>

          {/* Products */}
          <div className="space-y-2 mb-3">
            {(order.products as ProductItem[]).length === 0 ? (
              <div className="text-sm text-gray-500">No items</div>
            ) : (
              (order.products as ProductItem[]).map((item) => (
                <div key={item.product_id} className="flex justify-between">
                  <div>
                    <div className="font-medium">{item.name} <span className="text-sm text-gray-500">x{item.quantity}</span></div>
                    <div className="text-xs text-gray-500">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                  <div className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-between font-semibold mt-2">
            <span>Total:</span>
            <span>${Number(order.total_amount).toFixed(2)}</span>
          </div>

          <div className="mt-2 text-sm text-gray-600">Status: <span className="font-medium text-sm text-gray-800">{order.status}</span></div>

          {/* Payment method */}
          <div className="mt-3 text-sm">
            <div className="text-gray-600">Payment method: <span className="font-medium text-gray-800">{order.payment_method ?? "unknown"}</span></div>
            {order.payment_details && (
              <div className="text-gray-600 mt-1">
                {maskCard(order.payment_details) ? (
                  <><span className="font-medium">{maskCard(order.payment_details)}</span></>
                ) : (
                  <span className="text-gray-500">Details saved</span>
                )}
              </div>
            )}
          </div>

          {/* Shipping info */}
          {order.shipping_address && (
            <div className="mt-3 text-sm text-gray-600">
              <div>Ship to: <span className="font-medium text-gray-800">{order.customer_name || "N/A"}</span></div>
              <div className="text-gray-600">{order.shipping_address}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
