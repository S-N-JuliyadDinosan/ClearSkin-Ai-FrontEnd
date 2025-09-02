import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { useRedirectWithLoader } from "./useRedirectWithLoader";
import Loader from "./Loader";
import { FaEye, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AnalysisHistory = () => {
  const { loading: redirectLoading } = useRedirectWithLoader();
  const [loading, setLoading] = useState(true); // For fetching history
  const [pageLoading, setPageLoading] = useState(false); // For pagination changes
  const [deleting, setDeleting] = useState(false); // For delete action
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) throw new Error("No token found");

      const decoded = jwtDecode(token);
      const email = decoded?.email || decoded?.sub;
      if (!email) throw new Error("No email in token");

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
      setHistory((historyData || []).reverse());
    } catch (error) {
      console.error("Error fetching analysis history:", error);
      toast.error("Failed to fetch analysis history");
    } finally {
      setTimeout(() => setLoading(false), 700); // initial loader
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPages = Math.ceil(history.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = history.slice(startIndex, startIndex + pageSize);

  const getClassColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "none":
        return "bg-green-100 text-green-800";
      case "mild":
        return "bg-yellow-100 text-yellow-800";
      case "moderate":
        return "bg-orange-100 text-orange-800";
      case "severe":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const confirmDelete = (item) => {
    setSelectedHistory(item);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    if (!selectedHistory) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await fetch(
        `http://localhost:8000/api/v1/user/analysis/${selectedHistory.historyId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Analysis history deleted successfully");

      setHistory((prev) =>
        prev.filter((h) => h.historyId !== selectedHistory.historyId)
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete analysis history");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
      setSelectedHistory(null);
    }
  };

  // Handle pagination with loader
  const handlePageChange = (newPage) => {
    setPageLoading(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setPageLoading(false);
    }, 700); // 1000ms loader animation
  };

  // Full page loader (initial + redirect + pagination)
  if (loading || redirectLoading || pageLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-lg relative">
      <ToastContainer position="top-right" theme="colored" />

      {/* Delete Confirmation Modal */}
      {showConfirm && selectedHistory && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowConfirm(false)}
          ></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-[90%] max-w-md p-6 z-50 text-center">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
              Delete Analysis History
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete analysis ID{" "}
              <span className="font-semibold">{selectedHistory.historyId}</span>?
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center min-w-[100px]"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? <Loader size={20} /> : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Size Selector */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">Page Size:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              handlePageChange(1);
            }}
            className="border rounded px-3 py-1 text-gray-700 hover:border-gray-400 transition"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        <div className="text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse shadow-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="w-40 px-4 py-3 text-left text-sm font-semibold text-gray-600 uppercase">
              Analysis ID
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 uppercase">
              Acne Class
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 uppercase">
              Acne Level
            </th>
            <th className="w-40 px-2 py-3 text-center text-sm font-semibold text-gray-600 uppercase">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((item) => {
              const progress = Math.round((item?.confidence || 0) * 100);
              return (
                <tr
                  key={item.historyId}
                  className="hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">
                    {item.historyId}
                  </td>
                  <td
                    className={`px-4 py-2 text-center text-sm font-medium rounded ${getClassColor(
                      item?.severity
                    )}`}
                  >
                    {item?.severity || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{progress}%</span>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 flex gap-3 justify-center">
                    <FaEye
                      className="text-gray-700 hover:text-cyan-600 cursor-pointer transition"
                      onClick={() =>
                        navigate(
                          `/user-dashboard/analysis-view/user?historyId=${item.historyId}`
                        )
                      }
                    />
                    <FaTrash
                      className="text-gray-700 hover:text-red-600 cursor-pointer transition"
                      onClick={() => confirmDelete(item)}
                    />
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan="4"
                className="text-center py-6 text-gray-500 text-sm"
              >
                No analysis history available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-1 rounded-lg border bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => handlePageChange(num)}
              className={`px-4 py-1 rounded-lg border transition ${
                currentPage === num
                  ? "bg-cyan-600 text-white border-cyan-600"
                  : "bg-gray-100 hover:bg-gray-200 border-gray-300"
              }`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-1 rounded-lg border bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AnalysisHistory;
