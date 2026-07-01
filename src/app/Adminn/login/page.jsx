"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAdminLoginMutation } from "@/app/features/Api/AuthApi";
import { setAuthToken } from "@/app/utils/page";
import {
  AdminAuthShell,
  AdminButton,
  AdminField,
  adminInputClass,
} from "@/app/components/Admin/AdminComponents";

const AdminLogin = () => {
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validate = () => {
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid admin email.";
    if (!password) errs.password = "Password is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    try {
      const res = await adminLogin({ email, password }).unwrap();
      setAuthToken(res.token);
      const payload = JSON.parse(atob(res.token.split(".")[1]));
      if (payload.role === "admin") {
        localStorage.setItem("role", "admin");
        toast.success("Login successful.");
        router.push("/Adminn/dashh");
      } else {
        toast.error("This account does not have admin access.");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Login failed.");
    }
  };

  return (
    <AdminAuthShell
      title="Admin sign in"
      subtitle="Sign in to manage products, orders, requests, media, and users."
    >
      <form onSubmit={handleLogin} className="grid gap-4" noValidate>
        <AdminField label="Email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={adminInputClass}
            autoComplete="email"
            disabled={isLoading}
          />
        </AdminField>
        <AdminField label="Password" error={errors.password}>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={`${adminInputClass} pr-12`}
              autoComplete="current-password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--brand-olive)] transition-colors hover:bg-[#f2ead7]"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
        </AdminField>
        <AdminButton type="submit" icon={LogIn} loading={isLoading} className="w-full">
          Sign in
        </AdminButton>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eee2c9] pt-4 text-sm font-semibold">
          <Link
            href="/Adminn/forgotPassword"
            className="inline-flex min-h-11 items-center text-[var(--brand-olive)] transition-colors hover:text-[var(--brand-ink)] hover:underline"
          >
            Forgot password?
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center text-[var(--brand-muted)] transition-colors hover:text-[var(--brand-ink)] hover:underline"
          >
            Back to store
          </Link>
        </div>
      </form>
    </AdminAuthShell>
  );
};

export default AdminLogin;
