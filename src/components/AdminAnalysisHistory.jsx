import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { FaEye, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminAnalysisHistory = () => {
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const navigate = useNavigate();

  const fetchData = async (page = currentPage, size = pageSize) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) throw new Error("No token found");

      const res = await fetch(
        `http://localhost:8000/api/v1/user/analysis/all?page=${page - 1}&size=${size}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch analysis history");

      const data = await res.json();
      const records = data.content || data;

      // Enrich with user email
      const enrichedData = await Promise.all(
        records.map(async (item) => {
          try {
            const userRes = await fetch(
              `http://localhost:8000/api/v1/user/${item.userId}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const userData = await userRes.json();
            return { ...item, email: userData.email };
          } catch {
            return { ...item, email: "N/A" };
          }
        })
      );

      const sortedData = enrichedData.sort((a, b) => b.historyId - a.historyId);
      setHistory(sortedData);

      // Calculate total pages from backend
      if (data.totalElements) {
        setTotalPages(Math.ceil(data.totalElements / size));
      } else {
        setTotalPages(1);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch analysis history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const getClassColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "none":
        return "bg-green-200 text-green-800";
      case "mild":
        return "bg-yellow-200 text-yellow-800";
      case "moderate":
        return "bg-orange-200 text-orange-800";
      case "severe":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-black";
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

      // Slight delay to let toast appear before table refresh
      setTimeout(() => fetchData(currentPage, pageSize), 100);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete analysis history");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
      setSelectedHistory(null);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <Loader />
      </div>
    );
  }

  const getPageButtons = () => {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white rounded-lg shadow-lg relative">
      {showConfirm && selectedHistory && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowConfirm(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 z-50 text-center">
            <h2 className="text-lg font-bold text-black mb-3">
              Delete Analysis History
            </h2>
            <p className="text-gray-700">
              Are you sure you want to delete analysis ID{" "}
              <span className="font-semibold">{selectedHistory.historyId}</span>?
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-black"
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-black hover:bg-gray-900 text-white flex items-center justify-center min-w-[100px]"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? <Loader size={20} /> : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-black text-white border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase">
                Analysis ID
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold uppercase">
                User Email
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold uppercase">
                Acne Class
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold uppercase">
                Confidence
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((item) => {
                const progress = Math.round((item?.confidence || 0) * 100);
                return (
                  <tr
                    key={item.historyId}
                    className="hover:bg-gray-100 transition cursor-pointer"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-black">
                      {item.historyId}
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-medium text-black">
                      {item.email || "N/A"}
                    </td>
                    <td
                      className={`px-4 py-2 text-center text-sm font-medium rounded ${getClassColor(
                        item.severity
                      )}`}
                    >
                      {item.severity || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{progress}%</span>
                        <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-3 rounded-full bg-blue-500"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 flex gap-3 justify-center">
                      <FaEye
                        className="text-black hover:text-cyan-600 cursor-pointer transition"
                        onClick={() =>
                          navigate(
                            `/admin-dashboard/analysis-history/analysis-view/user?historyId=${item.historyId}`
                          )
                        }
                      />
                      <FaTrash
                        className="text-black hover:text-red-600 cursor-pointer transition"
                        onClick={() => confirmDelete(item)}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500 text-sm">
                  No analysis history available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 flex-wrap">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-1 rounded-lg border bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
          >
            Prev
          </button>

          {getPageButtons().map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-4 py-1 rounded-lg border transition ${
                currentPage === num
                  ? "bg-black text-white border-black"
                  : "bg-gray-100 hover:bg-gray-200 border-gray-300"
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-1 rounded-lg border bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <label className="text-black font-medium">Page Size:</label>
          <select
            value={pageSize}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              setPageSize(newSize);
              setCurrentPage(1);
            }}
            className="border rounded px-3 py-1 text-black hover:border-gray-400 transition"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalysisHistory;
