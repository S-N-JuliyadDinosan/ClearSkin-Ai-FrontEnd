import React, { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { FaEnvelope, FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Loader from "./Loader";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    retypeNewPassword: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  // Track visibility for each password input
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  const navigate = useNavigate();

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
        toast.error(err.message || "Failed to fetch user profile", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.retypeNewPassword) {
      toast.error("New passwords do not match", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    try {
      setSubmitLoading(true);
      const token = localStorage.getItem("jwtToken");

      // Simulate 1500ms loading before sending the request
      setTimeout(async () => {
        try {
          const response = await axios.put(
            "http://localhost:8000/api/v1/user/change-password",
            passwordData,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          toast.success(response.data.message || "Password changed successfully", {
            position: "top-right",
            autoClose: 2000,
            theme: "colored",
          });

          // Reset form
          setShowPasswordForm(false);
          setPasswordData({ oldPassword: "", newPassword: "", retypeNewPassword: "" });

          // Redirect after success
          setTimeout(() => {
            navigate("/user-dashboard/user-profile");
          }, 2200);
        } catch (err) {
          console.error(err);
          toast.error(
            err.response?.data?.message || "Failed to change password",
            { position: "top-right", autoClose: 3000, theme: "colored" }
          );
        } finally {
          setSubmitLoading(false);
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      setSubmitLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <ToastContainer />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-6">
        <img
          src={`https://ui-avatars.com/api/?name=${user.name}&background=4f46e5&color=fff&size=128`}
          alt="User Avatar"
          className="w-24 h-24 rounded-full shadow-md"
        />
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-gray-500 mt-1">{user.email}</p>
        </div>
      </div>

      {/* Info Sections */}
      <div className="space-y-4">
        {/* Full Name */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-sm border border-blue-200">
          <FaUser className="text-blue-500 text-xl" />
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="text-gray-800 font-medium">{user.name}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg shadow-sm border border-green-200">
          <FaEnvelope className="text-green-500 text-xl" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-gray-800 font-medium">{user.email}</p>
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg shadow-sm border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FaLock className="text-purple-500 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Password</p>
                <p className="text-gray-800 font-medium">********</p>
              </div>
            </div>
            <button
              className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              {showPasswordForm ? "Cancel" : "Edit"}
            </button>
          </div>

          {/* Password Change Form */}
          {showPasswordForm && (
            <form onSubmit={handleChangePassword} className="flex flex-col gap-3 mt-3">
              {/* Old Password */}
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Old Password"
                  autoComplete="current-password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, oldPassword: e.target.value })
                  }
                  className="p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showOldPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>

              {/* New Password */}
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  autoComplete="new-password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  className="p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showNewPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>

              {/* Retype New Password */}
              <div className="relative">
                <input
                  type={showRetypePassword ? "text" : "password"}
                  placeholder="Retype New Password"
                  autoComplete="new-password"
                  value={passwordData.retypeNewPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, retypeNewPassword: e.target.value })
                  }
                  className="p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRetypePassword(!showRetypePassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showRetypePassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>

              {/* Submit Button with Loader */}
              <button
                type="submit"
                disabled={submitLoading}
                className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition mt-2"
              >
                {submitLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader className="h-5 w-5 border-b-2 border-white animate-spin" />
                    Changing...
                  </div>
                ) : (
                  "Change Password"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
