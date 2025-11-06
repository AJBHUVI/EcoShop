// src/components/Navbar.tsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, Search, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/CartContext";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();
  const cartCount = cart.reduce((t, i) => t + (i.quantity || 0), 0);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Sustainability", path: "/sustainability" },
    { name: "Feedback", path: "/feedback" },
  ];

  const isActive = (p: string) => location.pathname === p;

  useEffect(() => {
    const close = () => setProfileOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const logout = () => {
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("username");
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-green-600">EcoShop</Link>

        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={`text-sm font-medium ${isActive(l.path) ? "text-green-600" : "text-gray-700"} hover:text-green-600`}
            >
              {l.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>

          <Link to="/wishlist">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>

          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Profile: only icon, no text */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setProfileOpen((v) => !v);
              }}
              aria-haspopup="true"
              aria-expanded={profileOpen}
              className="p-2 rounded hover:bg-gray-100"
              title="Account"
            >
              <User className="h-5 w-5" />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-50 text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-50"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/profile", { state: { openOrders: true } });
                  }}
                >
                  My Orders
                </button>

                <div className="border-t" />

                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                  onClick={() => { setProfileOpen(false); logout(); }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen((s) => !s)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`block text-sm font-medium ${isActive(l.path) ? "text-green-600" : "text-gray-700"}`}
                onClick={() => setMobileOpen(false)}
              >
                {l.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
