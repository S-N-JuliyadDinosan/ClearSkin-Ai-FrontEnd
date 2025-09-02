import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Loader from "./Loader";

const severityMap = {
  none: 0,
  mild: 1,
  moderate: 2,
  severe: 3,
};

const severityLabels = ["None", "Mild", "Moderate", "Severe"];

const UserDashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("No token found");

        const decoded = jwtDecode(token);
        const email = decoded?.email || decoded?.sub;

        // Fetch user details
        const userRes = await fetch(
          `http://localhost:8000/api/v1/user/email?email=${email}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userData = await userRes.json();
        const userId = userData?.userId;
        if (!userId) throw new Error("User not found");

        // Fetch analysis history
        const historyRes = await fetch(
          `http://localhost:8000/api/v1/user/analysis/history?userId=${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const historyData = await historyRes.json();

        // Transform for chart
        const transformed = (historyData || []).map((item) => ({
          date: new Date(item.analysisTime).toLocaleString(),
          severity: severityMap[item.severity?.toLowerCase()] ?? null,
        }));

        setChartData(transformed.reverse()); // oldest → newest
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">
        Acne Severity Progression
      </h2>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={550}>
  <LineChart
    data={chartData}
    margin={{ top: 20, right: 30, bottom: 80, left: 0 }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis
        dataKey="date"
        height={50}
        interval={0}
        tick={({ x, y, payload }) => {
            const [datePart, timePart] = payload.value.split(", ");
            return (
            <text x={x} y={y} textAnchor="end" fontSize={13} fill="#374151">
                <tspan x={x} dy="15">{datePart}</tspan>
                <tspan x={x} dy="15">{timePart}</tspan>
            </text>
            );
        }}
        />

    <YAxis
      domain={[0, 3]}
      ticks={[0, 1, 2, 3]}
      tickFormatter={(value) => severityLabels[value]}
      tick={{ fontSize: 12, fill: "#374151" }}
      width={80}
    />
    <Tooltip
      formatter={(value) => severityLabels[value]}
      labelFormatter={(label) => `Date: ${label}`}
      contentStyle={{ fontSize: 14 }}
    />
    <Line
      type="monotone"
      dataKey="severity"
      stroke="#2563eb"
      strokeWidth={3}
      dot={{ r: 6, fill: "#2563eb" }}
    />
  </LineChart>
</ResponsiveContainer>

      ) : (
        <p className="text-gray-500">No analysis history available.</p>
      )}
    </div>
  );
};

export default UserDashboardOverview;
