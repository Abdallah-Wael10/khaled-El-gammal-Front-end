"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAdminRegisterMutation } from "@/app/features/Api/AuthApi";
import {
  AdminAuthShell,
  AdminButton,
  AdminField,
  adminInputClass,
} from "@/app/components/Admin/AdminComponents";

const AdminRegister = () => {
  const [adminRegister, { isLoading }] = useAdminRegisterMutation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validate = () => {
    const errs = {};
    if (!fullName.trim()) errs.fullName = "Full name is required.";
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid admin email.";
    if (!phone.match(/^[0-9]{10,15}$/)) errs.phone = "Phone must be 10-15 digits.";
    if (!password || password.length < 6) errs.password = "Password must be at least 6 characters.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegistration = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    try {
      await adminRegister({ fullName, email, password, phone }).unwrap();
      toast.success("Registration successful. Please login.");
      router.push("/Adminn/login");
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed.");
    }
  };

  return (
    <AdminAuthShell title="Create Admin Account" subtitle="Create a secured admin account for store operations.">
      <form onSubmit={handleRegistration} className="grid gap-4">
        <AdminField label="Full name" error={errors.fullName}>
          <input value={fullName} onChange={(event) => setFullName(event.target.value)} className={adminInputClass} disabled={isLoading} />
        </AdminField>
        <AdminField label="Email" error={errors.email}>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={adminInputClass} autoComplete="email" disabled={isLoading} />
        </AdminField>
        <AdminField label="Phone" error={errors.phone}>
          <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className={adminInputClass} autoComplete="tel" disabled={isLoading} />
        </AdminField>
        <AdminField label="Password" error={errors.password}>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className={adminInputClass} autoComplete="new-password" disabled={isLoading} />
        </AdminField>
        <AdminButton type="submit" icon={UserPlus} loading={isLoading} className="w-full">
          Create account
        </AdminButton>
      </form>
      <div className="mt-5">
        <Link href="/Adminn/login" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#6f5702] hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to login
        </Link>
      </div>
    </AdminAuthShell>
  );
};

export default AdminRegister;
