import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const FaceImageResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resultData, imageUrl } = location.state || {};

  // Redirect if no data is found (like pressing back or refresh)
  useEffect(() => {
    if (!resultData) {
      navigate("/face-upload", { replace: true });
    }
  }, [resultData, navigate]);

  if (!resultData) return null; // avoid flashing "No analysis data available."

  return (
    <div className="flex flex-col items-center justify-center p-8 dark:bg-gray-900 bg-gray-100 min-h-screen">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <img
          src={imageUrl}
          alt="Uploaded"
          className="w-full rounded-lg border mb-6"
        />
        <h2 className="text-2xl font-bold mb-2 dark:text-white">
          Skin Analysis Result
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Severity: <span className="font-semibold">{resultData.severity}</span>
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Suggestion: {resultData.suggestion}
        </p>
      </div>
    </div>
  );
};

export default FaceImageResult;
