"use client";
import React, { useState } from "react";
import { useUserRegisterMutation } from "@/app/features/Api/AuthApi";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/app/utils/page";
import { toast } from "react-hot-toast";

const Register = () => {
  const [register, { isLoading }] = useUserRegisterMutation();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phone: "" });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Valid email is required";
    if (!form.phone.match(/^[0-9]{10,15}$/)) errs.phone = "Phone must be 10-15 digits";
    if (!form.password || form.password.length < 6) errs.password = "Password must be at least 6 chars";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await register(form).unwrap();
      setAuthToken(res.token);
      toast.success("Registration successful!");
      router.push("/pages/login");
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center text-black justify-center min-h-screen bg-gray-100 p-4">
      {/* Registration Card */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 sm:p-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6 text-[#FFCF67]">
          Register
        </h2>
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:text-[#FFCF67] focus:outline-none transition duration-200"
              required
            />
            {errors.fullName && <p className="text-red-500">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:text-[#FFCF67] focus:outline-none transition duration-200"
              required
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:text-[#FFCF67] focus:outline-none transition duration-200"
              required
            />
            {errors.phone && <p className="text-red-500">{errors.phone}</p>}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:text-[#FFCF67] focus:outline-none transition duration-200"
              required
            />
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#FFCF67] text-white font-semibold rounded-lg hover:bg-[#FFB84D] transition duration-200"
            disabled={isLoading}
            >
            {isLoading ? "Creating..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
