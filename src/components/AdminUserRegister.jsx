import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const AdminUserRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
    setDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) throw new Error("No admin token found. Please login again.");

      const response = await axios.post(
        "http://localhost:8000/api/v1/user/admin/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        response.data?.message ||
          "User created successfully! Credentials has been sent to user email",
        { position: "top-right", autoClose: 2000, theme: "colored" }
      );

      setFormData({ name: "", email: "", role: "" });

      setTimeout(() => {
        navigate("/admin-dashboard/users");
      }, 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create user. Try again.",
        { position: "top-right", autoClose: 3000, theme: "colored" }
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-20 relative overflow-hidden">
      {loading && <Loader />}

      <div
        className={`max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden ${
          loading ? "opacity-30 pointer-events-none" : ""
        }`}
      >
        <div className="text-2xl py-4 px-6 bg-gray-900 text-white text-center font-bold uppercase">
          Create User
        </div>

        <form className="py-4 px-6" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Enter user name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Enter user email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role */}
          <div className="mb-4 relative">
            <label className="block text-gray-700 font-bold mb-2">Role</label>
            <div
              className="border rounded w-full py-2 px-3 text-gray-700 cursor-pointer flex justify-between items-center"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>{formData.role || "Select Role"}</span>
              <svg
                className={`w-4 h-4 transform transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {dropdownOpen && (
              <ul className="absolute z-10 w-full bg-white border mt-1 rounded shadow-lg overflow-hidden transition-all duration-300">
                {["STAFF", "ADMIN"].map((role) => (
                  <li
                    key={role}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleRoleSelect(role)}
                  >
                    {role}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Submit button */}
          <div className="flex items-center justify-center mb-4">
            <button
              className="bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AdminUserRegister;
