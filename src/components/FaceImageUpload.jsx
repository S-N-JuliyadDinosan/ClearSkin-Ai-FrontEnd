import React, { useRef, useState } from "react";
import axios from "axios";
import { useRedirectWithLoader } from "./useRedirectWithLoader";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import sampleFaceImage1 from '../assets/sampleFace1.jpg';
import sampleFaceImage2 from '../assets/sampleFace2.jpg';

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

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
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
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], image.name, { type: blob.type });
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      });
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select an image before uploading!", { position: "top-right", autoClose: 3000, theme: "colored" });
      return;
    }

    try {
      setUploading(true);
      const token = localStorage.getItem("jwtToken");
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) throw new Error("User email not found");

      const userResponse = await axios.get(`http://localhost:8000/api/v1/user/email?email=${userEmail}`, { headers: { Authorization: `Bearer ${token}` } });
      const userId = userResponse.data?.userId;
      if (!userId) throw new Error("Failed to fetch user ID");

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("userId", userId);

      const response = await axios.post("http://localhost:8000/api/v1/user/analysis", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });

      const resultData = response.data;

      setTimeout(() => {
        setUploading(false);
        toast.success("Image analyzed successfully!", { position: "top-right", autoClose: 3000, theme: "colored" });
        setTimeout(() => navigate("/face-result", { state: { resultData, imageUrl: previewUrl } }), 2000);
      }, 3000);
    } catch (error) {
      setUploading(false);
      console.error(error);
      toast.error("Failed to analyze image. " + (error.response?.data?.message || ""), { position: "top-right", autoClose: 3000, theme: "colored" });
    }
  };

  const isLoading = uploading || redirectLoading;

  return (
    <div className="dark:bg-gray-900 bg-gray-100 flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4 cursor-pointer" onClick={() => redirect("/", 1000, () => navigate("/"))}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM12 7a1 1 0 100 2 1 1 0 000-2zm0 4c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4z"/>
                <circle cx="18" cy="6" r="1" fill="currentColor"/>
              </svg>
              <span className="text-2xl font-bold text-white">ClearSkinAI</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Three-column layout */}
      <div className="flex flex-col md:flex-row justify-between items-start max-w-7xl mx-auto mt-20 px-4 space-y-6 md:space-y-0">
        {/* Left Sample Image */}
        <div className="flex flex-col items-center -ml-10 cursor-pointer" onClick={() => handleSampleClick(sampleImages[0])}>
          <span className="mb-2 text-gray-700 dark:text-gray-200 font-medium">Please upload like this</span>
          <img src={sampleImages[0].src} alt={sampleImages[0].name} className="w-80 h-80 object-cover rounded-md shadow-lg hover:shadow-2xl transition"/>
        </div>

        {/* Center File Upload Box */}
        <div className="flex-1 mx-12 w-full md:w-[650px]">
          {isLoading && <Loader />}
          <div className={`p-6 bg-white dark:bg-gray-800 rounded-md shadow-lg transition-opacity ${isLoading ? "opacity-30 pointer-events-none" : ""}`}>
            <h2 className="text-3xl font-semibold text-center mb-6 dark:text-white">File Upload</h2>

            {/* Drag & Drop Box */}
            <div className={`relative border-2 border-dashed rounded-md px-4 transition-colors flex justify-center items-center
              ${isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900" : "border-gray-300 dark:border-gray-600"}
              ${previewUrl ? "h-auto py-4" : "h-60 py-20"}`}
              onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>

              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} disabled={isLoading} />

              {!previewUrl && (
                <div className="text-center">
                  <svg className="mx-auto h-28 w-28 text-gray-400 dark:text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 17l-4 4m0 0l-4-4m4 4V3"/>
                  </svg>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Drag & Drop your files here or{" "}
                    <button type="button" onClick={handleUploadClick} disabled={isLoading} className="ml-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition">
                      Browse
                    </button>
                  </p>
                </div>
              )}

              {/* Preview Section inside the box */}
              {previewUrl && (
                <div className="flex flex-col items-center">
                  <img src={previewUrl} alt="Preview" className="mx-auto max-h-60 rounded-md shadow-md mb-4"/>
                  <button onClick={handleRemoveFile} disabled={isLoading} className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition">
                    Remove
                  </button>
                </div>
              )}
            </div>

            <button onClick={handleUploadSubmit} disabled={isLoading} className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-md w-full mt-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              Upload & Analyze
            </button>
          </div>
        </div>

        {/* Right Sample Image */}
        <div className="flex flex-col items-center -mr-10 cursor-pointer" onClick={() => handleSampleClick(sampleImages[1])}>
          <span className="mb-2 text-gray-700 dark:text-gray-200 font-medium">Please upload like this</span>
          <img src={sampleImages[1].src} alt={sampleImages[1].name} className="w-80 h-80 object-cover rounded-md shadow-lg hover:shadow-2xl transition"/>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default FaceImageUpload;
