import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import defaultUserImage from "../assets/defaultUser.jpg";
import NavLinkWithRedirectLoader from "./NavLinkWithRedirectLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; 

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("jwtToken");

  const toastOptions = {
    position: "top-right",
    autoClose: 3000,
    theme: "colored",
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/v1/doctors?page=${page}&size=${size}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDoctors(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      toast.error("Failed to fetch doctors", toastOptions);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size]);

  const confirmDelete = (doctor) => {
    setSelectedDoctor(doctor);
    setShowConfirm(true);
  };

  const handleDeleteDoctor = async () => {
    if (!selectedDoctor) return;
    setShowConfirm(false);
    try {
      setDeleteLoading(true);
      await axios.delete(
        `http://localhost:8000/api/v1/doctors/${selectedDoctor.doctorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Doctor deleted successfully", toastOptions);
      setSelectedDoctor(null);
      fetchDoctors();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete doctor",
        toastOptions
      );
      setShowConfirm(true);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <section className="py-10 bg-gray-50 dark:bg-gray-900 min-h-screen relative">
      <ToastContainer />

      {/* Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/70">
          <Loader />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirm && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowConfirm(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 z-50 text-center">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Delete Doctor</h2>
            <p className="text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedDoctor.name}</span>?
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
                onClick={handleDeleteDoctor}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <NavLinkWithRedirectLoader
            to="/admin-dashboard/manage-doctors/add"
            className="px-5 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            Add Doctor
          </NavLinkWithRedirectLoader>
        </div>

        {/* Doctors Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <div
                key={doctor.doctorId}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="p-6 flex flex-col items-center">
                  <img
                    src={defaultUserImage}
                    alt={doctor.name}
                    className="w-24 h-24 object-cover rounded-full shadow-md mb-4 border-4 border-gray-100 dark:border-gray-700"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {doctor.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-300 mt-1">
                    {doctor.qualifications}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {doctor.speciality}
                  </p>
                  <span className="mt-3 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                    ID: {doctor.doctorId}
                  </span>
                </div>
                <div className="border-t dark:border-gray-700 p-4 flex justify-center gap-4">
                <button
                    onClick={() => navigate(`/admin-dashboard/manage-doctors/edit/${doctor.doctorId}`)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
                >
                    Edit
                </button>
                <button
                    onClick={() => confirmDelete(doctor)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
                >
                    Delete
                </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && (
          <div className="flex justify-between items-center mt-10 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <label className="text-gray-700 dark:text-gray-300">
                Page Size:
              </label>
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="px-3 py-2 rounded-lg border dark:bg-gray-700 dark:text-white shadow-sm"
              >
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={12}>12</option>
                <option value={15}>15</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                disabled={page === 0}
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page + 1 >= totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages - 1))
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
              >
                Next
              </button>
              <span className="text-gray-700 dark:text-gray-300 ml-2">
                Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ManageDoctors;
