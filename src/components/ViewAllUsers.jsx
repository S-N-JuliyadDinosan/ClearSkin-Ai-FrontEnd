import React, { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { FaTrash, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  const toastOptions = {
    position: "top-right",
    autoClose: 3000,
    theme: "colored",
  };

  // Fetch users
  const fetchUsers = async (pageNo = 0, pageSize = 10) => {
    try {
      setLoading(true);
      if (!token) throw new Error("No token found. Please login.");
      const decoded = jwtDecode(token);
      if (decoded.role !== "ADMIN" && decoded.role !== "STAFF")
        throw new Error("You are not authorized to view users.");

      const response = await axios.get(
        `http://localhost:8000/api/v1/user?page=${pageNo}&size=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message, toastOptions);
      setUsers([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query) => {
    try {
      setLoading(true);
      setIsSearching(true);
      if (!token) throw new Error("No token found. Please login.");
      const decoded = jwtDecode(token);
      if (decoded.role !== "ADMIN" && decoded.role !== "STAFF")
        throw new Error("You are not authorized to search users.");

      const response = await axios.get(
        `http://localhost:8000/api/v1/user/search?query=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(response.data || []);
      setTotalPages(1);
      setPage(0);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message, toastOptions);
      setUsers([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isSearching) fetchUsers(page, size);
  }, [page, size, isSearching]);

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setIsSearching(false);
      fetchUsers(0, size);
    } else {
      searchUsers(searchTerm.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const confirmDelete = (user) => {
    setSelectedUser(user);
    setShowConfirm(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setShowConfirm(false);
    try {
      setDeleteLoading(true);
      if (!token) throw new Error("No token found. Please login.");
      const decoded = jwtDecode(token);
      if (decoded.role !== "ADMIN" && decoded.role !== "STAFF")
        throw new Error("You are not authorized to delete users.");

      await axios.delete(
        `http://localhost:8000/api/v1/user/${selectedUser.id || selectedUser.userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("User deleted successfully", toastOptions);
      setSelectedUser(null);
      if (isSearching) searchUsers(searchTerm.trim());
      else fetchUsers(page, size);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to delete user", toastOptions);
      setShowConfirm(true);
    } finally {
      setDeleteLoading(false);
    }
  };

  const isLoading = loading || deleteLoading;

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <ToastContainer />
      {isLoading && <Loader />}

      {/* Delete Confirmation Modal */}
      {showConfirm && selectedUser && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowConfirm(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 z-50 text-center">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Delete User</h2>
            <p className="text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedUser.name}</span>?
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDeleteUser}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-m pr-10"
          />
          <FaSearch
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-700"
            onClick={handleSearch}
          />
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 text-m"
          onClick={() => navigate("/admin-dashboard/users/user-register")}
        >
          Create New User
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full table-auto text-m">
          <thead>
            <tr className="bg-gray-200 text-gray-700 uppercase text-md leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id || user.userId}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">{user.id || user.userId}</td>
                  <td className="py-3 px-6 text-left">{user.name}</td>
                  <td className="py-3 px-6 text-left">{user.email}</td>
                  <td className="py-3 px-6 text-left">{user.role || "-"}</td>
                  <td className="py-3 px-6 text-center space-x-3">
                    <button
                      onClick={() => confirmDelete(user)}
                      className="p-2 text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500 text-lg">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isSearching && (
        <div className="flex justify-end items-center mt-6 space-x-4">
          <label className="text-gray-700 text-m">
            Show:
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="ml-2 px-2 py-1 border rounded text-m"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </label>
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50 text-m"
          >
            Previous
          </button>
          <span className="text-m">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev))}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50 text-m"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewAllUsers;
