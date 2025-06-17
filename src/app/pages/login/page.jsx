"use client";
import React, { useState } from "react";
import { useUserLoginMutation } from "@/app/features/Api/AuthApi";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/app/utils/page";
import { toast } from "react-hot-toast";

const Login = () => {
  const [login, { isLoading }] = useUserLoginMutation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validate = () => {
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      errs.email = "Valid email is required";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await login(form).unwrap();
      setAuthToken(res.token);
      toast.success("Login successful!");
      router.push("/");
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center text-black justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#FFCF67]">
          Login
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4"
        >
          {/* Email Input */}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFCF67] focus:outline-none transition duration-200"
              required
            />
          </div>

          {errors.email && (
            <p className="text-red-500">{errors.email}</p>
          )}

          {/* Password Input */}
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFCF67] focus:outline-none transition duration-200"
              required
            />
          </div>

          {errors.password && (
            <p className="text-red-500">{errors.password}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#FFCF67] text-white font-semibold rounded-lg hover:bg-[#FFB84D] transition duration-200 disabled:bg-[#FFB84D] disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <p className="text-sm text-gray-500 text-center mt-4">
            Don't have an account?{" "}
            <a
              href="/pages/signUp"
              className="text-[#FFCF67] hover:underline"
            >
              Register here
            </a>
          </p>
          <p className="text-sm text-gray-500 text-center mt-4">
            go back to{" "}
            <a href="/" className="text-[#FFCF67] hover:underline">
              Home
            </a>
            ?{" "}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
