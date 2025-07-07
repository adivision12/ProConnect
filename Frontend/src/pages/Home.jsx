import React from "react";
import logo from "../assets/logo2.png";
import illustration from "../assets/illustration.png";
import { useNavigate } from "react-router";

export default function App() {
   const navigate=useNavigate();
  return (
    <div className="h-screen bg-white">
      {/* Navbar */}
      <header className="w-full  px-8 py-4 flex justify-end">
        <img src={logo} alt="ProConnect Logo" className="h-12" />
      </header>

      {/* Hero Section */}
      <main className="flex flex-col-reverse lg:flex-row items-center justify-between  md:px-20 py-10 max-w-7xl mx-auto">
        {/* Left Text Content */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight mb-4">
                     Build networks, not just profiles <br className="hidden md:block" />
            {/* Be Connected. */}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
           Success is best when shared — connect now.
           Real growth begins with real connections.
          </p>
          <button onClick={()=>navigate("/dashboard")} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition">
            Join Now
          </button>
        </div>

        {/* Right Illustration */}
        <div className="lg:w-1/3 mb-10 lg:mb-0 flex justify-center">
          <img
            src={illustration}
            alt="People illustration"
            className="w-full max-w-sm md:max-w-md lg:max-w-lg"
          />
        </div>
      </main>
    </div>
  );
}
