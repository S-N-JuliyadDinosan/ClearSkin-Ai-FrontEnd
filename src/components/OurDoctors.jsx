import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import defaultUserImage from "../assets/defaultUser.jpg"; 

const OurDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDoctors = async () => {
    try {
      setLoading(true); // Show loader overlay
      const response = await axios.get(
        `http://localhost:8000/api/v1/doctors?page=${page}&size=${size}`
      );
      setDoctors(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);

      // Ensure loader stays for at least 3 seconds
      setTimeout(() => setLoading(false), 1000);
    } catch (error) {
      console.error("Failed to fetch doctors", error);
      setTimeout(() => setLoading(false), 1000);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [page, size]);

  // If loading, show only loader and nothing else
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
        <Loader />
      </div>
    );
  }

  return (
    <section className="py-15 bg-gray-100 dark:bg-gray-400 relative overflow-hidden min-h-screen">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-black sm:text-4xl xl:text-5xl">
            Meet Our Doctors
          </h2>
          <p className="max-w-xl mx-auto mt-5 text-lg font-normal text-gray-800 dark:text-gray-800">
            Our experienced dermatologists and skin specialists are here to help you achieve healthy skin.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.doctorId}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 flex flex-col items-center text-center transform transition hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={defaultUserImage}
                alt={doctor.name}
                className="w-24 h-24 object-cover rounded-full shadow-md mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-white">
                {doctor.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-300">{doctor.qualifications}</p>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{doctor.speciality}</p>
              <p className="text-gray-400 dark:text-gray-500 mt-2 text-sm">
                ID: {doctor.doctorId}
              </p>
            </div>
          ))}
        </div>

        {/* Pagination and Page Size */}
        <div className="flex justify-end items-center mt-8 gap-4">
          <label className="text-gray-700 dark:text-gray-300">Page Size:</label>
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="px-3 py-2 rounded-lg border dark:bg-gray-700 dark:text-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>

          <button
            disabled={page === 0}
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:opacity-90 disabled:opacity-50"
          >
            Previous
          </button>

          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:opacity-90 disabled:opacity-50"
          >
            Next
          </button>

          <span className="text-gray-700 dark:text-gray-300 ml-4">
            Page {page + 1} of {totalPages}
          </span>
        </div>
      </div>
    </section>
  );
};

export default OurDoctors;
