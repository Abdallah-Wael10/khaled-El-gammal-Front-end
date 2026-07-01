"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useUserLoginMutation } from "@/app/features/Api/AuthApi";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/app/utils/page";
import { toast } from "react-hot-toast";
import {
  AuthButton,
  AuthField,
  AuthLink,
  UserAuthShell,
  authInputClass,
} from "@/app/components/Auth/AuthComponents";

const Login = () => {
  const [login, { isLoading }] = useUserLoginMutation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validate = () => {
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email address.";
    if (!form.password) errs.password = "Password is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    try {
      const res = await login(form).unwrap();
      setAuthToken(res.token);
      toast.success("Welcome back!");
      router.push("/");
    } catch (err) {
      toast.error(err?.data?.message || "Login failed. Check your email and password.");
    }
  };

  return (
    <UserAuthShell
      title="Sign in"
      subtitle="Access your account to shop handcrafted pieces and manage your experience."
      footer={
        <div className="flex flex-col gap-3 text-center text-sm text-[var(--brand-muted)] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:text-left">
          <p>
            New here?{" "}
            <AuthLink href="/pages/signUp" className="min-h-0 font-bold">
              Create an account
            </AuthLink>
          </p>
          <AuthLink href="/" className="justify-center sm:justify-start">
            Back to store
          </AuthLink>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        <AuthField label="Email" htmlFor="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={authInputClass}
            autoComplete="email"
            disabled={isLoading}
          />
        </AuthField>

        <AuthField label="Password" htmlFor="password" error={errors.password}>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              className={`${authInputClass} pr-12`}
              autoComplete="current-password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--brand-olive)] transition-colors hover:bg-[var(--brand-gold-soft)]"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </AuthField>

        <div className="flex justify-end">
          <Link
            href="/pages/forgotPassword"
            className="text-sm font-semibold text-[var(--brand-olive)] transition-colors hover:text-[var(--brand-ink)] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <AuthButton type="submit" icon={LogIn} loading={isLoading} className="w-full">
          Sign in
        </AuthButton>
      </form>
    </UserAuthShell>
  );
};

export default Login;
