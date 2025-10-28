import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalFeedbacks: 0,
  });

  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [showFeedbacks, setShowFeedbacks] = useState(false);

  // Load dashboard stats
  useEffect(() => {
    axios
      .get("/dashboard")
      .then((res) => setStats((prev) => ({ ...prev, ...res.data })))
      .catch((err) => console.error("Error loading dashboard:", err));

    // Fetch feedback count
    axios
      .get("/contact/messages")
      .then((res) =>
        setStats((prev) => ({ ...prev, totalFeedbacks: res.data.length }))
      )
      .catch((err) => console.error("Error fetching feedback count:", err));
  }, []);

  // Fetch detailed feedbacks when clicking card
  const fetchFeedbackDetails = async () => {
    try {
      const res = await axios.get("/contact/messages");
      setFeedbacks(res.data);
      setShowFeedbacks(true);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-green-700 mb-10">
        Admin Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 w-11/12 md:w-3/4">
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center border-t-4 border-green-600">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Total Users
          </h2>
          <p className="text-3xl font-bold text-green-600">
            {stats.totalUsers}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 text-center border-t-4 border-blue-600">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Total Products
          </h2>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalProducts}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 text-center border-t-4 border-yellow-600">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Total Orders
          </h2>
          <p className="text-3xl font-bold text-yellow-600">
            {stats.totalOrders}
          </p>
        </div>

        {/* ✅ New Feedback Card */}
        <div
          className="bg-white shadow-lg rounded-2xl p-6 text-center border-t-4 border-purple-600 cursor-pointer hover:bg-purple-50 transition"
          onClick={fetchFeedbackDetails}
        >
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Total Feedback
          </h2>
          <p className="text-3xl font-bold text-purple-600">
            {stats.totalFeedbacks}
          </p>
        </div>
      </div>

      {/* Feedback Section */}
      {showFeedbacks && (
        <div className="bg-white mt-10 p-6 rounded-2xl shadow-lg w-11/12 md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              User Feedback Details
            </h2>
            <button
              className="text-red-500 font-semibold hover:text-red-700"
              onClick={() => setShowFeedbacks(false)}
            >
              ✖ Close
            </button>
          </div>

          {feedbacks.length === 0 ? (
            <p className="text-gray-500">No feedback received yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-lg">
                    {fb.firstName} {fb.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{fb.email}</p>
                  <p className="mt-2 font-medium text-gray-700">
                    Subject: {fb.subject}
                  </p>
                  <p className="text-gray-600 mt-1">{fb.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{fb.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
