// src/components/Navbar.tsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, Search, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/CartContext";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart(); // ✅ NO clearCart here
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

  // ✅ FIXED LOGOUT — DOES NOT CLEAR CART IN DB
  const logout = () => {
    sessionStorage.clear();
    window.dispatchEvent(new Event("userChanged"));
    navigate("/login");
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
              className={`text-sm font-medium ${
                isActive(l.path) ? "text-green-600" : "text-gray-700"
              } hover:text-green-600`}
            >
              {l.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={() => navigate("/shop")}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Wishlist */}
          <Link to="/profile?tab=favorites">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setProfileOpen((v) => !v);
              }}
              className="p-2 rounded hover:bg-gray-100"
            >
              <User className="h-5 w-5" />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50 text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <Link
                  to="/profile?tab=profile"
                  className="block px-4 py-2 hover:bg-gray-50"
                >
                  My Profile
                </Link>
                <Link
                  to="/profile?tab=orders"
                  className="block px-4 py-2 hover:bg-gray-50"
                >
                  My Orders
                </Link>
                <Link
                  to="/profile?tab=favorites"
                  className="block px-4 py-2 hover:bg-gray-50"
                >
                  My Wishlist
                </Link>

                <div className="border-t" />

                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((s) => !s)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`block text-sm font-medium ${
                  isActive(l.path) ? "text-green-600" : "text-gray-700"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {l.name}
              </Link>
            ))}

            <Link to="/profile?tab=profile" onClick={() => setMobileOpen(false)}>
              My Profile
            </Link>
            <Link to="/profile?tab=orders" onClick={() => setMobileOpen(false)}>
              My Orders
            </Link>
            <Link to="/profile?tab=favorites" onClick={() => setMobileOpen(false)}>
              My Wishlist
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
