import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "./Loader";
import { useRedirectWithLoader } from "./useRedirectWithLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditAppointmentByUser = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams(); // get appointmentId from route
  const { loading: redirectLoading } = useRedirectWithLoader();

  const [formData, setFormData] = useState({
    userEmail: "",
    userName: "",
    date: "",
    doctorName: "",
    userId: null,
  });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("No token found. Please login.");

        // Fetch appointment by ID
        const apptRes = await axios.get(
          `http://localhost:8000/api/v1/appointments/${appointmentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const appt = apptRes.data;

        // Fetch doctors list
        const docRes = await axios.get("http://localhost:8000/api/v1/doctors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const doctorNames = docRes.data.content.map((doc) => doc.name);

        // Artificial delay to show loader
        setTimeout(() => {
          setFormData({
            userEmail: appt.userEmail,
            userName: appt.userName,
            date: new Date(appt.date).toISOString().slice(0, 16),
            doctorName: appt.doctorName,
            userId: appt.userId,
          });
          setDoctors(doctorNames);
          setLoading(false);
        }, 700); // 1 second delay
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load appointment details.");
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");
      const isoDate = new Date(formData.date).toISOString();

      const putRes = await axios.put(
        `http://localhost:8000/api/v1/appointments/user/${formData.userId}/${appointmentId}`,
        { 
            userName: formData.userName,   // include this
            date: isoDate, 
            doctorName: formData.doctorName 
        },
        { headers: { Authorization: `Bearer ${token}` } }
        );


      toast.success("Appointment updated successfully!", {
        autoClose: 3000,
        theme: "colored",
      });

      setTimeout(() => navigate("/user-dashboard/user-appointments"), 3000);
    } catch (err) {
      console.error(err.response?.data || err.message);
      const msg =
        err.response?.data?.message ||
        "Failed to update appointment. Please try again.";
      toast.error(msg, { autoClose: 3000, theme: "colored" });
    }
  };

  if (loading || redirectLoading) return <Loader />; // loader while fetching
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
      <ToastContainer />
      <div className="text-2xl py-4 px-6 bg-gray-900 text-white text-center font-bold uppercase">
        Edit Appointment
      </div>
      <form className="py-4 px-6" onSubmit={handleUpdate}>
        <div className="mb-4">
          <label htmlFor="userName" className="block text-gray-700 font-bold mb-2">
            Name
          </label>
          <input
            id="userName"
            type="text"
            value={formData.userName}
            readOnly
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 cursor-not-allowed focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="userEmail" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            id="userEmail"
            type="email"
            value={formData.userEmail}
            readOnly
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 cursor-not-allowed focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700 font-bold mb-2">
            Date & Time
          </label>
          <input
            id="date"
            type="datetime-local"
            value={formData.date}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="doctorName" className="block text-gray-700 font-bold mb-2">
            Doctor
          </label>
          <select
            id="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select doctor</option>
            {doctors.map((docName, idx) => (
              <option key={idx} value={docName}>
                {docName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center mb-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Update Appointment
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAppointmentByUser;
