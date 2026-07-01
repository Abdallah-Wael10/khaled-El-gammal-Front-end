"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, RotateCcw } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAdminForgotPasswordMutation, useAdminResetPasswordMutation } from "@/app/features/Api/AuthApi";
import {
  AdminAuthShell,
  AdminButton,
  AdminField,
  adminInputClass,
} from "@/app/components/Admin/AdminComponents";

const AdminForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [forgotPassword, { isLoading: isSending }] = useAdminForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] = useAdminResetPasswordMutation();
  const router = useRouter();

  const handleSendCode = async (event) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrors({ email: "Enter a valid admin email." });
      return;
    }
    setErrors({});
    try {
      await forgotPassword({ email }).unwrap();
      toast.success("Reset code sent to your email.");
      setStep(2);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send code.");
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!code) nextErrors.code = "Reset code is required.";
    if (!newPassword || newPassword.length < 6) nextErrors.newPassword = "Password must be at least 6 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    try {
      await resetPassword({ email, code, newPassword }).unwrap();
      toast.success("Password reset successfully.");
      router.push("/Adminn/login");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <AdminAuthShell
      title="Reset Admin Password"
      subtitle={step === 1 ? "Enter the admin email to receive a reset code." : "Use the reset code and choose a new password."}
    >
      {step === 1 ? (
        <form onSubmit={handleSendCode} className="grid gap-4">
          <AdminField label="Admin email" error={errors.email}>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={adminInputClass}
              autoComplete="email"
            />
          </AdminField>
          <AdminButton type="submit" icon={Mail} loading={isSending} className="w-full">
            Send reset code
          </AdminButton>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="grid gap-4">
          <AdminField label="Reset code" error={errors.code}>
            <input
              type="text"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className={adminInputClass}
              autoComplete="one-time-code"
            />
          </AdminField>
          <AdminField label="New password" error={errors.newPassword}>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className={adminInputClass}
              autoComplete="new-password"
            />
          </AdminField>
          <AdminButton type="submit" icon={RotateCcw} loading={isResetting} className="w-full">
            Reset password
          </AdminButton>
        </form>
      )}
      <div className="mt-5">
        <Link href="/Adminn/login" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#6f5702] hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to login
        </Link>
      </div>
    </AdminAuthShell>
  );
};

export default AdminForgotPassword;
