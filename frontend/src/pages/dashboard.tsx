import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:5002/api/admin";

interface DashboardStats {
  users: number;
  products: number;
  orders: number;
  categories: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        const res = await axios.get(`${BASE_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage(res.data.message);
        setStats(res.data.stats);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err.response?.data || err);
        setError(err.response?.data?.error || "Server error");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUsername");
        navigate("/admin/login");
      }
    };

    fetchDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");
    navigate("/admin/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}

      {stats && (
        <div className="mt-4 grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-gray-100 rounded">Users: {stats.users}</div>
          <div className="p-4 bg-gray-100 rounded">Products: {stats.products}</div>
          <div className="p-4 bg-gray-100 rounded">Orders: {stats.orders}</div>
          <div className="p-4 bg-gray-100 rounded">Categories: {stats.categories}</div>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="mt-6 p-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
