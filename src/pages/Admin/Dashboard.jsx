import React, { useState, useEffect } from "react";
import { Users } from "lucide-react"; // Only import what you need
import { getUserStatistics } from "../../api/admin/adminApi";

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        setLoading(true);
        const stats = await getUserStatistics();
        setUserCount(stats.total); // Using the total count from statistics
        setError(null);
      } catch (err) {
        console.error("Failed to fetch user count:", err);
        setError(err.message);
        setUserCount(0); // Reset count on error
      } finally {
        setLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <div className="flex gap-4"> {/* Changed gap-30 to gap-4 for better spacing */}
      {/* Other dashboard items... */}
      
      <div className="w-70 border rounded-lg border-2 h-30 p-4 flex flex-col items-center justify-center">
        <Users className="w-6 h-6 mb-2" /> {/* User icon */}
        <p className="text-sm font-medium text-gray-500">Active Users</p>
        {loading ? (
          <div className="animate-pulse h-6 w-8 bg-gray-200 rounded mt-1"></div>
        ) : error ? (
          <p className="text-red-500 text-xs">Error loading</p>
        ) : (
          <p className="text-2xl font-bold">{userCount}</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;