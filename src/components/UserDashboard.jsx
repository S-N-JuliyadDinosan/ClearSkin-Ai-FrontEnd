import React from "react";
import { useNavigate, Outlet, NavLink, useLocation } from "react-router-dom"; 
import { useRedirectWithLoader } from "./useRedirectWithLoader"; 
import Loader from "./Loader"; 

const UserDashboard = () => {
  const navigate = useNavigate();
  const { redirect, loading: redirectLoading } = useRedirectWithLoader();
  const location = useLocation();

  // Function to get header title based on current route
  const getHeaderTitle = () => {
    if (location.pathname.includes("user-appointments")) return "Appointments";
    if (location.pathname.includes("rooms")) return "Rooms";
    if (location.pathname.includes("guests")) return "Guests";
    if (location.pathname.includes("services")) return "Services";
    if (location.pathname.includes("reports")) return "Reports";
    if (location.pathname.includes("settings")) return "Settings";
    return "Dashboard";
  };

  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* Loader Overlay */}
      {redirectLoading && <Loader />}

      {/* Main Dashboard Content (dimmed when loading) */}
      <div className={redirectLoading ? "opacity-30 pointer-events-none flex flex-1" : "flex flex-1"}>
        
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 bg-blue-950 text-white">
            
            {/* Clickable Logo/Header */}
            <div
              className="flex items-center justify-center h-16 px-4 cursor-pointer bg-blue-900"
              onClick={() => redirect("/", 1500, () => navigate("/"))}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10
                     10-4.477 10-10S17.523 2 12 2zM12 7a1 1 0 100 2
                     1 1 0 000-2zm0 4c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4z"
                />
                <circle cx="18" cy="6" r="1" fill="currentColor" />
              </svg>
              <span className="text-xl font-bold text-white ml-2">ClearSkinAI</span>
            </div>

            {/* Sidebar Navigation */}
            <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
              <nav className="flex-1 space-y-2">
                <NavLink
                    to="/user-dashboard"
                    end
                    className={({ isActive }) =>
                        `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                        isActive ? "bg-blue-700 text-white" : "hover:bg-blue-700 text-white"
                        }`
                    }
                    >
                    <i className="fas fa-tachometer-alt mr-3"></i>
                    Dashboard
                </NavLink>
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
                  to="/user-dashboard/rooms"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      isActive ? "bg-blue-700 text-white" : "hover:bg-blue-700 text-white"
                    }`
                  }
                >
                  <i className="fas fa-bed mr-3"></i>
                  Rooms
                </NavLink>

                <NavLink
                  to="/user-dashboard/guests"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      isActive ? "bg-blue-700 text-white" : "hover:bg-blue-700 text-white"
                    }`
                  }
                >
                  <i className="fas fa-users mr-3"></i>
                  Guests
                </NavLink>

                <NavLink
                  to="/user-dashboard/services"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      isActive ? "bg-blue-700 text-white" : "hover:bg-blue-700 text-white"
                    }`
                  }
                >
                  <i className="fas fa-concierge-bell mr-3"></i>
                  Services
                </NavLink>

                <NavLink
                  to="/user-dashboard/reports"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      isActive ? "bg-blue-700 text-white" : "hover:bg-blue-700 text-white"
                    }`
                  }
                >
                  <i className="fas fa-chart-bar mr-3"></i>
                  Reports
                </NavLink>

                <NavLink
                  to="/user-dashboard/settings"
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      isActive ? "bg-blue-700 text-white" : "hover:bg-blue-700 text-white"
                    }`
                  }
                >
                  <i className="fas fa-cog mr-3"></i>
                  Settings
                </NavLink>
              </nav>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-blue-700">
              <div className="flex items-center">
                <img
                  className="w-10 h-10 rounded-full"
                  src="https://randomuser.me/api/portraits/women/11.jpg"
                  alt="User"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium">Sarah Johnson</p>
                  <p className="text-xs text-blue-200">Admin</p>
                </div>
              </div>
            </div>
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
                <button className="flex items-center focus:outline-none">
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://randomuser.me/api/portraits/women/11.jpg"
                    alt="User"
                  />
                </button>
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
