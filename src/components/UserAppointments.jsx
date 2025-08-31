import React, { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useRedirectWithLoader } from "./useRedirectWithLoader";
import Loader from "./Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statusColors = {
  PENDING: "bg-yellow-300 text-yellow-800",
  CONFIRMED: "bg-blue-300 text-blue-800",
  CANCELLED: "bg-red-300 text-red-800",
  COMPLETED: "bg-green-300 text-green-800",
  RESCHEDULED: "bg-purple-300 text-purple-800",
};

const UserAppointments = () => {
  const navigate = useNavigate();
  const { loading: redirectLoading } = useRedirectWithLoader();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for delete modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("No token found");

        const decoded = jwtDecode(token);
        const email = decoded?.email || decoded?.sub;

        const userRes = await axios.get(
          `http://localhost:8000/api/v1/user/email?email=${email}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const userId = userRes.data.userId;

        const apptRes = await axios.get(
          `http://localhost:8000/api/v1/appointments/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setTimeout(() => {
          setAppointments(apptRes.data);
          setLoading(false);
        }, 1000); // loader delay for UX
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments");
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleEdit = (appointmentId) => {
    navigate(`/user-dashboard/update-appointment/user/${appointmentId}`);
  };

  const confirmDelete = (appointment) => {
    setSelectedAppointment(appointment);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    if (!selectedAppointment) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) throw new Error("No token found");

      const decoded = jwtDecode(token);
      const email = decoded?.email || decoded?.sub;

      const userRes = await axios.get(
        `http://localhost:8000/api/v1/user/email?email=${email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const userId = userRes.data.userId;

      await axios.delete(
        `http://localhost:8000/api/v1/appointments/user/${userId}/${selectedAppointment.appointmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Show toast immediately
      toast.success("Appointment deleted successfully");

      setTimeout(() => {
        setAppointments(
          appointments.filter(
            (appt) => appt.appointmentId !== selectedAppointment.appointmentId
          )
        );
        setLoading(false);
        setShowConfirm(false);
        setSelectedAppointment(null);
      }, 800); // small delay for UX
    } catch (err) {
      console.error("Error deleting appointment:", err);
      toast.error("Failed to delete appointment");
      setLoading(false);
      setShowConfirm(false);
      setSelectedAppointment(null);
    }
  };

  return (
    <div className="text-gray-900 bg-gray-200 min-h-screen relative">
      {/* Toast container always rendered */}
      <ToastContainer position="top-right" theme="colored" />

      {/* Loader overlay */}
      {(loading || redirectLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <Loader />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirm && selectedAppointment && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowConfirm(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 z-50 text-center">
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              Delete Appointment
            </h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete your appointment with{" "}
              <span className="font-semibold">
                {selectedAppointment.doctorName}
              </span>{" "}
              on{" "}
              <span className="font-semibold">
                {new Date(selectedAppointment.date).toLocaleString()}
              </span>
              ?
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Appointments</h1>
        <button
          onClick={() => navigate("/user-dashboard/book-appointment/user")}
          className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 mr-2 mt-3 rounded"
        >
          Book a New Appointment
        </button>
      </div>

      {/* Appointments Table */}
      <div className="px-3 py-4 flex justify-center">
        <table className="w-full text-md bg-white shadow-md rounded mb-4">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="text-left p-3 px-5">Booking ID</th>
              <th className="text-left p-3 px-5">Date</th>
              <th className="text-left p-3 px-5">Time</th>
              <th className="text-left p-3 px-5">Doctor</th>
              <th className="text-left p-3 px-5">Status</th>
              <th className="text-left p-3 px-5">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => {
              const dateObj = new Date(appt.date);
              const dateStr = dateObj.toLocaleDateString();
              const timeStr = dateObj.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              const isPending = appt.status === "PENDING";
              const statusClass =
                statusColors[appt.status] || "bg-gray-200 text-gray-800";

              return (
                <tr
                  key={appt.appointmentId}
                  className="border-b hover:bg-orange-100"
                >
                  <td className="p-3 px-5">{appt.appointmentId}</td>
                  <td className="p-3 px-5">{dateStr}</td>
                  <td className="p-3 px-5">{timeStr}</td>
                  <td className="p-3 px-5">{appt.doctorName}</td>
                  <td className="p-3 px-5">
                    <span
                      className={`px-2 py-1 rounded font-semibold ${statusClass}`}
                    >
                      {appt.status}
                    </span>
                  </td>
                  <td className="p-3 px-5 flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(appt.appointmentId)}
                      disabled={!isPending}
                      className={`text-sm py-1 px-2 rounded focus:outline-none focus:shadow-outline ${
                        isPending
                          ? "bg-blue-500 hover:bg-blue-700 text-white"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(appt)}
                      disabled={!isPending}
                      className={`text-sm py-1 px-2 rounded focus:outline-none focus:shadow-outline ${
                        isPending
                          ? "bg-red-500 hover:bg-red-700 text-white"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {appointments.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserAppointments;
