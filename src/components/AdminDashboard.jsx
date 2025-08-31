import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRedirectWithLoader } from "./useRedirectWithLoader"; // custom hook
import Loader from "./Loader"; // animated loader
import { Chart, registerables } from "chart.js";
import "chart.js/auto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUsers,
  faChartBar,
  faShoppingCart,
  faBox,
  faCog,
  faSearch,
  faBell,
  faDollarSign,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import "../App.css";
import { Outlet, useLocation } from "react-router-dom";

Chart.register(...registerables);

const AdminDashboard = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { redirect, loading: redirectLoading } = useRedirectWithLoader();

  const [activeSection, setActiveSection] = useState("dashboard");

  // Update activeSection based on current route
  useEffect(() => {
    if (location.pathname.includes("/products")) {
      setActiveSection("products");
    } else if (location.pathname.includes("/users")) {
      setActiveSection("users");
    } else if (location.pathname.includes("/analytics")) {
      setActiveSection("analytics");
    } else if (location.pathname.includes("/orders")) {
      setActiveSection("orders");
    } else if (location.pathname.includes("/settings")) {
      setActiveSection("settings");
    } else {
      setActiveSection("dashboard");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (activeSection !== "dashboard") return; // Only load chart on dashboard

    const ctx = chartRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Revenue",
            data: [25000, 32000, 28000, 35000, 42000, 48000],
            borderColor: "#374151",
            backgroundColor: "rgba(55, 65, 81, 0.2)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#374151",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#9ca3af" } },
          y: {
            beginAtZero: true,
            grid: { color: "#e5e7eb" },
            ticks: {
              color: "#9ca3af",
              callback: (value) => "$" + value.toLocaleString(),
            },
          },
        },
        elements: { point: { hoverRadius: 8 } },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [activeSection]);

  return (
    <div className="bg-gray-100 min-h-screen flex relative">
      {/* Loader */}
      {redirectLoading && <Loader />}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 shadow-xl z-50 ${
          redirectLoading ? "opacity-30 pointer-events-none" : ""
        }`}
      >
        {/* Clickable Logo */}
        <div
          className="flex items-center justify-center h-16 bg-gray-800 cursor-pointer"
        >
          <span className="text-white text-2xl font-bold pr-3">Admin Panel</span>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4 space-y-2">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className={`flex w-full items-center px-4 py-3 rounded-lg transition-colors group ${
              activeSection === "dashboard"
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <FontAwesomeIcon
              icon={faHome}
              className="mr-3 text-gray-500 group-hover:text-white"
            />
            Dashboard
          </button>
          <button
            onClick={() => navigate("/admin-dashboard/users")}
            className={`flex w-full items-center px-4 py-3 rounded-lg transition-colors group ${
              activeSection === "users"
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <FontAwesomeIcon
              icon={faUsers}
              className="mr-3 text-gray-500 group-hover:text-white"
            />
            Users
          </button>
          <button
            onClick={() => navigate("/admin-dashboard/analytics")}
            className={`flex w-full items-center px-4 py-3 rounded-lg transition-colors group ${
              activeSection === "analytics"
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <FontAwesomeIcon
              icon={faChartBar}
              className="mr-3 text-gray-500 group-hover:text-white"
            />
            Analytics
          </button>
          <button
            onClick={() => navigate("/admin-dashboard/orders")}
            className={`flex w-full items-center px-4 py-3 rounded-lg transition-colors group ${
              activeSection === "orders"
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <FontAwesomeIcon
              icon={faShoppingCart}
              className="mr-3 text-gray-500 group-hover:text-white"
            />
            Orders
          </button>
          <button
            onClick={() => navigate("/admin-dashboard/products")}
            className={`flex w-full items-center px-4 py-3 rounded-lg transition-colors group ${
              activeSection === "products"
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <FontAwesomeIcon
              icon={faBox}
              className="mr-3 text-gray-500 group-hover:text-white"
            />
            Products
          </button>
          <button
            onClick={() => navigate("/admin-dashboard/settings")}
            className={`flex w-full items-center px-4 py-3 rounded-lg transition-colors group ${
              activeSection === "settings"
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <FontAwesomeIcon
              icon={faCog}
              className="mr-3 text-gray-500 group-hover:text-white"
            />
            Settings
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center space-y-3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/17003/17003310.png"
              alt="Admin"
              className="w-10 h-10 rounded-full"
            />
            <div className="text-center">
              <p className="text-white text-sm font-medium">John Admin</p>
              <p className="text-gray-400 text-xs">Administrator</p>
            </div>
            <button
              onClick={() => redirect("/", 1500, () => navigate("/"))}
              className="text-xs bg-gray-700 text-gray-200 hover:bg-gray-600 px-3 py-1 rounded transition"
            >
              → Go to Landing Page
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`ml-64 flex-1 ${
          redirectLoading ? "opacity-30 pointer-events-none" : ""
        }`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeSection === "dashboard"
                  ? "Welcome to the Admin Dashboard Overview"
                  : activeSection === "products"
                  ? "Manage Products"
                  : activeSection === "users"
                  ? "User Listing"
                  : activeSection === "analytics"
                  ? "Analytics Overview"
                  : activeSection === "orders"
                  ? "Manage Orders"
                  : activeSection === "settings"
                  ? "Settings"
                  : "Admin Panel"}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {activeSection === "dashboard"
                  ? "Welcome back, here's what's happening today"
                  : activeSection === "products"
                  ? "Here you can manage all products"
                  : activeSection === "users"
                  ? "Here you can view, search and create users"
                  : activeSection === "analytics"
                  ? "Insights and performance metrics"
                  : activeSection === "orders"
                  ? "Track and manage all orders"
                  : activeSection === "settings"
                  ? "Configure your application settings"
                  : ""}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="relative">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <FontAwesomeIcon icon={faBell} className="text-xl" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {activeSection === "dashboard" && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Revenue
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        $48,291
                      </p>
                      <div className="flex items-center mt-2">
                        <span className="text-green-600 text-sm font-medium flex items-center">
                          <FontAwesomeIcon icon={faArrowUp} className="mr-1" />
                          12%
                        </span>
                        <span className="text-gray-500 text-sm ml-2">
                          vs last month
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gray-700 bg-opacity-10 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faDollarSign}
                        className="text-gray-700 text-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 lg:col-span-2">
                <canvas ref={chartRef} className="h-80 w-full"></canvas>
              </div>
            </>
          )}

          {/* Outlet for all nested routes */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
