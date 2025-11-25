
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message || "Welcome to your dashboard" ;

    // ✅ Automatically redirect to home after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home"); // your shop home route (adjust if needed)
    }, 4000);

    return () =>
       clearTimeout(timer); // cleanup timer
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-600">User Dashboard</h1>
        <p className="text-gray-700 text-lg">{message}</p>
      </div>
    </div>
  );
}
