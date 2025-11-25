// src/pages/Login.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/login", { email, password });
      const data = response.data;

      if (data.success) {
        const user = data.user;

        // 🧠 Save user data in sessionStorage
        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("user_id", user.user_id);
        sessionStorage.setItem("user_email", user.email);
        sessionStorage.setItem("username", user.name);
        sessionStorage.setItem("is_admin", user.is_admin);

        // Refresh cart (optional event trigger)
        window.dispatchEvent(new Event("userChanged"));

        toast.success(`Welcome ${user.name}!`, { duration: 1500 });

        // ✅ Redirect based on role
        setTimeout(() => {
          if (user.is_admin === 0) {
            navigate("/dashboard");
          } else {
            navigate("/home");
          }
        }, 1200);
      } else {
        toast.error("Invalid email or password!");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Toaster />
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-green-700 mb-6">
          Login
        </h2>

        <form onSubmit={handleLogin} autoComplete="off">
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>

          <button
            type="submit" 
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Submit
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-green-600 hover:underline">
            Signup here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
