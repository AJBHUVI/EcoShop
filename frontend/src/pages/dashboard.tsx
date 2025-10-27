import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:5002/api/users/dashboard")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error loading dashboard:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-green-700 mb-10">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-11/12 md:w-3/4">
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center border-t-4 border-green-600">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Total Users</h2>
          <p className="text-3xl font-bold text-green-600">{stats.totalUsers}</p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 text-center border-t-4 border-blue-600">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Total Products</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 text-center border-t-4 border-yellow-600">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Total Orders</h2>
          <p className="text-3xl font-bold text-yellow-600">{stats.totalOrders}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
