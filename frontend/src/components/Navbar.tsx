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

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Sustainability", path: "/sustainability" },
    { name: "Feedback", path: "/feedback" },
  ];

  const isActive = (p: string) => location.pathname === p;

  useEffect(() => {
    // close mobile menu when route changes
    const unlisten = () => setMobileOpen(false);
    window.addEventListener("popstate", unlisten);
    return () => window.removeEventListener("popstate", unlisten);
  }, []);

  const logout = () => {
    sessionStorage.clear();
    window.dispatchEvent(new Event("userChanged"));
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-green-600">
          EcoShop
        </Link>

        {/* Desktop nav */}
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

        {/* Right-side icons */}
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
          <Link to="/profile?tab=favorites" className="hidden sm:inline-flex">
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

          {/* Profile icon → direct link (no dropdown) */}
          <Link to="/profile" className="p-2 rounded hover:bg-gray-100 hidden md:inline-flex">
            <User className="h-5 w-5" />
          </Link>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((s) => !s)}
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 space-y-3">
            {navLinks.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`block text-sm font-medium py-2 px-2 rounded ${
                  isActive(l.path) ? "text-green-600 bg-slate-50" : "text-gray-700"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {l.name}
              </Link>
            ))}

            {/* If you want to keep a profile link in mobile menu, leave only this single link.
                The three separate account links were removed to avoid clutter. */}
            <Link
              to="/profile"
              className="block text-sm font-medium py-2 px-2 rounded text-gray-700"
              onClick={() => setMobileOpen(false)}
            >
              My Account
            </Link>

            {/* Optional: quick cart/wishlist actions */}
            <div className="pt-2 border-t">
              <Link
                to="/cart"
                className="block text-sm font-medium py-2 px-2 rounded text-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                View Cart
              </Link>
              <Link
                to="/profile?tab=favorites"
                className="block text-sm font-medium py-2 px-2 rounded text-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                Wishlist
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
