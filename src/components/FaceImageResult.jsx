import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo_f.png";
import { useRedirectWithLoader } from "./useRedirectWithLoader";
import Loader from "./Loader";

const severityColors = {
  mild: "text-green-600 bg-green-100",
  moderate: "text-yellow-600 bg-yellow-100",
  severe: "text-red-600 bg-red-600",
};

const FaceImageResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loading: redirectLoading, redirect } = useRedirectWithLoader();
  const { resultData, imageUrl } = location.state || {};

  // Redirect if no data
  useEffect(() => {
    if (!resultData) {
      redirect("/face-upload", 2000, () => navigate("/face-upload", { replace: true }));
    }
  }, [resultData, navigate, redirect]);

  if (!resultData) return null;

  const confidencePercent = (resultData.confidence * 100).toFixed(0);
  const cleanDiagnosis = resultData.diagnosis
    ?.replace(/\\n/g, "\n")
    ?.replace(/\\/g, "")
    ?.replace(/\*\*/g, "")
    ?.replace(/\b0\.(\d+)\b/g, (_, num) => `${Math.round(parseFloat("0." + num) * 100)}%`);

  const handleDashboardRedirect = () => {
    const role = localStorage.getItem("role");
    if (role === "admin" || role === "staff") {
      redirect("/admin-dashboard", 2000, () => navigate("/admin-dashboard"));
    } else {
      redirect("/user-dashboard", 2000, () => navigate("/user-dashboard"));
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">

      {/* Loader Overlay */}
      {redirectLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <Loader />
        </div>
      )}

      {/* Main Content */}
      <div className={`${redirectLoading ? "filter blur-sm pointer-events-none" : ""}`}>
        {/* Header */}
        <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Left - Logo + Name */}
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => redirect("/", 2000, () => navigate("/"))}
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

              {/* Right - Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleDashboardRedirect}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-lg shadow hover:opacity-90 transition"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => redirect("/face-upload", 2000, () => navigate("/face-upload"))}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-800 text-white font-semibold rounded-lg shadow hover:opacity-90 transition"
                >
                  Reupload Image
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Body */}
        <div className="flex flex-col items-center justify-center p-10 flex-1">
          <div className="max-w-5xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 flex flex-col md:flex-row gap-10 transform transition hover:scale-[1.01]">
            {/* Left Side: Uploaded Image */}
            <div className="w-full md:w-1/2">
              <img
                src={imageUrl}
                alt="Uploaded"
                className="w-full rounded-2xl border shadow-md object-cover"
              />
            </div>

            {/* Right Side: Analysis Results */}
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                Skin Analysis Result
              </h2>

              {/* Confidence Progress Bar */}
              <div className="mb-5">
                <p className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                  Confidence Level: {confidencePercent}%
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-blue-500 transition-all"
                    style={{ width: `${confidencePercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Severity */}
              <p
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-5 ${
                  severityColors[resultData.severity?.toLowerCase()] ||
                  "bg-gray-200 text-gray-700"
                }`}
              >
                {resultData.severity} Condition
              </p>

              {/* Suggestion */}
              <p className="text-gray-700 dark:text-gray-300 mb-5">
                <span className="font-semibold">Suggestion:</span> {resultData.suggestion}
              </p>

              {/* Diagnosis */}
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line bg-gray-50 dark:bg-gray-800 rounded-xl p-5 shadow-inner">
                <span className="font-semibold block mb-2 text-lg">Diagnosis:</span>
                <p className="leading-relaxed">{cleanDiagnosis}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceImageResult;
