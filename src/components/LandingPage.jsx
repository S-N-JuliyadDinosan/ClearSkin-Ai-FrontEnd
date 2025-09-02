import React from "react";
import faceClear from '../assets/FaceClear.png';
import Loader from './Loader';
import { useRedirectWithLoader } from './useRedirectWithLoader';
import '../App.css'; 
import jwt_decode from "jwt-decode";

const LandingPage = () => {
  const { loading, redirect } = useRedirectWithLoader();

  // ✅ Check if user logged in
  const token = localStorage.getItem("jwtToken");
  let role = null;

  if (token) {
    try {
      const decoded = jwt_decode(token);
      role = decoded.role || "USER";
    } catch (e) {
      console.error("Invalid token:", e);
    }
  }

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userEmail");
    redirect("/", 1000, () => window.location.reload()); // refresh to reset UI
  };

  const handleDashboard = () => {
    if (role === "ADMIN") {
      redirect("/admin-dashboard", 1000);
    } else {
      redirect("/user-dashboard", 1000);
    }
  };

  return (
    <section className="bg-[#302c42] overflow-hidden pb-9 px-4 md:px-8 relative">
      {/* Loader Overlay */}
      {loading && <Loader />}

      <header className="flex mx-auto justify-between items-center max-w-[1300px] py-4">
        <div className="flex items-center gap-3">
          <svg className="w-10 md:w-16 lg:w-24 h-10 md:h-16 lg:h-24" viewBox="0 0 102 103" fill="none"></svg>
          <svg className="w-8 md:w-12 lg:w-20 leading-5 md:h-7 lg:h-12" viewBox="0 0 76 46" fill="none"></svg>
        </div>

        {/* Navigation Links */}
        <nav className="hidden sm:inline-block">
          <ul className="flex gap-3 md:gap-5 lg:gap-10">
            <li className="uppercase font-bold text-s text-white cursor-pointer" onClick={() => redirect('/about')}>ABOUT</li>
            <li className="uppercase font-bold text-s text-white cursor-pointer" onClick={() => redirect('/services')}>SERVICES</li>
            <li className="uppercase font-bold text-s text-white cursor-pointer" onClick={() => redirect('/technologies')}>TECHNOLOGIES</li>
            <li className="uppercase font-bold text-s text-white cursor-pointer" onClick={() => redirect('/products')}>Products</li>
            <li className="uppercase font-bold text-s text-white cursor-pointer" onClick={() => redirect('/how-to')}>HOW TO!!!!</li>
          </ul>
        </nav>

        {/* ✅ Auth buttons */}
        <div className="hidden sm:flex gap-3 md:gap-5 lg:gap-9">
          {!token ? (
            <>
              <button
                className="uppercase font-bold text-s text-white border-2 border-white rounded-[40px] py-1 px-3 md:py-2 lg:py-4 md:px-4 lg:px-9"
                onClick={() => redirect('/login')}
              >
                LOGIN
              </button>
              <button
                className="uppercase font-bold text-s rounded-[40px] py-1 px-3 md:py-2 lg:py-4 md:px-4 lg:px-9 text-[#302c42] bg-gradient-to-r from-[#8176AF] to-[#C0B7E8]"
                onClick={() => redirect('/register')}
              >
                REGISTER HERE
              </button>
            </>
          ) : (
            <>
              <button
                className="uppercase font-bold text-s text-white border-2 border-white rounded-[40px] py-1 px-3 md:py-2 lg:py-4 md:px-4 lg:px-9"
                onClick={handleDashboard}
              >
                Go to Dashboard
              </button>
              <button
                className="uppercase font-bold text-s rounded-[40px] py-1 px-3 md:py-2 lg:py-4 md:px-4 lg:px-9 text-[#302c42] bg-gradient-to-r from-red-500 to-pink-500"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>

        <button className="sm:hidden inline-block">
          <svg width="33" height="26" viewBox="0 0 33 26" fill="none"></svg>
        </button>
      </header>
      
      {/* Hero Section */}
      <section className="relative flex flex-col-reverse md:flex-row mx-auto justify-between items-center gap-9 md:gap-4 max-w-[1300px] py-4 my-12">
        <div className="md:w-[520px] z-20 -translate-y-4">
          <h1 className="text-3xl md:text-[36px] lg:text-[46px] leading-[56px] text-white font-bold">
            <span className="text-[#C0B7E8]">Discover </span>Your True
            <span className="text-[#C0B7E8]"> Skin Journey</span>
          </h1>

          <p className="text-base text-white mt-4 md:mt-9 mb-10 md:mb-16">
            Track your skin’s daily changes with smart AI insights. 
            Upload your face scan and let our system monitor pimples, 
            improvements, and overall clarity helping you stay confident 
            with real-time progress updates.
          </p>

          <div className="flex gap-6 sm:gap-10">
              <button
                className="uppercase font-bold text-lg md:text-xl rounded-[60px] py-4 px-12
                          bg-gradient-to-r from-[#A398F0] to-[#C0B7E8] text-[#1F1F1F]
                          shadow-[0_8px_20px_rgba(0,0,0,0.25)] 
                          hover:shadow-[0_12px_30px_rgba(163,152,240,0.7)]
                          hover:translate-y-[-3px] transition-all duration-400 ease-out
                          ring-1 ring-white/20 hover:ring-white/40
                          animate-glow"
                onClick={() => redirect('/face-upload', 1500)}
              >
                AI Skin Analysis
              </button>

              <div className="flex space-x-1 text-[#C0B7E8] font-bold text-6xl">
                <span className="animate-[arrowBlink_1.5s_linear_infinite]">&lt;</span>
                <span className="animate-[arrowBlink_1.5s_linear_infinite_0.3s]">&lt;</span>
                <span className="animate-[arrowBlink_1.5s_linear_infinite_0.6s]">&lt;</span>
              </div>

              <style jsx>{`
                @keyframes arrowBlink {
                  0% { opacity: 0.2; transform: translateX(0); }
                  50% { opacity: 1; transform: translateX(-6px); }
                  100% { opacity: 0.2; transform: translateX(0); }
                }

                @keyframes glow {
                  0%, 100% {
                    box-shadow: 0 0 15px rgba(163,152,240,0.6), 0 0 30px rgba(163,152,240,0.3);
                  }
                  50% {
                    box-shadow: 0 0 25px rgba(163,152,240,0.9), 0 0 50px rgba(163,152,240,0.5);
                  }
                }

                .animate-glow {
                  animation: glow 2s infinite alternate;
                }
              `}</style>
            </div>

        </div>

        <div className="p-4 z-20 bg-black rounded-[100px] md:rounded-bl-[200px] lg:rounded-bl-[250px] bg-opacity-20 flex items-center justify-center overflow-hidden h-[550px] max-w-[500px] -translate-y-3">
          <img
            className="w-full h-full object-cover rounded-[80px] shadow-2xl transform scale-110 translate-x-2"
            src={faceClear}
            alt="Clear Skin Girl"
          />
        </div>
      </section>

      {/* Contact Info Cards */}
      <div className="flex relative z-30 justify-center sm:justify-between gap-5 items-center mt-6 mx-auto max-w-[1300px] rounded-[90px] py-3 px-3 sm:p-8 lg:p-14 bg-gradient-to-r from-[#211E2E] via-[#3A3456] to-[#211E2E]">
        <div className="flex sm:flex-1 gap-4 lg:gap-6">
          <svg width="42" height="63" viewBox="0 0 42 63" fill="none"></svg>
          <div className="text-white">
            <h2 className="hidden sm:inline-block text-2xl font-bold">Pay Us a Visit</h2>
            <p className="text-sm mt-3">Jaffna 4000, Srilanka</p>
          </div>
        </div>

        <span className="h-28 w-[1px] hidden sm:inline-block bg-[#C0B7E8]"></span>
        <div className="hidden sm:flex flex-1 gap-4 lg:gap-6">
          <svg width="51" height="51" viewBox="0 0 51 51" fill="none"></svg>
          <div className="text-white">
            <h2 className="text-2xl font-bold">Give Us a Call</h2>
            <p className="text-sm mt-3">(+94) 76-647-6294</p>
          </div>
        </div>

        <span className="hidden lg:inline-block h-28 w-[1px] bg-[#C0B7E8]"></span>
        <div className="hidden lg:flex flex-1 gap-4 lg:gap-6">
          <svg width="55" height="45" viewBox="0 0 55 45" fill="none"></svg>
          <div className="text-white">
            <h2 className="text-2xl font-bold">Send Us a Message</h2>
            <p className="text-sm mt-3">Contact : juliyad.samuel@gmail.com</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
