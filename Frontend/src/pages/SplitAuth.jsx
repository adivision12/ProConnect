import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../Context/AuthProvider";
import toast from "react-hot-toast";
import logo from "../assets/logo2.png";
import Loading from "../Dashboard/Loading";

export default function SplitAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  function inputHandler(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
 const [isLoading, setIsLoading] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true)
    // console.log(formData)
    const endpoint = isLogin ? "/api/login" : "/api/register";
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log(data);
      setIsLoading(false);
      if (data.success) {
        if (isLogin) {
          setAuthUser(data);
          localStorage.setItem("auth", JSON.stringify(data));
          toast.success("Login successful!");
          setTimeout(() => navigate("/dashboard"), 200);
        } else {
          toast.success(data.msg || "Registered successfully!");
          setTimeout(() => setIsLogin(true), 300);
        }
      } else {
        toast.error(data.msg || "Something went wrong");
      }
    } catch (err) {
      toast.error("Server error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdfbfb] to-[#ebedee]">
      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-blue-700"> <img src={logo} alt="ProConnect Logo" className="h-12" /></h1>
        <button   onClick={() => setIsLogin(!isLogin)} className="bg-red-600 text-white text-sm md:text-lg px-2 md:px-6 py-1 rounded-full shadow hover:bg-red-700">
          Be a part
        </button>
      </div>
{isLoading && <Loading/>}
      {/* Auth Card */}
      <motion.div
        key={isLogin ? "login" : "signup"}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-[90%] md:w-[60%] lg:w-[50%] bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden mt-20"
      >
        {/* Left Panel */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-700 to-indigo-600 text-white p-8 flex-col justify-center items-center">
          <h2 className="text-3xl font-bold mb-3">
            {isLogin ? "Welcome Back!" : "Join Us Today!"}
          </h2>
          <p className="text-sm text-center mb-6">
            {isLogin
              ? "Log in and reconnect with your network."
              : "Sign up to explore real, authentic connections."}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="bg-white text-blue-700 px-5 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            {isLogin ? "Create Account" : "Back to Login"}
          </button>
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            {isLogin ? "Login" : "Sign Up"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
             
               
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={inputHandler}
                  className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={inputHandler}
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={inputHandler}
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className={`w-full ${
                isLogin ? "bg-blue-600" : "bg-blue-600"
              } text-white py-2 rounded-full hover:brightness-110 transition`}
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          {/* Small screen toggle */}
          <div className="text-center mt-4 md:hidden">
            <span className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-blue-700 font-semibold underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
