"use client";
import React, { useState } from "react";
import { useAdminLoginMutation } from "@/app/features/Api/AuthApi";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/app/utils/page";
import Loading from "@/app/components/loading/page";
import { toast } from "react-hot-toast";

const AdminLogin = () => {
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validate = () => {
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Valid email is required";
    if (!password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await adminLogin({ email, password }).unwrap();
      setAuthToken(res.token);
      // Decode token to get role (client-side only, for UI logic)
      const payload = JSON.parse(atob(res.token.split(".")[1]));
      if (payload.role === "admin") {
        localStorage.setItem("role", "admin");
        toast.success("Login successful!");
        router.push("/Adminn/dashh");
      } else {
        toast.error("You are not admin!");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="flex items-center text-black justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">
          Admin Login
        </h2>
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-200"
              required
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-200"
              required
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          {/* forget password */}
          <div className="text-sm text-gray-600 text-center mt-4">
            <a href="/Adminn/forgotPassword" className="hover:underline">
              Forgot your password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
