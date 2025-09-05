import React from "react";
import { ArrowLeft } from "lucide-react"; // modern icon set
import NavLinkWithRedirectLoader from "./NavLinkWithRedirectLoader";

const HowToDo = () => {
  return (
    <section className="py-15 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[1200px] h-[1200px] bg-gradient-to-r from-purple-400 via-blue-400 to-green-300 opacity-10 rounded-full filter blur-3xl pointer-events-none"></div>

      {/* 🔙 Back Button with redirect loader */}
      <div className="absolute top-6 left-6 z-20">
        <NavLinkWithRedirectLoader to="/" delay={1500}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </NavLinkWithRedirectLoader>
      </div>

      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl xl:text-5xl">
            How does ClearSkinAI work?
          </h2>
          <p className="max-w-xl mx-auto mt-5 text-lg font-normal text-gray-600 dark:text-gray-300">
            ClearSkinAI provides AI-driven acne analysis, helping you monitor, understand, and improve your skin condition over time.
          </p>

          {/* Watch Tutorial Button */}
          <a
            href="https://www.youtube.com/watch?v=O3fQWC9TmAc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-8 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-lg
                       hover:shadow-2xl transform transition-all duration-300 hover:scale-105"
          >
            Watch Tutorial
          </a>
        </div>

        {/* Steps Section */}
        <div className="flex flex-col items-center max-w-md mx-auto mt-12 lg:mt-21 lg:flex-row lg:max-w-none gap-8 lg:gap-6">
          {/* Step 1 */}
          <StepBox
            number="1"
            gradient="from-purple-500 to-indigo-500"
            title="Upload Your Face Scan"
            text="Simply upload clear images of your face. Our AI will securely process the images to analyze your acne severity."
          />

          {/* Step 2 */}
          <StepBox
            number="2"
            gradient="from-green-400 to-blue-500"
            title="AI Analysis & Diagnosis"
            text="Our advanced AI model evaluates your acne severity, identifies patterns, and provides a detailed diagnosis of your current skin condition."
          />

          {/* Step 3 */}
          <StepBox
            number="3"
            gradient="from-pink-400 to-red-500"
            title="Track Your Progress"
            text="Visit your dashboard to track your acne condition over time. See if your skin is improving or worsening and get insights to maintain clear skin."
          />
        </div>
      </div>
    </section>
  );
};

// ✅ Reusable Step Box
const StepBox = ({ number, gradient, title, text }) => (
  <div className="relative flex-1 w-full overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl
                  transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
    <div className="py-10 px-8 text-center">
      <div
        className={`inline-flex items-center justify-center w-12 h-12 text-lg font-bold text-white bg-gradient-to-r ${gradient} rounded-full animate-pulse`}
      >
        {number}
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mt-4 dark:text-white">
        {title}
      </h3>
      <p className="mt-3 text-gray-800 dark:text-gray-300">{text}</p>
    </div>
  </div>
);

export default HowToDo;
