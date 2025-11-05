import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalFeedbacks: 0,
  });

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [dataList, setDataList] = useState<any[]>([]);

  // ✅ Load dashboard stats
  useEffect(() => {
    axios
      .get("/dashboard")
      .then((res) => setStats((prev) => ({ ...prev, ...res.data })))
      .catch((err) => console.error("Error loading dashboard:", err));

    axios
      .get("/contact/messages")
      .then((res) =>
        setStats((prev) => ({ ...prev, totalFeedbacks: res.data.length }))
      )
      .catch((err) => console.error("Error fetching feedback count:", err));
  }, []);

  // ✅ Fetch data for details section
  const fetchDetails = async (type: string) => {
    try {
      let endpoint = "";
      if (type === "users") endpoint = "/users";
      else if (type === "products") endpoint = "/products";
      else if (type === "orders") endpoint = "/orders";
      else if (type === "feedbacks") endpoint = "/contact/messages";

      const res = await axios.get(endpoint);
      setDataList(res.data);
      setActiveSection(type);
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
    }
  };

  // ✅ Logout (simple redirect for now)
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col">
      {/* ✅ Sticky Navbar */}
      <header className="sticky top-0 z-50 bg-green-700 text-white shadow-md flex justify-between items-center px-8 py-4">
        <h1 className="text-2xl font-extrabold tracking-wide">
          🌿 EcoShop Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-white text-green-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-green-100 transition"
        >
          Logout
        </button>
      </header>

      {/* ✅ Main Content */}
      <main className="flex flex-col items-center py-10">
        {!activeSection && (
          <>
            <h2 className="text-3xl font-extrabold text-green-700 mb-10 tracking-tight">
              Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-11/12 md:w-4/5">
              {[
                {
                  title: "Total Users",
                  count: stats.totalUsers,
                  color: "from-green-500 to-emerald-600",
                  icon: "👥",
                  type: "users",
                },
                {
                  title: "Total Products",
                  count: stats.totalProducts,
                  color: "from-blue-500 to-sky-600",
                  icon: "🛍️",
                  type: "products",
                },
                {
                  title: "Total Orders",
                  count: stats.totalOrders,
                  color: "from-yellow-500 to-amber-600",
                  icon: "📦",
                  type: "orders",
                },
                {
                  title: "Total Feedback",
                  count: stats.totalFeedbacks,
                  color: "from-purple-500 to-indigo-600",
                  icon: "💬",
                  type: "feedbacks",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  onClick={() => fetchDetails(item.type)}
                  className={`cursor-pointer bg-gradient-to-b ${item.color} text-white shadow-lg hover:shadow-2xl rounded-2xl p-6 text-center transition transform hover:-translate-y-1 hover:scale-105`}
                >
                  <div className="text-5xl mb-3">{item.icon}</div>
                  <h2 className="text-xl font-semibold mb-1 drop-shadow-sm">
                    {item.title}
                  </h2>
                  <p className="text-4xl font-bold">{item.count}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ✅ Detailed Section */}
        {activeSection && (
          <div className="bg-white mt-10 p-8 rounded-3xl shadow-2xl w-11/12 md:w-4/5 transition-all duration-300">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-2xl font-extrabold text-gray-800 capitalize">
                📋 {activeSection} Details
              </h2>
              <button
                className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-lg font-semibold transition"
                onClick={() => setActiveSection(null)}
              >
                ✖ Close
              </button>
            </div>

            {dataList.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                No {activeSection} found.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeSection === "feedbacks" ? (
                  dataList.map((fb) => (
                    <div
                      key={fb.id}
                      className="border border-gray-200 rounded-2xl p-5 bg-gradient-to-b from-gray-50 to-white shadow-md hover:shadow-lg hover:border-green-400 transition"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-green-100 text-green-700 font-bold rounded-full w-10 h-10 flex items-center justify-center">
                          {fb.firstName?.[0] || "?"}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {fb.firstName} {fb.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">{fb.email}</p>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-700 font-medium">
                        Subject: {fb.subject}
                      </p>
                      <p className="text-gray-600 mt-1 italic border-l-4 border-green-300 pl-3">
                        {fb.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-3">{fb.date}</p>
                    </div>
                  ))
                ) : (
                  dataList.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-2xl p-5 bg-gradient-to-b from-gray-50 to-white shadow-md hover:shadow-lg hover:border-green-400 transition"
                    >
                      {activeSection === "users" && (
                        <>
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-gray-500">{item.email}</p>
                        </>
                      )}
                      {activeSection === "products" && (
                        <>
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-gray-500">₹{item.price}</p>
                          <p className="text-sm text-gray-600">
                            {item.category}
                          </p>
                        </>
                      )}
                      {activeSection === "orders" && (
                        <>
                          <h3 className="font-semibold text-lg">
                            Order #{item.id}
                          </h3>
                          <p className="text-gray-600">
                            User: {item.user_name}
                          </p>
                          <p className="text-gray-500">
                            Total: ₹{item.total_amount}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {item.date}
                          </p>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
