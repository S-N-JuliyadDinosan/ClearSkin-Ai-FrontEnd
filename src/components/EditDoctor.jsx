import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "./Loader";
import { ArrowLeft } from "lucide-react"; // modern back icon
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditDoctor = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    qualifications: "",
    speciality: "",
  });

  // Fetch doctor details when page loads
  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("Unauthorized. Please log in.");

        const response = await axios.get(
          `http://localhost:8000/api/v1/doctors/${doctorId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setFormData({
          name: response.data.name || "",
          qualifications: response.data.qualifications || "",
          speciality: response.data.speciality || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load doctor details.", {
          autoClose: 3000,
          theme: "colored",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) throw new Error("Unauthorized. Please log in.");

      await axios.put(
        `http://localhost:8000/api/v1/doctors/${doctorId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Doctor updated successfully!", {
        autoClose: 3000,
        theme: "colored",
      });

      setTimeout(() => {
        navigate("/admin-dashboard/manage-doctors");
      }, 1500);
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        "Failed to update doctor. Please try again.";
      toast.error(msg, { autoClose: 3000, theme: "colored" });

      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
      <ToastContainer />

      {/* Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <Loader />
        </div>
      )}

      {/* Form card with back button inside */}
      <div className="relative">
        {/* Back Button inside form, top-left corner */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => navigate("/admin-dashboard/manage-doctors")}
            className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg shadow hover:bg-gray-300 transition"
          >
            <ArrowLeft className="w-3 h-3 mr-1" />
            Back
          </button>
        </div>

        <div className="text-2xl py-4 px-6 bg-gray-900 text-white text-center font-bold uppercase">
          Edit Doctor
        </div>

        <form className="py-4 px-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
              Doctor Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="qualifications" className="block text-gray-700 font-bold mb-2">
              Qualifications
            </label>
            <input
              id="qualifications"
              type="text"
              value={formData.qualifications}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="speciality" className="block text-gray-700 font-bold mb-2">
              Speciality
            </label>
            <input
              id="speciality"
              type="text"
              value={formData.speciality}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="flex items-center justify-center mb-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Doctor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDoctor;
