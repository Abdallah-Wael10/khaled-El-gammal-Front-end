"use client";
import React, { useState } from "react";
import { useUserForgotPasswordMutation, useUserResetPasswordMutation } from "@/app/features/Api/AuthApi";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: code+new password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotPassword, { isLoading: isSending }] = useUserForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] = useUserResetPasswordMutation();
  const router = useRouter();

  // Step 1: Send email
  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    try {
      await forgotPassword({ email }).unwrap();
      toast.success("Reset code sent to your email");
      setStep(2);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send code");
    }
  };

  // Step 2: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!code || !newPassword) {
      toast.error("Please enter the code and new password");
      return;
    }
    try {
      await resetPassword({ email, code, newPassword }).unwrap();
      toast.success("Password reset successfully!");
      router.push("/pages/login");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#FFCF67]">
          Forgot Password
        </h2>
        {step === 1 && (
          <form onSubmit={handleSendCode} className="flex flex-col space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                Enter your email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFCF67] focus:outline-none transition duration-200"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#FFCF67] text-white font-semibold rounded-lg hover:bg-[#FFB84D] transition duration-200 disabled:bg-[#FFB84D] disabled:cursor-not-allowed"
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="flex flex-col space-y-4">
            <div>
              <label htmlFor="code" className="block text-gray-700 text-sm font-medium mb-2">
                Enter the code sent to your email
              </label>
              <input
                id="code"
                name="code"
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Enter code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFCF67] focus:outline-none transition duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-gray-700 text-sm font-medium mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFCF67] focus:outline-none transition duration-200"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#FFCF67] text-white font-semibold rounded-lg hover:bg-[#FFB84D] transition duration-200 disabled:bg-[#FFB84D] disabled:cursor-not-allowed"
              disabled={isResetting}
            >
              {isResetting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
        <div className="text-center mt-4">
          <a href="/pages/login" className="text-[#FFCF67] hover:underline">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
