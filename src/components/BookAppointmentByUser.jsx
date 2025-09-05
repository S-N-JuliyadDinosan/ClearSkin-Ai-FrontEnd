import React, { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { useRedirectWithLoader } from "./useRedirectWithLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft } from "lucide-react"; // Back icon

const BookAppointmentByUser = () => {
  const navigate = useNavigate();
  const { loading: redirectLoading, redirect } = useRedirectWithLoader();
  const [formData, setFormData] = useState({
    userEmail: "",
    userName: "",
    date: "",
    doctorName: "",
  });
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("No token found. Please login.");

        const decoded = jwtDecode(token);
        const userEmail = decoded?.email || decoded?.sub || "";

        // Fetch user name
        let userName = "";
        try {
          const res = await axios.get(
            `http://localhost:8000/api/v1/user/email?email=${userEmail}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          userName = res.data.name || "";
        } catch {
          userName = "";
        }

        // Fetch doctors
        const docRes = await axios.get("http://localhost:8000/api/v1/doctors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const doctorNames = docRes.data.content.map((doc) => doc.name);

        // Artificial delay for loader
        setTimeout(() => {
          setFormData({ userEmail, userName, date: "", doctorName: "" });
          setDoctors(doctorNames);
          setLoading(false);
        }, 700);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load data.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post("http://localhost:8000/api/v1/appointments", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Appointment booked successfully!", { autoClose: 3000, theme: "colored" });
      setTimeout(() => navigate("/user-dashboard/user-appointments"), 1500);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message || "Failed to book appointment. Please try again.";
      toast.error(msg, { autoClose: 3000, theme: "colored" });
    }
  };

  if (loading || redirectLoading) return <Loader />;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="relative max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Back Button */}
      <div className="absolute top-3 left-1 z-50">
        <button
          onClick={() => redirect("/user-dashboard/user-appointments")}
          className="flex items-center bg-white/80 dark:bg-gray-800/80 px-3 py-2 rounded-full shadow hover:shadow-md text-gray-700 dark:text-white font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition transform hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
      </div>

      <ToastContainer />
      <div className="text-2xl py-4 px-6 bg-gray-900 text-white text-center font-bold uppercase">
        Book Appointment
      </div>
      <form className="py-4 px-6" onSubmit={handleSubmit}>
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
            className="bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:shadow-outline"
          >
            Book Appointment
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookAppointmentByUser;
