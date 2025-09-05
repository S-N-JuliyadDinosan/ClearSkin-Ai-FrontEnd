import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { useRedirectWithLoader } from "./useRedirectWithLoader";
import { ArrowLeft } from "lucide-react"; // back icon

const severityColors = {
  none: "text-green-800 bg-green-100",
  mild: "text-yellow-800 bg-yellow-100",
  moderate: "text-orange-800 bg-orange-100",
  severe: "text-red-800 bg-red-100",
};

const AnalysisViewUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const historyId = queryParams.get("historyId");

  const { loading: redirectLoading, redirect } = useRedirectWithLoader();

  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!historyId) {
      navigate("/user-dashboard/analysis-history/user");
      return;
    }

    const fetchAnalysis = async () => {
      const startTime = Date.now();
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("No token found");

        const res = await fetch(
          `http://localhost:8000/api/v1/user/analysis/${encodeURIComponent(
            historyId
          )}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch analysis");

        const data = await res.json();
        setResultData(data);
      } catch (error) {
        console.error(error);
        navigate("/user-dashboard/analysis-history/user");
      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 1000 - elapsed);
        setTimeout(() => setLoading(false), remaining);
      }
    };

    fetchAnalysis();
  }, [historyId, navigate]);

  if (redirectLoading || loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <Loader />
      </div>
    );
  }

  const confidencePercent = (resultData.confidence * 100).toFixed(0);
  const cleanDiagnosis = resultData.diagnosis
    ?.replace(/\\n/g, "\n")
    ?.replace(/\\/g, "")
    ?.replace(/\*\*/g, "")
    ?.replace(/\b0\.(\d+)\b/g, (_, num) => {
      return `${Math.round(parseFloat("0." + num) * 100)}%`;
    });

  return (
    <div className="flex flex-col items-center justify-center p-10 min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 relative">
      
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => redirect("/user-dashboard/analysis-history/user", 500)}
          className="flex items-center text-gray-700 dark:text-white font-semibold hover:text-gray-900 dark:hover:text-gray-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
      </div>

      <div className="max-w-3xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 flex flex-col gap-6 transform transition hover:scale-[1.01]">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white text-center">
          Analysis Details
        </h2>

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

        <p
          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-5 text-center ${
            severityColors[resultData.severity?.toLowerCase()] ||
            "bg-gray-200 text-gray-700"
          }`}
        >
          {resultData.severity} Condition
        </p>

        <p className="text-gray-700 dark:text-gray-300 mb-5">
          <span className="font-semibold">Suggestion:</span>{" "}
          {resultData.suggestion}
        </p>

        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line bg-gray-50 dark:bg-gray-800 rounded-xl p-5 shadow-inner">
          <span className="font-semibold block mb-2 text-lg">Diagnosis:</span>
          <p className="leading-relaxed">{cleanDiagnosis}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisViewUser;
