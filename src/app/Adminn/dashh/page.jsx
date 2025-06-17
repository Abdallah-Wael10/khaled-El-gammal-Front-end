"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/app/utils/page";
import Loading from "@/app/components/loading/page";

const Dashboard = () => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.replace("/Adminn/login");
    }
    setChecking(false);
  }, [router]);

  if (checking) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mt-10">
        Welcome to Admin Dashboard
      </h1>
      {/* باقي محتوى الداشبورد */}
    </div>
  );
};

export default Dashboard;
