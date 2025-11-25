// src/pages/Profile.tsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Orders from "@/pages/Orders";
import Wishlist from "@/pages/Wishlist";
import { useCart } from "@/components/CartContext";

type Item = { product_id?: string | number; name?: string; price?: number; quantity?: number; line_total?: number; image?: string | null };
type Order = { order_id: string | number; created_at?: string | null; total?: number | null; status?: string; username?: string | null; items: Item[]; raw?: any };

const formatCurrency = (n?: number | null) => (n == null ? "₹0.00" : `₹${Number(n).toFixed(2)}`);

export default function Profile(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const ordersRef = useRef<HTMLDivElement | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("");

  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "favorites">("profile");

  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    const id = sessionStorage.getItem("user_id");
    const name = sessionStorage.getItem("username") ?? "";
    setUserId(id);
    setUsername(name);

    setFullName(sessionStorage.getItem("full_name") ?? name ?? "");
    setGender((sessionStorage.getItem("gender") as any) ?? "");
    setEmail(sessionStorage.getItem("email") ?? sessionStorage.getItem("user_email") ?? "");
    setMobile(sessionStorage.getItem("mobile") ?? sessionStorage.getItem("user_mobile") ?? "");
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && ["profile", "orders", "favorites"].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [location.search]);

  // ✅ FIXED LOGOUT
  const logout = () => {
  sessionStorage.clear(); 
  window.dispatchEvent(new Event("userChanged"));
  navigate("/login");
};


  const saveProfile = () => {
    sessionStorage.setItem("full_name", fullName);
    sessionStorage.setItem("gender", gender);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("mobile", mobile);
    alert("Profile saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-4 lg:col-span-1">
            <div className="flex flex-col gap-2">
              <div
                role="button"
                onClick={() => setActiveTab("profile")}
                className={`px-4 py-3 rounded-md cursor-pointer text-left ${
                  activeTab === "profile" ? "bg-primary/10 font-semibold" : "hover:bg-gray-100"
                }`}
              >
                My Profile
              </div>

              <div
                role="button"
                onClick={() => setActiveTab("orders")}
                className={`px-4 py-3 rounded-md cursor-pointer text-left ${
                  activeTab === "orders" ? "bg-primary/10 font-semibold" : "hover:bg-gray-100"
                }`}
              >
                My Orders
              </div>

              <div
                role="button"
                onClick={() => setActiveTab("favorites")}
                className={`px-4 py-3 rounded-md cursor-pointer text-left ${
                  activeTab === "favorites" ? "bg-primary/10 font-semibold" : "hover:bg-gray-100"
                }`}
              >
                Favorites
              </div>

              <div className="mt-4">
                {userId ? (
                  <Button variant="ghost" onClick={logout} className="text-red-600 w-full">
                    Logout
                  </Button>
                ) : (
                  <Button onClick={() => navigate("/login")} className="w-full">
                    Login / Signup
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Right section */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "profile" && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="p-3 rounded border border-gray-200 bg-white"
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />

                  <div className="flex items-center gap-4">
                    {["male", "female", "other"].map((g) => (
                      <label key={g} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={gender === g}
                          onChange={() => setGender(g as any)}
                        />
                        <span className="text-sm capitalize">{g}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="p-3 rounded border border-gray-200 bg-white"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    className="p-3 rounded border border-gray-200 bg-white"
                    placeholder="Mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Cancel
                  </Button>
                  <Button onClick={saveProfile}>Save</Button>
                </div>
              </Card>
            )}

            {activeTab === "orders" && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
                <Orders />
              </Card>
            )}

            {activeTab === "favorites" && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Your Favorites</h2>
                <Wishlist />
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
