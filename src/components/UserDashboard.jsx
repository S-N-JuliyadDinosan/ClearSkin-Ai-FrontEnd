import React from "react";
import { useNavigate } from "react-router-dom";
import { useRedirectWithLoader } from "./useRedirectWithLoader"; // custom hook
import Loader from "./Loader"; // animated loader component

const UserDashboard = () => {
  const navigate = useNavigate();
  const { redirect, loading: redirectLoading } = useRedirectWithLoader();

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
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-blue-700 text-white"
                >
                  <i className="fas fa-tachometer-alt mr-3"></i>
                  Dashboard
                </a>
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-blue-700 text-white"
                >
                  <i className="fas fa-calendar-check mr-3"></i>
                  Bookings
                </a>
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-blue-700 text-white"
                >
                  <i className="fas fa-bed mr-3"></i>
                  Rooms
                </a>
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-blue-700 text-white"
                >
                  <i className="fas fa-users mr-3"></i>
                  Guests
                </a>
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-blue-700 text-white"
                >
                  <i className="fas fa-concierge-bell mr-3"></i>
                  Services
                </a>
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-blue-700 text-white"
                >
                  <i className="fas fa-chart-bar mr-3"></i>
                  Reports
                </a>
                <a
                  href="#"
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-blue-700 text-white"
                >
                  <i className="fas fa-cog mr-3"></i>
                  Settings
                </a>
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
              <h1 className="text-xl font-semibold text-gray-800 ml-4">Dashboard</h1>
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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[
                { icon: "fas fa-bed", title: "Total Rooms", value: "120", bg: "bg-blue-100", text: "text-blue-600" },
                { icon: "fas fa-calendar-check", title: "Occupied", value: "84", bg: "bg-green-100", text: "text-green-600" },
                { icon: "fas fa-calendar-day", title: "Check-ins Today", value: "12", bg: "bg-yellow-100", text: "text-yellow-600" },
                { icon: "fas fa-calendar-times", title: "Check-outs Today", value: "8", bg: "bg-red-100", text: "text-red-600" },
              ].map((card, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full ${card.bg} ${card.text}`}>
                      <i className={`${card.icon} text-xl`}></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">{card.title}</p>
                      <p className="text-2xl font-semibold text-gray-800">{card.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
