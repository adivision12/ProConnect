import React, { useState, useEffect } from "react";
import { useDataContext } from "../Context/DataProvider";
import toast from "react-hot-toast";
import { useAuth } from "../Context/AuthProvider";

export default function ResetPasswordModal() {
  const { setPassModal } = useDataContext();

  const [step, setStep] = useState(1); // 1: enter email, 2: verify OTP, 3: new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [timer, setTimer] = useState(0);
const [authUser]=useAuth();
  // Countdown for Resend OTP
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOTP = async () => {
    if (!email) return toast.error("Enter your email");
        if(email!=authUser?.user.email) return toast.error("Email doesn't match with looged in user");

    setIsSending(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email,isLogin:true }),
      });
      const data = await res.json();
      setIsSending(false);
      if (data.success) {
        toast.success("OTP sent to email");
        setStep(2);
        setTimer(60); // 60 seconds before user can resend
      } else {
        toast.error(data.msg);
      }
    } catch (err) {
      setIsSending(false);
      toast.error("Server error");
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) return toast.error("Enter OTP");
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp ,isLogin:true}),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("OTP verified");
        setStep(3);
      } else {
        toast.error(data.msg);
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword)
      return toast.error("Enter all fields");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Password reset successfully");
        setPassModal(false);
      } else {
        toast.error(data.msg);
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  const handleResendOTP = () => {
    if (timer > 0) return;
    handleSendOTP();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white  rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
          onClick={() => setPassModal(false)}
        >
          &times;
        </button>

        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 border rounded mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              onClick={handleSendOTP}
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
            <p className="text-sm text-gray-500 mb-2">
              OTP sent to <b>{email}</b>
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-2 border rounded mb-4"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 mb-2"
              onClick={handleVerifyOTP}
            >
              Verify OTP
            </button>
            <button
              className={`w-full p-2 rounded border ${
                timer > 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 border-blue-600 hover:bg-blue-50"
              }`}
              onClick={handleResendOTP}
              disabled={timer > 0}
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Set New Password</h2>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full p-2 border rounded mb-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full p-2 border rounded mb-4"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
}
