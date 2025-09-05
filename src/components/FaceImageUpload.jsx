import React, { useRef, useState } from "react";
import axios from "axios";
import { useRedirectWithLoader } from "./useRedirectWithLoader";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft } from "lucide-react"; // Back icon
import sampleFaceImage1 from "../assets/sampleFace1.jpg";
import sampleFaceImage2 from "../assets/sampleFace2.jpg";
import logo from "../assets/logo_f.png";

const FaceImageUpload = () => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { loading: redirectLoading, redirect } = useRedirectWithLoader();
  const navigate = useNavigate();

  const sampleImages = [
    { id: 1, src: sampleFaceImage1, name: "Sample 1" },
    { id: 2, src: sampleFaceImage2, name: "Sample 2" },
  ];

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
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
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSampleClick = (image) => {
    fetch(image.src)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], image.name, { type: blob.type });
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      });
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select an image before uploading!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    try {
      setUploading(true);
      const token = localStorage.getItem("jwtToken");
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) throw new Error("User email not found");

      const userResponse = await axios.get(
        `http://localhost:8000/api/v1/user/email?email=${userEmail}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userId = userResponse.data?.userId;
      if (!userId) throw new Error("Failed to fetch user ID");

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("userId", userId);

      const response = await axios.post(
        "http://localhost:8000/api/v1/user/analysis",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resultData = response.data;

      setTimeout(() => {
        setUploading(false);
        toast.success("Image analyzed successfully!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
        setTimeout(
          () =>
            navigate("/face-result", {
              state: { resultData, imageUrl: previewUrl },
            }),
          2000
        );
      }, 3000);
    } catch (error) {
      setUploading(false);
      console.error(error);
      toast.error(
        "Failed to analyze image. " + (error.response?.data?.message || ""),
        {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        }
      );
    }
  };

  const isLoading = uploading || redirectLoading;

  return (
    <div className="dark:bg-gray-900 bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex flex-col min-h-screen">
      
      {/* Back Button */}
      <div className="absolute top-19 left-6 z-50">
        <button
          onClick={() => redirect("/", 500)}
          className="flex items-center bg-white/80 dark:bg-gray-800/80 px-3 py-2 rounded-full shadow hover:shadow-md text-gray-700 dark:text-white font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition transform hover:scale-105"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between h-16 items-center">
            <div
              className="flex items-center space-x-4 cursor-pointer"
              onClick={() => redirect("/", 1000, () => navigate("/"))}
            >
              <img
                src={logo}
                alt="ClearSkinAI Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="text-2xl font-bold text-gray-800 dark:text-white">
                ClearSkinAI
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Three-column layout */}
      <div className="flex flex-col md:flex-row justify-between items-start max-w-7xl mx-auto mt-16 px-6 space-y-10 md:space-y-0">
        
        {/* Left Sample Image */}
        <div
          role="button"
          tabIndex={0}
          className="flex flex-col items-center cursor-pointer bg-white/40 dark:bg-gray-800/40 p-4 rounded-2xl backdrop-blur-lg shadow-lg hover:shadow-2xl transition transform hover:scale-105 focus:ring-2 focus:ring-green-500"
          onClick={() => handleSampleClick(sampleImages[0])}
          onKeyDown={(e) => e.key === "Enter" && handleSampleClick(sampleImages[0])}
        >
          <span className="mb-2 text-gray-700 dark:text-gray-200 font-medium">
            Please upload like this
          </span>
          <img
            src={sampleImages[0].src}
            alt={sampleImages[0].name}
            className="w-72 h-72 object-cover rounded-xl shadow-md pointer-events-none"
          />
        </div>

        {/* Center File Upload Box */}
        <div className="flex-1 mx-6 w-full md:w-[650px]">
          {isLoading && <Loader />}
          <div
            className={`p-8 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl backdrop-blur-lg border border-gray-200 dark:border-gray-700 transition-opacity ${
              isLoading ? "opacity-30 pointer-events-none" : ""
            }`}
          >
            <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800 dark:text-white">
              Upload Your Face Image
            </h2>

            {/* Drag & Drop Box */}
            <div
              className={`relative border-2 border-dashed rounded-2xl px-4 transition-colors flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800
                ${
                  isDragging
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                    : "border-gray-300 dark:border-gray-600"
                }
                ${previewUrl ? "h-auto py-4" : "h-64 py-20"}`}
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

              {!previewUrl && (
                <div className="text-center">
                  <svg
                    className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-300 mb-4"
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
                  <p className="text-gray-600 dark:text-gray-400">
                    Drag & Drop your image here
                  </p>
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    disabled={isLoading}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold rounded-lg shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition transform hover:scale-105"
                  >
                    Browse Files
                  </button>
                </div>
              )}

              {/* Preview Section */}
              {previewUrl && (
                <div className="flex flex-col items-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="mx-auto max-h-60 rounded-xl shadow-lg mb-4"
                  />
                  <button
                    onClick={handleRemoveFile}
                    disabled={isLoading}
                    className="px-5 py-2 bg-red-600 text-white font-medium rounded-lg shadow hover:bg-red-700 transition"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleUploadSubmit}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-lg w-full mt-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition transform hover:scale-105"
            >
              Upload & Analyze
            </button>
          </div>
        </div>

        {/* Right Sample Image */}
        <div
          role="button"
          tabIndex={0}
          className="flex flex-col items-center cursor-pointer bg-white/40 dark:bg-gray-800/40 p-4 rounded-2xl backdrop-blur-lg shadow-lg hover:shadow-2xl transition transform hover:scale-105 focus:ring-2 focus:ring-green-500"
          onClick={() => handleSampleClick(sampleImages[1])}
          onKeyDown={(e) => e.key === "Enter" && handleSampleClick(sampleImages[1])}
        >
          <span className="mb-2 text-gray-700 dark:text-gray-200 font-medium">
            Please upload like this
          </span>
          <img
            src={sampleImages[1].src}
            alt={sampleImages[1].name}
            className="w-72 h-72 object-cover rounded-xl shadow-md pointer-events-none"
          />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default FaceImageUpload;
