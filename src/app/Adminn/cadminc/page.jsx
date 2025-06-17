"use client";
import React, { useState } from "react";
import { useAdminRegisterMutation } from "@/app/features/Api/AuthApi";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/loading/page";
import { toast } from "react-hot-toast";

const AdminRegister = () => {
  const [adminRegister, { isLoading }] = useAdminRegisterMutation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validate = () => {
    const errs = {};
    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Valid email is required";
    if (!phone.match(/^[0-9]{10,15}$/)) errs.phone = "Phone must be 10-15 digits";
    if (!password || password.length < 6) errs.password = "Password must be at least 6 chars";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await adminRegister({ fullName, email, password, phone }).unwrap();
      toast.success("Registration successful! Please login.");
      router.push("/Adminn/login");
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="flex items-center text-black justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">
          Admin Register
        </h2>
        <form onSubmit={handleRegistration} className="flex flex-col space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-gray-700 text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-200"
              required
              disabled={isLoading}
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-200"
              required
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-200"
              required
              disabled={isLoading}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-200"
              required
              disabled={isLoading}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
