import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const severityColors = {
  mild: "text-green-600 bg-green-100",
  moderate: "text-yellow-600 bg-yellow-100",
  severe: "text-red-600 bg-red-100",
};

const FaceImageResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resultData, imageUrl } = location.state || {};

  // Redirect if no data
  useEffect(() => {
    if (!resultData) {
      navigate("/face-upload", { replace: true });
    }
  }, [resultData, navigate]);

  if (!resultData) return null;

  // format confidence as percentage
  const confidencePercent = (resultData.confidence * 100).toFixed(0);

  // clean up diagnosis text and convert decimals to percentages
const cleanDiagnosis = resultData.diagnosis
  ?.replace(/\\n/g, "\n")         // replace escaped newlines
  ?.replace(/\\/g, "")             // remove backslashes
  ?.replace(/\*\*/g, "")           // remove markdown-style **
  ?.replace(/\b0\.(\d+)\b/g, (_, num) => `${Math.round(parseFloat("0." + num) * 100)}%`);


  return (
    <div className="flex flex-col items-center justify-center p-10 min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
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
  );
};

export default FaceImageResult;
