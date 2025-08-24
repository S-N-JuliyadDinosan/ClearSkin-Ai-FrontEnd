import React, { useRef, useState } from "react";
import axios from "axios";
import { useRedirectWithLoader } from "./useRedirectWithLoader";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FaceImageUpload = () => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { loading: redirectLoading, redirect } = useRedirectWithLoader();
  const navigate = useNavigate();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
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
      toast.error("Please select an image before uploading!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploading(true);
      const response = await axios.post(
        "http://localhost:8082/api/v1/user/analysis",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const resultData = response.data;
      setUploading(false);
      
      setTimeout(() => {
        toast.success("Image analyzed successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }, 500);

      // redirect to result page
      redirect("/face-result", 3000, () =>
        navigate("/face-result", {
          state: {
            resultData,
            imageUrl: URL.createObjectURL(selectedFile),
          },
        })
      );
    } catch (error) {
      setUploading(false);
      console.error(error);
      toast.error(
        "Failed to analyze image. " + (error.response?.data?.message || ""),
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        }
      );
    }
  };

  const isLoading = uploading || redirectLoading;

  return (
    <div className="dark:bg-gray-900 bg-gray-100 flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => {
                  redirect("/", 1000, () => navigate("/"));
                }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10
                     10-4.477 10-10S17.523 2 12 2zM12 7a1 1 0 100 2
                     1 1 0 000-2zm0 4c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4z"
                />
                <circle cx="18" cy="6" r="1" fill="currentColor" />
              </svg>
              <span className="text-2xl font-bold text-white">ClearSkinAI</span>
            </div>
          </div>
        </div>
      </nav>

      {/* File Upload Section */}
      <div className="flex-1 flex justify-center items-center">
        {isLoading && <Loader />}

        <div
          className={`max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-md shadow-lg transition-opacity ${
            isLoading ? "opacity-30 pointer-events-none" : ""
          }`}
        >
          <h2 className="text-3xl font-semibold text-center mb-6 dark:text-white">
            File Upload
          </h2>

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
              disabled={isLoading}
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
                    disabled={isLoading}
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
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-md w-full mt-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Upload & Analyze
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default FaceImageUpload;
