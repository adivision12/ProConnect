import React from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import logo from "../assets/logo2.png";
import illustration from "../assets/illustration.png";
import { FaRobot, FaUsers, FaFileAlt } from "react-icons/fa";

export default function App() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaRobot className="h-12 w-12 text-blue-600" />,
      title: "AI Profile Enhancement",
      desc: "Get AI-driven suggestions to optimize your profile and get noticed."
    },
    {
      icon: <FaUsers className="h-12 w-12 text-green-600" />,
      title: "Smart Connections",
      desc: "Connect with professionals who truly match your career goals."
    },
    {
      icon: <FaFileAlt className="h-12 w-12 text-purple-600" />,
      title: "Resume & Skill Optimization",
      desc: "Boost your resume and skills with personalized AI recommendations."
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 font-sans">
      {/* Navbar */}
      <header className="w-full px-8 py-4 flex justify-between items-center shadow-md">
        <img src={logo} alt="ProConnect Logo" className="h-12" />
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white px-6 py-2 rounded-lg font-semibold shadow-lg transition duration-300"
        >
          Get Started
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 md:px-20 py-10 max-w-7xl mx-auto">
        {/* Left Text Content */}
        <motion.div
          className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-white leading-tight mb-4">
            Build Networks, Not Just Profiles
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6">
            Success is best when shared — connect now. Real growth begins with real connections.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition duration-300"
          >
            Join Now
          </motion.button>
        </motion.div>

        {/* Right Illustration */}
        <motion.div
          className="lg:w-1/3 flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={illustration}
            alt="People illustration"
            className="w-full max-w-sm md:max-w-md lg:max-w-lg"
          />
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            AI-Powered Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition duration-300"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-6 mt-12 text-center text-gray-600 dark:text-gray-400">
        &copy; {new Date().getFullYear()} ProConnect. All rights reserved.
      </footer>
    </div>
  );
}
