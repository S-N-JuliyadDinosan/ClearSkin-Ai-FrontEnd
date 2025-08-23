import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirect
import axios from "axios";

const FaceImageUpload = () => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate(); // Initialize navigation

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    // Optional: add userId if needed
    // formData.append("userId", 123);

    try {
      const response = await axios.post(
        "http://localhost:8082/api/v1/user/analysis",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Response example: { severity: "...", suggestion: "...", analysisTime: "..." }
      const resultData = response.data;

      // Navigate to result page and pass data via state
      navigate("/face-result", { state: { resultData, imageUrl: URL.createObjectURL(selectedFile) } });
    } catch (error) {
      console.error(error);
      alert("Failed to analyze image. " + (error.response?.data?.message || ""));
    }
  };

  return (
    <div className="dark:bg-gray-900 bg-gray-100 flex justify-center items-center h-screen">
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-md shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-6 dark:text-white">File Upload</h2>

        <div
          className={`relative border-2 border-dashed rounded-md px-6 py-8 text-center transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
              : "border-gray-300 dark:border-gray-600"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <svg
            className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 17l-4 4m0 0l-4-4m4 4V3"
            />
          </svg>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedFile ? (
              <>
                Selected file: {selectedFile.name}{" "}
                <button
                  onClick={handleRemoveFile}
                  className="ml-2 text-red-500 underline text-xs"
                >
                  Remove
                </button>
              </>
            ) : (
              <>
                Drag & Drop your files here or{" "}
                <span
                  onClick={handleUploadClick}
                  className="cursor-pointer text-blue-500 hover:underline"
                >
                  browse
                </span>
              </>
            )}
          </p>
        </div>

        <button
          onClick={handleUploadSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md w-full mt-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-500 dark:focus:ring-opacity-50"
        >
          Upload & Analyze
        </button>
      </div>
    </div>
  );
};

export default FaceImageUpload;
