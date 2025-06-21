"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/app/utils/page";
import Loading from "@/app/components/loading/page";
import Nav2 from "@/app/components/Nav2/page";
import Link from "next/link";

const stats = [
  {
    title: "Total Products",
    value: "—",
    link: "/Adminn/Products",
    color: "bg-gradient-to-r from-[#FFCF67] to-[#FFD96B]",
    icon: "📦",
  },
  {
    title: "Total Orders",
    value: "—",
    link: "/Adminn/Orders",
    color: "bg-white",
    icon: "🧾",
  },
  {
    title: "Total Users",
    value: "—",
    link: "/Adminn/users",
    color: "bg-gradient-to-r from-[#FFCF67] to-[#FFB300]",
    icon: "👤",
  },
  
];

const Dashboard = () => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    let role = null;
    if (token) {
      try {
        // Decode JWT payload to get role
        const payload = JSON.parse(atob(token.split(".")[1]));
        role = payload.role;
      } catch {
        role = null;
      }
    }
    if (!token || role !== "admin") {
      router.replace("/Adminn/login");
    }
    setChecking(false);
  }, [router]);

  if (checking) return <Loading />;

  return (
    <div className="min-h-screen bg-[#FFFDF7]">
      <Nav2 />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#2B2201] text-center mb-2">
          Welcome to the Admin Dashboard
        </h1>
        <p className="text-center text-[#A4A4A4] text-lg mb-10">
          Here you can manage all aspects of your store: products, orders, users, and more.<br />
          Use the quick stats and navigation below to get an overview and jump to any section.
        </p>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 ">
          {stats.map((stat, idx) => (
            <Link
              key={stat.title}
              href={stat.link}
              className={`rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 ${stat.color}`}
            >
              <span className="text-4xl mb-2">{stat.icon}</span>
              <span className="text-lg font-semibold text-[#2B2201]">{stat.title}</span>
              <span className="text-2xl font-bold text-[#2B2201] mt-2">{stat.value}</span>
              <span className="mt-2 text-[#917405] text-sm underline">View</span>
            </Link>
          ))}
        </div>
        {/* Introduction Section */}
        <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#FFCF67] mb-2">Dashboard Overview</h2>
            <ul className="list-disc pl-6 text-[#2B2201] text-base space-y-2">
              <li>
                <b>Products:</b> Add, edit, or remove products. Track stock and discounts.
              </li>
              <li>
                <b>Orders:</b> View and manage all customer orders, update statuses, and track sales.
              </li>
              <li>
                <b>Users:</b> Manage registered users and their permissions.
              </li>
              <li>
                <b>Gallery:</b> Manage images and media for the store.
              </li>

            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
