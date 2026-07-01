"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/app/utils/page";

export function useRequireAdmin() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const authToken = getAuthToken();
    let role = null;

    if (authToken) {
      try {
        role = JSON.parse(atob(authToken.split(".")[1]))?.role;
      } catch {
        role = null;
      }
    }

    if (!authToken || role !== "admin") {
      router.replace("/Adminn/login");
      setChecking(false);
      return;
    }

    setToken(authToken);
    setChecking(false);
  }, [router]);

  return { checking, token };
}
