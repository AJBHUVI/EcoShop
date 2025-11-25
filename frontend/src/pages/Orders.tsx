import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Item = {
  product_id?: string | number;
  name?: string;
  price?: number;
  quantity?: number;
  line_total?: number;
  image?: string | null;
};

type BillingDetails = {
  subtotal?: number;
  shipping?: number;
  tax?: number;
  total?: number;
};

type Order = {
  order_id: string | number;
  created_at?: string | null;
  total?: number | null;
  status?: string;
  username?: string | null;
  items: Item[];
  raw?: any;
  billing_details?: BillingDetails | null;
};

const formatCurrency = (n?: number | null) =>
  n == null ? "₹0.00" : `₹${Number(n).toFixed(2)}`;

const safeParseJSON = (s: any) => {
  if (!s) return [];
  if (Array.isArray(s)) return s;
  if (typeof s === "string") {
    try {
      return JSON.parse(s);
    } catch {
      return [];
    }
  }
  if (typeof s === "object") return s;
  return [];
};

export default function Orders(): JSX.Element {
  const [userId, setUserId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => {
    setUserId(sessionStorage.getItem("user_id"));
  }, []);

  useEffect(() => {
    if (!userId) {
      setOrders([]);
      return;
    }

    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const resp = await fetch(`/orders?user_id=${encodeURIComponent(userId)}`);
        const data = await resp.json();
        const arr = Array.isArray(data) ? data : data?.orders ?? [];

        const normalized: Order[] = (arr || [])
          .map((o: any) => {
            const order_id = o.order_id ?? o.id ?? o.orderId ?? "-";
            const created_at = o.created_at ?? o.createdAt ?? o.date ?? o.order_date ?? null;
            // billing_details may be JSON string or object
            let billing: BillingDetails | null = null;
            if (o.billing_details) {
              if (typeof o.billing_details === "string") {
                try {
                  billing = JSON.parse(o.billing_details);
                } catch {
                  billing = null;
                }
              } else if (typeof o.billing_details === "object") {
                billing = o.billing_details;
              }
            } else {
              // fallback to old columns if backend hasn't migrated yet
              const subtotal = Number(o.subtotal ?? o.sub_total ?? o.amount ?? 0) || 0;
              const shipping = Number(o.shipping ?? 0) || 0;
              const tax = Number(o.tax ?? 0) || 0;
              const total = Number(o.total ?? o.total_amount ?? o.amount ?? subtotal + shipping + tax) || 0;
              billing = { subtotal, shipping, tax, total };
            }

            const total = Number(billing?.total ?? o.total ?? o.amount ?? null) || null;
            const status = o.status ?? o.order_status ?? "submitted";
            const uname = o.username ?? o.customer_name ?? o.name ?? o.customer_name ?? null;

            let itemsRaw: any[] = [];
            if (Array.isArray(o.items)) itemsRaw = o.items;
            else if (Array.isArray(o.order_items)) itemsRaw = o.order_items;
            else if (Array.isArray(o.products)) itemsRaw = o.products;
            else if (typeof o.items === "string") itemsRaw = safeParseJSON(o.items);
            else if (typeof o.products === "string") itemsRaw = safeParseJSON(o.products);

            const items: Item[] = (itemsRaw || []).map((it: any) => ({
              product_id: it.product_id ?? it.productId ?? it.id ?? it.sku,
              name: it.name ?? it.title ?? it.product_name ?? `Product ${it.product_id ?? "?"}`,
              price: Number(it.price ?? it.unit_price ?? 0) || 0,
              quantity: Number(it.quantity ?? it.qty ?? 1) || 1,
              line_total:
                Number(
                  it.line_total ?? it.total ?? (Number(it.price ?? 0) * Number(it.quantity ?? 1))
                ) || 0,
              image: it.image ?? it.product_image ?? null,
            }));

            return {
              order_id,
              created_at,
              total,
              status,
              username: uname,
              items,
              raw: o,
              billing_details: billing,
            };
          })
          .filter((o) => {
            const raw = o.raw ?? {};
            const owner = raw.user_id ?? raw.userId ?? raw.customer_id ?? raw.customerId;
            if (owner != null) return String(owner) === String(userId);
            return true;
          });

        if (!mounted) return;
        normalized.sort((a, b) => {
          if (!a.created_at || !b.created_at) return 0;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        setOrders(normalized);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setOrders([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  const downloadOrderCSV = (o: Order) => {
    const billing = o.billing_details ?? { subtotal: "", shipping: "", tax: "", total: "" };
    const rows: string[][] = [
      ["Order Date", "Customer", "Status", "Subtotal", "Shipping", "Tax", "Total"],
      [
        String(o.created_at ?? ""),
        String(o.username ?? ""),
        String(o.status ?? ""),
        String(billing.subtotal ?? ""),
        String(billing.shipping ?? ""),
        String(billing.tax ?? ""),
        String(billing.total ?? ""),
      ],
      [],
      ["Name", "Unit Price", "Qty", "Line Total"],
      ...o.items.map((it) => [
        String(it.name ?? ""),
        String(it.price ?? ""),
        String(it.quantity ?? ""),
        String(it.line_total ?? ""),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `order-${o.order_id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusClass = (s?: string) =>
    s?.toLowerCase().includes("cancel")
      ? "bg-red-100 text-red-700"
      : s?.toLowerCase().includes("ship")
      ? "bg-blue-100 text-blue-700"
      : "bg-green-100 text-green-700";

  // New helper: compute billing total when missing
  const billingTotal = (b?: BillingDetails | null, fallbackTotal?: number | null) => {
    if (!b) return fallbackTotal ?? 0;
    if (b.total != null && !Number.isNaN(Number(b.total))) return Number(b.total);
    const subtotal = Number(b.subtotal ?? 0);
    const shipping = Number(b.shipping ?? 0);
    const tax = Number(b.tax ?? 0);
    const t = Number((subtotal + shipping + tax).toFixed(2));
    return t || (fallbackTotal ?? 0);
  };

  return (
    <div className="p-4">
      {loading ? (
        <div className="text-sm text-gray-500">Loading orders…</div>
      ) : orders.length === 0 ? (
        <div className="text-sm text-gray-500">No orders found.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={String(o.order_id)}
              className="flex flex-col md:flex-row items-start md:items-center justify-between border rounded p-4 bg-white"
            >
              <div className="flex-1 w-full md:w-auto">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <div className="text-base font-semibold">Order #{o.order_id}</div>
                  <div className="text-xs text-gray-500">
                    • {o.created_at ? new Date(o.created_at).toLocaleString() : "Date unknown"}
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-semibold ${statusClass(o.status)}`}>
                    {o.status}
                  </div>
                </div>

                <div className="text-sm text-gray-700 mt-2">
                  <strong>User:</strong> {o.username ?? ""} • <strong>Items:</strong> {o.items.length}
                </div>
              </div>

              <div className="flex flex-col md:items-end w-full md:w-auto mt-3 md:mt-0">
                <div className="font-bold text-lg">
                  { o.billing_details || o.total != null
                    ? formatCurrency(billingTotal(o.billing_details, o.total))
                    : "-" }
                </div>
                <div className="flex gap-2 justify-start md:justify-end mt-2 md:mt-3 flex-wrap">
                  <Button size="sm" onClick={() => setSelected(o)}>View details</Button>
                  <Button size="sm" variant="outline" onClick={() => downloadOrderCSV(o)}>CSV</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative max-w-2xl w-full bg-white rounded-xl shadow-2xl p-6 z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <div className="text-lg font-semibold">Order #{selected.order_id}</div>
                <div className="text-sm text-gray-500">{selected.created_at ? new Date(selected.created_at).toLocaleString() : "Date unknown"}</div>
                <div className="text-sm text-gray-700 mt-2">Customer: {selected.username ?? ""}</div>
              </div>
              <div className="text-right mt-2 md:mt-0">
                <div className="font-bold">
                  {formatCurrency(billingTotal(selected.billing_details, selected.total))}
                </div>
                <div className="text-sm text-gray-500">{selected.status}</div>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <h4 className="font-semibold mb-3">Items</h4>
              <div className="space-y-3 min-w-[400px]">
                {selected.items.map((it, i) => (
                  <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border rounded p-3 bg-gray-50">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {it.image ? (
                        <img src={it.image} alt={it.name} className="w-16 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No image</div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium">{it.name ?? `Product ${it.product_id ?? "-"}`}</div>
                        <div className="text-sm text-gray-500">Product ID: {it.product_id ?? "-"}</div>
                        <div className="text-sm text-gray-700">Qty: {it.quantity ?? 1}</div>
                      </div>
                    </div>
                    <div className="text-right mt-2 sm:mt-0">
                      <div className="font-medium">{formatCurrency(it.price ?? 0)}</div>
                      <div className="text-sm text-gray-500">
                        Line: {formatCurrency(it.line_total ?? ((it.price ?? 0) * (it.quantity ?? 1)))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Billing summary */}
              <div className="mt-4 text-right">
                <div className="text-sm text-gray-600">Subtotal: {formatCurrency(selected.billing_details?.subtotal ?? 0)}</div>
                <div className="text-sm text-gray-600">Shipping: {formatCurrency(selected.billing_details?.shipping ?? 0)}</div>
                <div className="text-sm text-gray-600">Tax: {formatCurrency(selected.billing_details?.tax ?? 0)}</div>
                <div className="font-semibold text-lg mt-1">Total: {formatCurrency(billingTotal(selected.billing_details, selected.total))}</div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
