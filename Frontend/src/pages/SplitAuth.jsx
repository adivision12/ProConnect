import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuth } from "../Context/AuthProvider";
import Loading from "../Dashboard/Loading";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true); // login/signup toggle
  const [useOtp, setUseOtp] = useState(false); // login: password or otp
  const [authUser, setAuthUser] = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [signupOtpSent, setSignupOtpSent] = useState(false);

  const navigate = useNavigate();

  // ------------------- HANDLERS -------------------
  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        if (useOtp) {
          // LOGIN via OTP
          const res = await fetch("/api/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp, isLogin }),
          });
          const data = await res.json();
          if (data.success) {
            localStorage.setItem("user", JSON.stringify(data));
            setAuthUser(data);
            toast.success("OTP Login successful!");
            setTimeout(() => navigate("/dashboard"), 200);
          } else toast.error(data.msg || "OTP verification failed");
        } else {
          // LOGIN via password
          const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (data.success) {
            localStorage.setItem("user", JSON.stringify(data));
            setAuthUser(data);
            toast.success("Login successful!");
            setTimeout(() => navigate("/dashboard"), 200);
          } else toast.error(data.msg || "Login failed");
        }
      } else {
        // SIGNUP
        if (!signupOtpSent) return alert("Please verify your email OTP first");

        const res = await fetch("/api/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, otp }),
        });
        const data = await res.json();
        if (data.success) {
          localStorage.setItem("user", JSON.stringify(data));
          toast.success("Signup successful!");
          setIsLogin(true);
          setTimeout(() => navigate("/dashboard"), 200);
        } else toast.error(data.msg || "Signup failed");
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleSendOtp = async (forSignup = false) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password, isLogin }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("OTP sent to email!");
        if (isLogin) setOtpSent(true);
        else if (forSignup) setSignupOtpSent(true);
      } else toast.error(data.msg || "Failed to send OTP");
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  // ------------------- GOOGLE LOGIN -------------------
  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        // 1085194267725-bcqk06pboe7bfjab17ttj7aq7hm4839o.apps.googleusercontent.com
        client_id: "1085194267725-26qrpv843psqjg62l2319fsnli4iva6j.apps.googleusercontent.com",
        callback: handleGoogleLogin,
      });
      google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);

  const handleGoogleLogin = async (response) => {
    try {
      const res = await fetch("/api/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data));
        setAuthUser(data);
        toast.success("Google login successful!");
        setTimeout(() => navigate("/dashboard"), 200);
      } else {
        toast.error(data.msg || "Google login failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
    {isLoading && <Loading/>}
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login to ProConnect" : "Signup for ProConnect"}
        </h2>

        {/* LOGIN: password/otp toggle */}
        {isLogin && (
          <div className="flex justify-center gap-4 mb-6">
            <button
              type="button"
              onClick={() => setUseOtp(false)}
              className={`px-4 py-2 rounded-lg ${!useOtp ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => setUseOtp(true)}
              className={`px-4 py-2 rounded-lg ${useOtp ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              OTP
            </button>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 border rounded-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {!isLogin && !signupOtpSent && email && (
              <button
                type="button"
                onClick={() => handleSendOtp(true)}
                className="absolute right-2 top-2 bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
              >
                Send OTP
              </button>
            )}

            {!isLogin && signupOtpSent && email && (
              <button
                type="button"
                onClick={() => {
                  handleSendOtp(true);
                  setOtp("");
                }}
                className="absolute right-2 top-2 bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
              >
                Resend OTP
              </button>
            )}
          </div>

          {!isLogin && signupOtpSent && (
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-3 border rounded-lg"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          )}

          {(!isLogin || (isLogin && !useOtp)) && (
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!useOtp || !isLogin}
            />
          )}

          {isLogin && useOtp && otpSent && (
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-3 border rounded-lg"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          )}

          {isLogin && useOtp && !otpSent && email && (
            <button
              type="button"
              onClick={() => handleSendOtp(false)}
              className="w-full bg-green-600 text-white py-3 rounded-lg mt-2"
            >
              Send OTP
            </button>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            {isLogin ? (useOtp ? "Login with OTP" : "Login") : "Signup"}
          </button>
        </form>

        {/* GOOGLE LOGIN */}
        <div className="mt-6">
          <div className="flex items-center justify-center">
            <span className="text-gray-400">or continue with</span>
          </div>
          <div className="flex justify-center mt-4">
            <div id="googleBtn"></div>
          </div>
        </div>

        {/* SWITCH LOGIN/SIGNUP */}
        <p className="mt-6 text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setUseOtp(false);
              setOtpSent(false);
              setSignupOtpSent(false);
              setOtp("");
            }}
            className="text-blue-600 font-semibold"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div></>
  );
}
