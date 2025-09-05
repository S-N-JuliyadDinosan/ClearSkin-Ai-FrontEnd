import React, { useEffect, useState } from "react";
import { useNavigate, Outlet, NavLink, useLocation } from "react-router-dom"; 
import { useRedirectWithLoader } from "./useRedirectWithLoader"; 
import Loader from "./Loader"; 
import axios from "axios";
import jwtDecode from "jwt-decode";
import logo from "../assets/logo_f.png";
import NavLinkWithRedirectLoader from "./NavLinkWithRedirectLoader";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { redirect, loading: redirectLoading } = useRedirectWithLoader();
  const location = useLocation();

  const [entryLoading, setEntryLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Fetch user info from API using JWT token
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("No token found. Please login again.");

        const decoded = jwtDecode(token);
        const email = decoded?.sub || decoded?.email;
        if (!email) throw new Error("Invalid token. Email not found.");

        const response = await axios.get(
          `http://localhost:8000/api/v1/user/email?email=${email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setEntryLoading(false), 100);
    return () => clearTimeout(timer);
  }, [location.pathname]); 

  const getHeaderTitle = () => {
    if (location.pathname.includes("user-appointments")) return "Appointments";
    if (location.pathname.includes("analysis-history/user")) return "Analysis History";
    if (location.pathname.includes("our-doctors")) return "Our Doctors";
    // if (location.pathname.includes("guests")) return "Guests";
    // if (location.pathname.includes("services")) return "Services";
    // if (location.pathname.includes("reports")) return "Reports";
    if (location.pathname.includes("user-profile")) return "User Profile";
    return "Dashboard";
  };

  const showLoading = redirectLoading || entryLoading;

  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* Loader Overlay */}
      {showLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <Loader />
        </div>
      )}

      {/* Main Dashboard Content */}
      <div
        className={showLoading ? "opacity-30 pointer-events-none flex flex-1" : "flex flex-1"}
      >
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 bg-blue-950 text-white">
            {/* Clickable Logo/Header */}
            <div
              className="flex items-center justify-center h-16 px-4 cursor-pointer bg-blue-900"
              onClick={() => redirect("/", 1500, () => navigate("/"))}
            >
              <img src={logo} alt="ClearSkinAI Logo" className="h-10 w-10 object-contain" />
              <span className="text-xl font-bold text-white ml-2">ClearSkinAI</span>
            </div>

            {/* Sidebar Navigation */}
            <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
              <nav className="flex-1 space-y-2">
                <NavLinkWithRedirectLoader
                  to="/user-dashboard"
                  delay={1000}
                  isActive={location.pathname === "/user-dashboard"}
                >
                  <i className="fas fa-tachometer-alt mr-3"></i>
                  Dashboard
                </NavLinkWithRedirectLoader>

                <NavLink
                  to="/user-dashboard/user-appointments"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      isActive ? "bg-blue-700 text-white" : "hover:bg-blue-700 text-white"
                    }`
                  }
                >
                  <i className="fas fa-calendar-check mr-3"></i>
                  Appointments
                </NavLink>

                <NavLink
                  to="/user-dashboard/analysis-history/user"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      isActive ? "bg-blue-700 text-white" : "hover:bg-blue-700 text-white"
                    }`
                  }
                >
                  <i className="fas fa-bed mr-3"></i>
                  My Analysis History
                </NavLink>

                <NavLink
                  to="/user-dashboard/our-doctors"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      isActive ? "bg-blue-700 text-white" : "hover:bg-blue-700 text-white"
                    }`
                  }
                >
                  <i className="fas fa-users mr-3"></i>
                  Our Doctors
                </NavLink>

                {/* <NavLink
                  to="/user-dashboard/services"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      isActive ? "bg-blue-700 text-white" : "hover:bg-blue-700 text-white"
                    }`
                  }
                >
                  <i className="fas fa-concierge-bell mr-3"></i>
                  Services
                </NavLink> */}

                {/* <NavLink
                  to="/user-dashboard/reports"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      isActive ? "bg-blue-700 text-white" : "hover:bg-blue-700 text-white"
                    }`
                  }
                >
                  <i className="fas fa-chart-bar mr-3"></i>
                  Reports
                </NavLink> */}

                <NavLinkWithRedirectLoader
                  to="/user-dashboard/user-profile"
                  delay={1000}
                  isActive={location.pathname === "/user-dashboard/user-profile"}
                >
                  <i className="fas fa-tachometer-alt mr-3"></i>
                  Settings
                </NavLinkWithRedirectLoader>
              </nav>
            </div>

            {/* Sidebar Footer */}
            {user && (
              <div className="p-4 border-t border-blue-700">
                <div className="flex items-center">
                  <img
                    className="w-10 h-10 rounded-full shadow-md"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4f46e5&color=fff&size=128`}
                    alt={user.name}
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-blue-200">{user.role || "User"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top Navigation */}
          <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center">
              <button className="md:hidden text-gray-500 focus:outline-none">
                <i className="fas fa-bars"></i>
              </button>
              <h1 className="text-xl font-semibold text-gray-800 ml-4">{getHeaderTitle()}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 focus:outline-none">
                <i className="fas fa-bell"></i>
              </button>
              <button className="text-gray-500 focus:outline-none">
                <i className="fas fa-envelope"></i>
              </button>
              <div className="relative">
                {user && (
                  <button className="flex items-center focus:outline-none">
                    <img
                      className="w-8 h-8 rounded-full shadow-md"
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4f46e5&color=fff&size=128`}
                      alt={user.name}
                    />
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
