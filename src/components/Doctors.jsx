import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import defaultUserImage from "../assets/defaultUser.jpg";
import { useRedirectWithLoader } from "./useRedirectWithLoader";

const OurDoctors = () => {
  const { loading, redirect } = useRedirectWithLoader(); // ✅ Using redirect hook
  const [doctors, setDoctors] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/doctors?page=${page}&size=${size}`
      );
      setDoctors(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch doctors", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [page, size]);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 min-h-screen relative">
      {/* Loader overlay */}
      {loading && <Loader />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <button
          onClick={() => redirect("/", 1000)} // ✅ Loader before redirect
          className="mb-8 px-4 py-2 bg-gray-800 text-white rounded-md shadow hover:bg-gray-700 transition-colors"
        >
          &larr; Back
        </button>

        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Meet Our Doctors
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Our experienced dermatologists and skin specialists are here to help you achieve healthy, glowing skin.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <div
              key={doctor.doctorId}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              <img
                src={defaultUserImage}
                alt={doctor.name}
                className="w-28 h-28 rounded-full object-cover shadow-md mb-4 border-2 border-gray-200 dark:border-gray-700"
              />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                {doctor.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{doctor.qualifications}</p>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{doctor.speciality}</p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center mt-10 gap-4">
          <label className="text-gray-700 dark:text-gray-300 font-medium">Page Size:</label>
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="px-3 py-2 rounded-md border dark:bg-gray-700 dark:text-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>

          <button
            disabled={page === 0}
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            className="px-4 py-2 bg-gray-800 text-white rounded-md shadow hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            Previous
          </button>

          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
            className="px-4 py-2 bg-gray-800 text-white rounded-md shadow hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            Next
          </button>

          <span className="text-gray-700 dark:text-gray-300 ml-4 font-medium">
            Page {page + 1} of {totalPages}
          </span>
        </div>
      </div>
    </section>
  );
};

export default OurDoctors;
