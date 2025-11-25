import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import {CartProvider}  from "./components/CartContext"; // ✅ Add this line
import CartDrawer from "./components/CartDrawer";
import CartPage from "./components/CartPage";
//import Orders from "./components/Orders";
// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import About from "./pages/About";
import Sustainability from "./pages/Sustainability";
import Feedback from "./pages/Feedback";
import Messages from "./pages/messages";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import NotFound from "./pages/NotFound";
import UserDashboard from "./pages/user-dashboard";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* ✅ Wrap the entire app inside CartProvider */}
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />

            {/* ✅ Keep CartDrawer always mounted */}
            <CartDrawer />

            <main className="flex-1">
              <Routes>
                {/* Public site routes */}
                <Route path="/" element={<Signup />} />
                <Route path="/home" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/product/:product_id" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/about" element={<About />} />
                <Route path="/sustainability" element={<Sustainability />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
                {/* <Route path="/orders" element={<Orders />} /> */}
                <Route path="/profile" element={<Profile />} />

                {/* Admin routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/dashboard" element={<Dashboard />} />

                {/* 404 Not Found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </CartProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
