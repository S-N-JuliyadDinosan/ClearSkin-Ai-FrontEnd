import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useRedirectWithLoader } from "./useRedirectWithLoader"; // custom hook
import Loader from "./Loader"; // animated loader
import { Chart, registerables } from "chart.js";
import "chart.js/auto";
import jwtDecode from "jwt-decode";
import NavLinkWithRedirectLoader from "./NavLinkWithRedirectLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUsers,
  faChartBar,
  faBox,
  faCog,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import "../App.css";
import axios from "axios";

Chart.register(...registerables);

const AdminDashboard = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { redirect, loading: redirectLoading } = useRedirectWithLoader();

  const [activeSection, setActiveSection] = useState("dashboard");
  const [userDetails, setUserDetails] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [totalSkinAnalysis, setTotalSkinAnalysis] = useState(0);
  const [loadingSkinAnalysis, setLoadingSkinAnalysis] = useState(true);
  const [analysisData, setAnalysisData] = useState([]);
  const [loadingChart, setLoadingChart] = useState(true);

  // Fetch admin user details
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const email = decoded?.sub || decoded?.email || decoded?.username;

      if (email) {
        fetch(`http://localhost:8000/api/v1/user/email?email=${email}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch user details");
            return res.json();
          })
          .then((data) => setUserDetails(data.data || data))
          .catch((err) => console.error("Error fetching user details:", err));
      }
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }, []);

  // Fetch total users
  useEffect(() => {
    const fetchTotalUsers = async () => {
      setLoadingUsers(true);
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) return;

        const response = await axios.get("http://localhost:8000/api/v1/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const usersArray = Array.isArray(response.data)
          ? response.data
          : response.data?.content || [];

        setTotalUsers(usersArray.length);
      } catch (err) {
        console.error("Error fetching total users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchTotalUsers();
  }, []);

  // Fetch total skin analysis
  useEffect(() => {
    const fetchSkinAnalysis = async () => {
      setLoadingSkinAnalysis(true);
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) return;

        const response = await axios.get(
          "http://localhost:8000/api/v1/user/analysis/all?page=0&size=10000",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const analysisArray = Array.isArray(response.data)
          ? response.data
          : response.data?.content || [];

        setAnalysisData(analysisArray);
        setTotalSkinAnalysis(analysisArray.length);
      } catch (err) {
        console.error("Error fetching skin analysis:", err);
      } finally {
        setLoadingSkinAnalysis(false);
        setLoadingChart(false);
      }
    };

    fetchSkinAnalysis();
  }, []);

  // Update active section based on route
  useEffect(() => {
    if (location.pathname.includes("/products")) setActiveSection("products");
    else if (location.pathname.includes("/users")) setActiveSection("users");
    else if (location.pathname.includes("/analytics")) setActiveSection("analytics");
    else if (location.pathname.includes("/appointments")) setActiveSection("appointments");
    else if (location.pathname.includes("/analysis-history")) setActiveSection("analysis-history");
    else if (location.pathname.includes("/manage-doctors")) setActiveSection(" Manage Doctors");
    else setActiveSection("dashboard");
  }, [location.pathname]);

  // Setup analysis history chart
  useEffect(() => {
    if (activeSection !== "dashboard") return;
    if (!chartRef.current || loadingChart) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    // Prepare data
    const countsByDate = analysisData.reduce((acc, item) => {
      const date = new Date(item.analysisTime).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(countsByDate).sort(
      (a, b) => new Date(a) - new Date(b)
    );
    const data = labels.map((label) => countsByDate[label]);

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Analysis Count",
            data,
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
        plugins: { legend: { display: true } },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#9ca3af" } },
          y: {
            beginAtZero: true,
            grid: { color: "#e5e7eb" },
            ticks: { color: "#9ca3af" },
          },
        },
        elements: { point: { hoverRadius: 8 } },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [analysisData, activeSection, loadingChart]);

  return (
    <div className="bg-gray-100 min-h-screen flex relative">
      {redirectLoading && <Loader />}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 shadow-xl z-50 ${
          redirectLoading ? "opacity-30 pointer-events-none" : ""
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 bg-gray-800 cursor-pointer">
          <span className="text-white text-2xl font-bold pr-3">Admin Panel</span>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4 space-y-2">
          {[
            { key: "dashboard", label: "Dashboard", path: "/admin-dashboard" },
            { key: "users", label: "Users", path: "/admin-dashboard/users" },
            { key: "appointments", label: "Appointments", path: "/admin-dashboard/appointments" },
            { key: "analysis-history", label: "Analysis History", path: "/admin-dashboard/analysis-history" },
            { key: "products", label: "Products", path: "/admin-dashboard/products" },
            { key: "manage-doctors", label: "Doctors", path: "/admin-dashboard/manage-doctors" },
          ].map((item) => (
            <NavLinkWithRedirectLoader
              key={item.key}
              to={item.path}
              className={`flex w-full items-center px-4 py-3 rounded-lg transition-colors ${
                activeSection === item.key
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <FontAwesomeIcon
                icon={
                  item.key === "dashboard"
                    ? faHome
                    : item.key === "users"
                    ? faUsers
                    : item.key === "appointments"
                    ? faChartBar
                    : item.key === "analysis-history"
                    ? faHistory
                    : item.key === "products"
                    ? faBox
                    : faCog
                }
                className="mr-3 text-gray-500 group-hover:text-white"
              />
              {item.label}
            </NavLinkWithRedirectLoader>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center space-y-3">
            <img
              src={
                userDetails?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  userDetails?.name || "User"
                )}&background=374151&color=fff&size=128`
              }
              alt={userDetails?.name || "User"}
              className="w-10 h-10 rounded-full"
            />
            <div className="text-center">
              <p className="text-white text-sm font-medium">
                {userDetails?.name || "Loading..."}
              </p>
              <p className="text-gray-400 text-xs">
                {userDetails?.role || "Fetching role..."}
              </p>
            </div>
            <button
              onClick={() => redirect("/", 1500, () => navigate("/"))}
              className="text-xs font-semibold bg-gray-700 text-gray-200 hover:bg-gray-600 px-4 py-2 rounded transition"
            >
              → Go to Landing Page
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`ml-64 flex-1 ${redirectLoading ? "opacity-30 pointer-events-none" : ""}`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeSection === "dashboard"
                  ? "Welcome to the Admin Dashboard Overview"
                  : activeSection}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {activeSection === "dashboard"
                  ? "Welcome back, here's what's happening today"
                  : ""}
              </p>
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
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {loadingUsers ? "..." : totalUsers}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gray-700 bg-opacity-10 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon icon={faUsers} className="text-gray-700 text-xl" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Skin Analysis</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {loadingSkinAnalysis ? "..." : totalSkinAnalysis}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gray-700 bg-opacity-10 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon icon={faChartBar} className="text-gray-700 text-xl" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 lg:col-span-2">
                {loadingChart ? <Loader /> : <canvas ref={chartRef} className="h-80 w-full"></canvas>}
              </div>
            </>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
