import React from "react";
import faceClear from '../assets/FaceClear.png';
import Loader from './Loader';
import { useRedirectWithLoader } from './useRedirectWithLoader';
import '../App.css'; 

const LandingPage = () => {
  const { loading, redirect } = useRedirectWithLoader();

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
            <li className="uppercase font-bold text-xs text-white cursor-pointer" onClick={() => redirect('/about')}>ABOUT</li>
            <li className="uppercase font-bold text-xs text-white cursor-pointer" onClick={() => redirect('/services')}>SERVICES</li>
            <li className="uppercase font-bold text-xs text-white cursor-pointer" onClick={() => redirect('/technologies')}>TECHNOLOGIES</li>
            <li className="uppercase font-bold text-xs text-white cursor-pointer" onClick={() => redirect('/products')}>Products</li>
            <li className="uppercase font-bold text-xs text-white cursor-pointer" onClick={() => redirect('/how-to')}>HOW TO!!!!</li>
          </ul>
        </nav>

        <div className="hidden sm:flex gap-3 md:gap-5 lg:gap-9">
          <button
            className="uppercase font-bold text-xs text-white border-2 border-white rounded-[40px] py-1 px-3 md:py-2 lg:py-4 md:px-4 lg:px-9"
            onClick={() => redirect('/login')}
          >
            LOGIN
          </button>
          <button
            className="uppercase font-bold text-xs rounded-[40px] py-1 px-3 md:py-2 lg:py-4 md:px-4 lg:px-9 text-[#302c42] bg-gradient-to-r from-[#8176AF] to-[#C0B7E8]"
            onClick={() => redirect('/register')}
          >
            REGISTER HERE
          </button>
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
              className="uppercase font-bold text-xs rounded-[40px] py-2 lg:py-4 px-4 lg:px-9 text-[#302c42] bg-gradient-to-r from-[#8176AF] to-[#C0B7E8] transform transition-transform duration-300 hover:scale-110"
              onClick={() => redirect('/face-upload', 1500)}
            >
              AI Skin Analysis
            </button>

            <div className="flex space-x-1 text-[#C0B7E8] font-bold text-4xl">
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
            <p className="text-sm mt-3">Union St, Seattle, WA 98101, United States</p>
          </div>
        </div>

        <span className="h-28 w-[1px] hidden sm:inline-block bg-[#C0B7E8]"></span>
        <div className="hidden sm:flex flex-1 gap-4 lg:gap-6">
          <svg width="51" height="51" viewBox="0 0 51 51" fill="none"></svg>
          <div className="text-white">
            <h2 className="text-2xl font-bold">Give Us a Call</h2>
            <p className="text-sm mt-3">(110) 1111-1010</p>
          </div>
        </div>

        <span className="hidden lg:inline-block h-28 w-[1px] bg-[#C0B7E8]"></span>
        <div className="hidden lg:flex flex-1 gap-4 lg:gap-6">
          <svg width="55" height="45" viewBox="0 0 55 45" fill="none"></svg>
          <div className="text-white">
            <h2 className="text-2xl font-bold">Send Us a Message</h2>
            <p className="text-sm mt-3">Contact@HydraVTech.com</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
