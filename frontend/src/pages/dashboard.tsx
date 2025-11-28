// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

/**
 * Admin Dashboard
 * - Overview tiles
 * - Details pages: users, products, orders, feedbacks, carts (grouped), favorites (grouped)
 * - Shows user_id / product_id everywhere
 *
 * This single-file version is compact but complete and requires no backend changes.
 */

type User = { user_id?: number; id?: number; name?: string; email?: string };
type CartGroup = { user_id: number; user: { id: number; name: string; email?: string }; items: any[] };
type FavGroup = { user_id: number; user: { id: number; name: string; email?: string }; favorites: any[] };

const safeParse = (v: any, d: any = null) => {
  if (v == null) return d;
  if (typeof v === "object") return v;
  try {
    return JSON.parse(v);
  } catch {
    return d;
  }
};

const Currency = ({ v }: { v: number | string }) => `₹${Number(v || 0).toFixed(2)}`;

// small concurrency runner to avoid spamming backend
const runInBatches = async <T, R>(items: T[], batchSize: number, fn: (i: T) => Promise<R>) => {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    try {
      // run batch in parallel
      // eslint-disable-next-line no-await-in-loop
      const res = await Promise.all(batch.map(fn));
      out.push(...res);
    } catch (err) {
      console.warn("batch error", err);
      // continue; individual fn should handle its own errors
    }
  }
  return out;
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalFeedbacks: 0,
    totalCarts: 0,
    totalFavorites: 0,
  });

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [dataList, setDataList] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  useEffect(() => {
    // initial: load basic dashboard and users
    (async () => {
      try {
        const [dashRes, usersRes, productsRes, ordersRes, fbRes] = await Promise.allSettled([
          axios.get("/dashboard"),
          axios.get("/users"),
          axios.get("/products"),
          axios.get("/orders"),
          axios.get("/contact/messages"),
        ]);

        if (dashRes.status === "fulfilled") {
          setStats((s) => ({ ...s, ...dashRes.value.data }));
        }

        const usersArr =
          usersRes.status === "fulfilled" && Array.isArray(usersRes.value.data)
            ? usersRes.value.data
            : [];
        setUsers(usersArr);
        setStats((s) => ({ ...s, totalUsers: usersArr.length }));

        if (productsRes.status === "fulfilled" && Array.isArray(productsRes.value.data)) {
          setStats((s) => ({ ...s, totalProducts: productsRes.value.data.length }));
        }
        if (ordersRes.status === "fulfilled" && Array.isArray(ordersRes.value.data)) {
          setStats((s) => ({ ...s, totalOrders: ordersRes.value.data.length }));
        }
        if (fbRes.status === "fulfilled" && Array.isArray(fbRes.value.data)) {
          setStats((s) => ({ ...s, totalFeedbacks: fbRes.value.data.length }));
        }

        // lightweight prefetch counts for carts/favs (don't block UI)
        prefetchCounts(usersArr);
      } catch (err) {
        console.warn("initial load failed", err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // prefetch counts: fetch /cart/:user_id and /favorites/:user_id in batches, update stats & small cache
  const prefetchCounts = async (usersArr: User[]) => {
    if (!Array.isArray(usersArr) || usersArr.length === 0) return;
    setLoading(true);
    setProgress({ done: 0, total: usersArr.length * 2 });

    let done = 0;
    let cartsWithItems = 0;
    let totalFavs = 0;

    const fetchCartFor = async (u: User) => {
      try {
        const uid = Number(u.user_id ?? u.id);
        const res = await axios.get(`/cart/${uid}`);
        const arr = Array.isArray(res.data) ? res.data : [];
        if (arr.length > 0) cartsWithItems++;
      } catch {
        // ignore
      } finally {
        done++;
        setProgress({ done, total: usersArr.length * 2 });
      }
    };

    const fetchFavFor = async (u: User) => {
      try {
        const uid = Number(u.user_id ?? u.id);
        const res = await axios.get(`/favorites/${uid}`);
        const arr = Array.isArray(res.data) ? res.data : [];
        totalFavs += arr.length;
      } catch {
        // ignore
      } finally {
        done++;
        setProgress({ done, total: usersArr.length * 2 });
      }
    };

    await runInBatches(usersArr, 8, fetchCartFor);
    await runInBatches(usersArr, 8, fetchFavFor);

    setStats((s) => ({ ...s, totalCarts: cartsWithItems, totalFavorites: totalFavs }));
    setLoading(false);
    setProgress(null);
  };

  // normalize feedback records - backend may use snake_case
  const normalizeFeedbackArray = (arr: any[]) =>
    (arr || []).map((fb: any) => ({
      id: fb.id ?? fb.message_id ?? fb._id ?? Math.random(),
      firstName: fb.firstName ?? fb.first_name ?? (typeof fb.name === "string" ? fb.name.split(" ")[0] : ""),
      lastName:
        fb.lastName ??
        fb.last_name ??
        (typeof fb.name === "string" ? fb.name.split(" ").slice(1).join(" ") : ""),
      email: fb.email ?? fb.email_address ?? fb.user_email ?? "",
      subject: fb.subject ?? fb.title ?? "",
      message: fb.message ?? fb.body ?? fb.msg ?? "",
      date: fb.date ?? fb.created_at ?? fb.added_at ?? "",
      user_id: fb.user_id ?? fb.uid ?? fb.userId ?? null,
    }));

  // fetch carts grouped (one request per user)
  const fetchAllCartsViaUsers = async (usersList: User[], batchSize = 8): Promise<CartGroup[]> => {
    setLoading(true);
    setProgress({ done: 0, total: usersList.length });
    let done = 0;
    const fetchOne = async (u: User) => {
      const uid = Number(u.user_id ?? u.id);
      try {
        const res = await axios.get(`/cart/${uid}`);
        const items = Array.isArray(res.data)
          ? res.data.map((it: any) => ({
              product_id: it.product_id ?? it.id,
              quantity: Number(it.quantity ?? it.qty ?? 0),
              name: it.name ?? it.title ?? it.product_name,
              price: Number(it.price ?? it.unit_price ?? 0),
            }))
          : [];
        return { user_id: uid, user: { id: uid, name: u.name ?? `User#${uid}`, email: u.email }, items };
      } catch {
        return { user_id: uid, user: { id: uid, name: u.name ?? `User#${uid}`, email: u.email }, items: [] };
      } finally {
        done++;
        setProgress({ done, total: usersList.length });
      }
    };

    const grouped = await runInBatches(usersList, batchSize, fetchOne);
    // filter users with items
    const filtered = grouped.filter((g) => Array.isArray(g.items) && g.items.length > 0);
    setLoading(false);
    setProgress(null);
    setStats((s) => ({ ...s, totalCarts: filtered.length }));
    return filtered;
  };

  // fetch favorites grouped by user (one request per user)
  const fetchAllFavoritesGroupedByUser = async (usersList: User[], batchSize = 8): Promise<FavGroup[]> => {
    setLoading(true);
    setProgress({ done: 0, total: usersList.length });
    let done = 0;
    const fetchOne = async (u: User) => {
      const uid = Number(u.user_id ?? u.id);
      try {
        const res = await axios.get(`/favorites/${uid}`);
        const items = Array.isArray(res.data)
          ? res.data.map((p: any) => ({
              product_id: p.product_id ?? p.id,
              name: p.name ?? p.title,
              price: Number(p.price ?? 0),
              added_at: p.created_at ?? p.added_at ?? null,
            }))
          : [];
        return { user_id: uid, user: { id: uid, name: u.name ?? `User#${uid}`, email: u.email }, favorites: items };
      } catch {
        return { user_id: uid, user: { id: uid, name: u.name ?? `User#${uid}`, email: u.email }, favorites: [] };
      } finally {
        done++;
        setProgress({ done, total: usersList.length });
      }
    };

    const grouped = await runInBatches(usersList, batchSize, fetchOne);
    const filtered = grouped.filter((g) => Array.isArray(g.favorites) && g.favorites.length > 0);
    setLoading(false);
    setProgress(null);
    const totalFavs = filtered.reduce((acc, g) => acc + (g.favorites?.length ?? 0), 0);
    setStats((s) => ({ ...s, totalFavorites: totalFavs }));
    return filtered;
  };

  // main fetchDetails - supports carts & favorites (grouped) and other endpoints
  const fetchDetails = async (type: string) => {
    setActiveSection(type);
    if (type === "carts") {
      const usersArr = users.length ? users : (await axios.get("/users")).data || [];
      const grouped = await fetchAllCartsViaUsers(usersArr, 8);
      setDataList(grouped);
      return;
    }
    if (type === "favorites") {
      const usersArr = users.length ? users : (await axios.get("/users")).data || [];
      const grouped = await fetchAllFavoritesGroupedByUser(usersArr, 8);
      setDataList(grouped);
      return;
    }

    // map to correct endpoints
    const endpointMap: Record<string, string> = {
      users: "/users",
      products: "/products",
      orders: "/orders",
      feedbacks: "/contact/messages",
    };
    const endpoint = endpointMap[type] ?? `/${type}`;

    try {
      const res = await axios.get(endpoint);
      let arr = Array.isArray(res.data) ? res.data : res.data?.data ?? res.data?.rows ?? res.data?.items ?? [];
      if (type === "feedbacks") arr = normalizeFeedbackArray(arr);
      setDataList(arr);
    } catch (err) {
      console.error(`Error fetching ${type}`, err);
      setDataList([]);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Refresh counts and current view
  const refreshAll = async () => {
    // refresh counts for products/orders/feedbacks
    try {
      const [prod, ord, fb, usersRes] = await Promise.allSettled([
        axios.get("/products"),
        axios.get("/orders"),
        axios.get("/contact/messages"),
        axios.get("/users"),
      ]);

      const usersArr = usersRes.status === "fulfilled" && Array.isArray(usersRes.value.data) ? usersRes.value.data : users;

      setUsers(usersArr);
      setStats((s) => ({
        ...s,
        totalProducts: prod.status === "fulfilled" && Array.isArray(prod.value.data) ? prod.value.data.length : s.totalProducts,
        totalOrders: ord.status === "fulfilled" && Array.isArray(ord.value.data) ? ord.value.data.length : s.totalOrders,
        totalFeedbacks: fb.status === "fulfilled" && Array.isArray(fb.value.data) ? fb.value.data.length : s.totalFeedbacks,
      }));

      // refresh grouped view if open
      if (activeSection === "carts") {
        const grouped = await fetchAllCartsViaUsers(usersArr, 8);
        setDataList(grouped);
      } else if (activeSection === "favorites") {
        const grouped = await fetchAllFavoritesGroupedByUser(usersArr, 8);
        setDataList(grouped);
      } else if (activeSection) {
        // re-open same non-grouped section
        await fetchDetails(activeSection);
      }
    } catch (err) {
      console.warn("refresh failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-100 flex flex-col">
      <header className="sticky top-0 z-50 bg-pink-500 text-white shadow-md flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-extraextbold">🌿 EcoShop Admin</h1>
        <div className="flex items-center gap-3">
          <button onClick={refreshAll} className="bg-orange-400 text-white px-3 py-1 rounded shadow">Refresh All</button>
          <button onClick={handleLogout} className="bg-blue-500 text-white px-3 py-1 rounded shadow">Logout</button>
        </div>
      </header>

      <main className="p-6 flex-1">
        {!activeSection && (
          <>
            <h2 className="text-3xl font-bold text-green-700 mb-6">Overview</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div onClick={() => fetchDetails("users")} className="cursor-pointer p-6 bg-red-500 text-white rounded-2xl shadow text-center">
                <div className="text-3xl">👥</div>
                <div className="text-lg font-semibold">Users</div>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </div>

              <div onClick={() => fetchDetails("products")} className="cursor-pointer p-6 bg-blue-500 to-sky-600 text-white rounded-2xl shadow text-center">
                <div className="text-3xl">🛍️</div>
                <div className="text-lg font-semibold">Products</div>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
              </div>
              
              <div onClick={() => fetchDetails("favorites")} className="cursor-pointer p-6 bg-pink-400 to-purple-600 text-white rounded-2xl shadow text-center">
                <div className="text-3xl">💜</div>
                <div className="text-lg font-semibold">Favorites</div>
                <div className="text-2xl font-bold">{stats.totalFavorites}</div>
              </div>
              
              <div onClick={() => fetchDetails("carts")} className="cursor-pointer p-6 bg-green-500 text-white rounded-2xl shadow text-center">
                <div className="text-3xl">🛒</div>
                <div className="text-lg font-semibold">Carts (users)</div>
                <div className="text-2xl font-bold">{stats.totalCarts}</div>
              </div>
              
              <div onClick={() => fetchDetails("orders")} className="cursor-pointer p-6 bg-yellow-400 to-amber-600 text-white rounded-2xl shadow text-center">
                <div className="text-3xl">📦</div>
                <div className="text-lg font-semibold">Orders</div>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
              </div>

              <div onClick={() => fetchDetails("feedbacks")} className="cursor-pointer p-6 bg-purple-500 to-indigo-600 text-white rounded-2xl shadow text-center">
                <div className="text-3xl">💬</div>
                <div className="text-lg font-semibold">Feedback</div>
                <div className="text-2xl font-bold">{stats.totalFeedbacks}</div>
              </div>
            </div>
          </>
        )}

        {activeSection && (
          <div className="mt-6 bg-white rounded-lg p-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold capitalize">{activeSection} Details</h3>
              <div className="flex gap-2">
                <button onClick={refreshAll} className="btn btn-summary px-3 py-1 bg-red-500 text-white rounded">Refresh</button>
                <button onClick={() => { setActiveSection(null); setDataList([]); }} className="btn btn-success px-3 py-1 bg-green-500 text-white rounded">Close</button>
              </div>
            </div>

            {loading && <div className="text-sm text-gray-500 mb-4">Loading... {progress ? `(${progress.done}/${progress.total})` : ""}</div>}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Users */}
              {activeSection === "users" && dataList.map((u: any) => (
                <div key={u.user_id ?? u.id ?? u.email} className="border rounded-xl p-4 bg-gradient-to-b from-green-100 via-white to-green-200 shadow">
                  <div className="font-bold">{u.name ?? u.fullName ?? u.email}</div>
                  <div className="text-xm text-red-400">User ID: {u.user_id ?? u.id ?? "—"}</div>
                  <div className="text-sl text-green-700">Email : {u.email}</div>
                </div>
              ))}

              {/* Products */}
              {activeSection === "products" && dataList.map((p: any) => (
                <div key={p.product_id ?? p.id ?? p.name} className="border rounded-xl p-4 bg-gradient-to-b shadow">
                  <div className="font-bold">{p.name ?? p.title}</div>
                  <div className="text-xm text-gray-400">Product ID: {p.product_id ?? p.id ?? "—"}</div>
                  <div className="text-sl text-blue-600">Price : ₹{Number(p.price ?? 0).toFixed(2)}</div>
                  <div className="text-xm text-red-500 mt-1">Category : {p.category}</div>
                </div>
              ))}

              {/* Favorites (grouped) */}
              {activeSection === "favorites" && dataList.map((g: FavGroup) => (
                <div key={g.user_id} className="border rounded-xl p-4 bg-gradient-to-b from-green-100 via-white to-green-100 shadow">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="font-bold">{g.user?.name ?? `User #${g.user_id}`}</div>
                      <div className="text-xm text-dark-400">User ID: {g.user_id}</div>
                      <div className="text-sm text-green-500">Email : {g.user?.email}</div>
                    </div>
                    <div className="text-xm text-gray-600">Favorites: {g.favorites?.length ?? 0}</div>
                  </div>

                  <div className="mt-2 text-sm text-blue-700 space-y-2">
                    {g.favorites?.length ? g.favorites.map((f: any, i: number) => (
                      <div key={f.product_id ?? i} className="flex justify-between">
                        <div>
                          <div className="font-medium mt-5">{f.name ?? `#${f.product_id}`}</div>
                          <div className="text-xm text-red-400">Product ID: {f.product_id ?? "—"}</div>
                        </div>
                        <div className="flex gap-4 items-center">
                          <div>₹{Number(f.price ?? 0).toFixed(2)}</div>
                          <div className="text-xs text-black-400">{f.added_at ?? ""}</div>
                        </div>
                      </div>
                    )) : <div className="text-gray-500">No favorites</div>}
                  </div>
                </div>
              ))}

              {/* Carts (grouped) */}
              {activeSection === "carts" && dataList.map((g: CartGroup) => (
                <div key={g.user_id} className="border rounded-xl p-4 bg-gradient-to-b from-green-100 via-white to-green-100 shadow">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="font-bold">{g.user?.name ?? `User #${g.user_id}`}</div>
                      <div className="text-xm text-gray-600">User ID: {g.user_id}</div>
                      <div className="text-sl text-green-700">Email : {g.user?.email}</div>
                    </div>
                    <div className="text-sm text-gray-600">Items: {g.items?.length ?? 0}</div>
                  </div>

                  <div className="mt-2 text-sl text-red-700 space-y-2 mt-5">
                    {g.items?.length ? g.items.map((it: any, idx: number) => (
                      <div key={it.product_id ?? idx} className="flex justify-between">
                        <div>{it.name ?? `#${it.product_id}`}</div>
                        <div className="flex gap-4">
                          <div>Qty: {it.quantity ?? 0}</div>
                          <div>Price: ₹{Number(it.price ?? 0).toFixed(2)}</div>
                          <div>Subtotal: ₹{(Number(it.price ?? 0) * Number(it.quantity ?? 0)).toFixed(2)}</div>
                        </div>
                      </div>
                    )) : <div className="text-gray-500">No items</div>}
                  </div>
                </div>
              ))}
              
              {/* Orders */}
              {activeSection === "orders" && dataList.map((order: any) => {
                const billing = safeParse(order.billing_details ?? order.billingDetails ?? {}, {}) || {};
                const subtotal = Number(billing.subtotal ?? 0);
                const shipping = Number(billing.shipping ?? 0);
                const tax = Number(billing.tax ?? 0);
                const displayTotal = billing.total ?? billing.total_amount ?? Math.round((subtotal + shipping + tax) * 100) / 100;

                return (
                  <div key={order.order_id ?? order.id} className="border rounded-xl p-4 bg-gradient-to-b shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold">Order #{order.order_id ?? order.id}</div>
                        <div className="text-xs text-black-400">User ID: {order.user_id ?? order.uid ?? "—"}</div>
                        <div className="text-sm text-red-600">Customer: {order.customer_name ?? order.customer ?? "N/A"}</div>
                      </div>
                      <div className="text-sm text-violet-600">Total: <strong>{Currency({ v: displayTotal })}</strong></div>
                    </div>

                    <div className="mt-3 border-t pt-2 text-sl text-gray-700">
                      <div className="font-bold text-violet mb-1 text-violet">Products</div>
                      {Array.isArray(order.products) && order.products.length ? order.products.map((p: any, i: number) => (
                        <div key={p.product_id ?? p.id ?? i}>- {p.name ?? p.title ?? "Unknown"} × {p.quantity ?? p.qty ?? 1} (₹{Number(p.price ?? p.unit_price ?? 0).toFixed(2)})</div>
                      )) : <div className="text-orange-500">No products data</div>}
                    </div>
                  </div>
                );
              })}
              
              {/* Feedbacks */}
              {activeSection === "feedbacks" && dataList.map((fb: any) => (
                <div key={fb.id} className="border rounded-xl p-4 bg-gradient-to-b shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700">
                      {String(fb.firstName || "").charAt(0) || "?"}
                    </div>
                    <div>
                      <div className="font-bold">{(fb.firstName || "") + (fb.lastName ? " " + fb.lastName : "")}</div>
                      <div className="text-xm text-gray-700">User ID: {fb.user_id ?? "—"}</div>
                      <div className="text-sl text-green-500">Email : {fb.email}</div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <div className="font-medium">Subject: {fb.subject}</div>
                    <div className="italic border-l-4 border-green-200 pl-3 mt-1 text-red-700 mt-3">{fb.message}</div>
                    <div className="text-xs text-black-500 mt-2">{fb.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
