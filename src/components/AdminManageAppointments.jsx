import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import Loader from "./Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavLinkWithRedirectLoader from "./NavLinkWithRedirectLoader";

const statusOptions = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "RESCHEDULED"];

const statusColors = {
  PENDING: "bg-yellow-50 text-yellow-800 border border-yellow-300",
  CONFIRMED: "bg-blue-50 text-blue-800 border border-blue-300",
  CANCELLED: "bg-red-50 text-red-800 border border-red-300",
  COMPLETED: "bg-green-50 text-green-800 border border-green-300",
  RESCHEDULED: "bg-purple-50 text-purple-800 border border-purple-300",
};

const AdminManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editRow, setEditRow] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [currentPage, pageSize]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) throw new Error("No token found");

      const res = await axios.get(
        `http://localhost:8000/api/v1/appointments?page=${currentPage}&pageSize=${pageSize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAppointments(res.data.content || res.data);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      toast.error("Failed to fetch appointments", { autoClose: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStatus = async (appointmentId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) throw new Error("No token found");

      await axios.patch(
        `http://localhost:8000/api/v1/appointments/${appointmentId}/status`,
        selectedStatus,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      setAppointments((prev) =>
        prev.map((appt) =>
          appt.appointmentId === appointmentId ? { ...appt, status: selectedStatus } : appt
        )
      );

      toast.success("Status updated successfully!", { autoClose: 4000 });
      setEditRow(null);
      setSelectedStatus("");
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status", { autoClose: 4000 });
    }
  };

  const confirmDelete = (appointment) => {
    setSelectedAppointment(appointment);
    setShowConfirm(true);
  };

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;
    setDeleting(true);

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) throw new Error("No token found");

      await axios.delete(
        `http://localhost:8000/api/v1/appointments/admin-staff/${selectedAppointment.appointmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Appointment deleted successfully!", { autoClose: 2000 });

      // ⏳ Keep loading + modal for 2s, then reset
      setTimeout(() => {
        setShowConfirm(false);
        setDeleting(false);
        fetchAppointments();
      }, 2000);
    } catch (err) {
      console.error("Error deleting appointment:", err);
      toast.error("Failed to delete appointment", { autoClose: 4000 });
      setDeleting(false);
    } finally {
      setSelectedAppointment(null);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex flex-col bg-gray-50">
        {/* Fullscreen Loader Overlay */}
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" theme="colored" />

      {/* Top Bar */}
      <div className="flex justify-end mb-4">
        <NavLinkWithRedirectLoader
          to="/admin-dashboard/appointments/create-appointment"
          className="px-4 py-2 bg-green-500 hover:bg-green-600 font-semibold text-white rounded-lg shadow"
        >
          Create Appointment
        </NavLinkWithRedirectLoader>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-xl rounded-xl bg-white">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gradient-to-r from-gray-700 to-gray-800 text-white uppercase text-xs">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">User</th>
              <th className="p-4">Email</th>
              <th className="p-4">Doctor</th>
              <th className="p-4">Date</th>
              <th className="p-4">Time</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-6 text-gray-500">
                  No appointments found 🚫
                </td>
              </tr>
            )}
            {appointments.map((appt, idx) => {
              const dateObj = new Date(appt.date);
              const dateStr = dateObj.toLocaleDateString();
              const timeStr = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

              return (
                <tr
                  key={appt.appointmentId}
                  className={`transition-colors ${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="p-4 font-medium text-gray-800">{appt.appointmentId}</td>
                  <td className="p-4">{appt.userName}</td>
                  <td className="p-4 text-gray-600">{appt.userEmail}</td>
                  <td className="p-4">{appt.doctorName}</td>
                  <td className="p-4">{dateStr}</td>
                  <td className="p-4">{timeStr}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-medium tracking-wide ${statusColors[appt.status]}`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => {
                        setEditRow(appt.appointmentId);
                        setSelectedStatus(appt.status);
                      }}
                      className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-sm transition flex items-center justify-center"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => confirmDelete(appt)}
                      className="p-2 text-black hover:text-red-600 flex items-center justify-center"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-4 mt-4">
        <span>
          Page Size:{" "}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(0);
            }}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </span>
        <NavLinkWithRedirectLoader
          onClick={() => currentPage > 0 && setCurrentPage(currentPage - 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-sm disabled:opacity-50"
        >
          Prev
        </NavLinkWithRedirectLoader>
        <span>
          {currentPage + 1} / {totalPages}
        </span>
        <NavLinkWithRedirectLoader
          onClick={() => currentPage + 1 < totalPages && setCurrentPage(currentPage + 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-sm disabled:opacity-50"
        >
          Next
        </NavLinkWithRedirectLoader>
      </div>

      {/* Status Edit Modal */}
      {editRow && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-96">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Update Appointment Status</h2>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => handleSaveStatus(editRow)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white shadow transition"
              >
                <FaCheck /> Save
              </button>
              <button
                onClick={() => {
                  setEditRow(null);
                  setSelectedStatus("");
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow transition"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirm && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !deleting && setShowConfirm(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 z-50 text-center">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Delete Appointment</h2>
            <p className="text-gray-600">
              Are you sure you want to delete appointment ID{" "}
              <span className="font-semibold">{selectedAppointment.appointmentId}</span>?
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
                onClick={() => !deleting && setShowConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 ${
                  deleting ? "opacity-70 cursor-not-allowed" : ""
                }`}
                onClick={handleDeleteAppointment}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader className="w-5 h-5" /> Deleting...
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageAppointments;
