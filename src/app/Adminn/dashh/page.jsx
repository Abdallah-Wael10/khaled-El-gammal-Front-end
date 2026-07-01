"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { BriefcaseBusiness, Contact, Package, ShoppingBag, Sparkles, Users } from "lucide-react";
import { useGetProductsQuery } from "@/app/features/Api/ProductApi";
import { useGetAllCheckoutsQuery } from "@/app/features/Api/CheckoutApi";
import Loading from "@/app/components/loading/page";
import {
  AdminEmptyState,
  AdminMotionList,
  AdminPageHeader,
  AdminPanel,
  AdminShell,
  AdminStatCard,
  AdminStatusBadge,
  adminTdClass,
  adminThClass,
  adminTableClass,
} from "@/app/components/Admin/AdminComponents";
import { useRequireAdmin } from "@/app/hooks/useRequireAdmin";

const Dashboard = () => {
  const { checking, token } = useRequireAdmin();
  const [usersCount, setUsersCount] = useState(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const { data: products = [], isLoading: loadingProducts } = useGetProductsQuery();
  const { data: checkouts = [], isLoading: loadingCheckouts } = useGetAllCheckoutsQuery();

  useEffect(() => {
    if (!token || !baseUrl) return;

    const fetchUsersCount = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUsersCount(Array.isArray(data) ? data.length : data.count || 0);
      } catch {
        setUsersCount(0);
      }
    };

    fetchUsersCount();
  }, [baseUrl, token]);

  const stats = useMemo(() => {
    const pendingOrders = checkouts.filter((order) => order.status !== "active").length;
    const outOfStock = products.filter((product) => !product.inStock || Number(product.stock) <= 0).length;

    return [
      {
        label: "Products",
        value: loadingProducts ? "..." : products.length,
        href: "/Adminn/Products",
        icon: Package,
        tone: "gold",
      },
      {
        label: "Orders",
        value: loadingCheckouts ? "..." : checkouts.length,
        href: "/Adminn/Orders",
        icon: ShoppingBag,
        tone: "blue",
      },
      {
        label: "Pending Orders",
        value: loadingCheckouts ? "..." : pendingOrders,
        href: "/Adminn/Orders",
        icon: Sparkles,
        tone: "neutral",
      },
      {
        label: "Users",
        value: usersCount === null ? "..." : usersCount,
        href: "/Adminn/users",
        icon: Users,
        tone: "green",
      },
      {
        label: "Stock Alerts",
        value: loadingProducts ? "..." : outOfStock,
        href: "/Adminn/Products",
        icon: BriefcaseBusiness,
        tone: "neutral",
      },
    ];
  }, [checkouts, loadingCheckouts, loadingProducts, products, usersCount]);

  const recentOrders = useMemo(() => {
    return [...checkouts]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5);
  }, [checkouts]);

  if (checking) {
    return <Loading message="Checking admin access..." detail="Securing the admin workspace" />;
  }

  return (
    <AdminShell title="Dashboard">
      <AdminPageHeader
        eyebrow="Operations"
        title="Admin Dashboard"
        description="Track store health, jump into high-priority work, and manage the daily flow from one place."
        actions={
          <Link
            href="/Adminn/Products"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#c99a20] bg-[#d8aa2e] px-4 text-sm font-bold text-[#211900] transition-colors hover:bg-[#e5bb48]"
          >
            <Package className="h-4 w-4" aria-hidden="true" />
            Add product
          </Link>
        }
      />

      <AdminMotionList className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <AdminStatCard key={stat.label} {...stat} />
        ))}
      </AdminMotionList>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <AdminPanel>
          <div className="flex items-center justify-between gap-3 border-b border-[#eee2c9] p-4">
            <div>
              <h3 className="text-base font-bold text-[#211900]">Recent Orders</h3>
              <p className="text-sm text-[#695f4c]">Latest customer activity and status.</p>
            </div>
            <Link href="/Adminn/Orders">
              <span className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#d8ccb3] bg-white px-4 text-sm font-bold text-[#3c310f] transition-colors hover:border-[#c49a22] hover:bg-[#fff9ea]">
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                View all
              </span>
            </Link>
          </div>
          {loadingCheckouts ? (
            <div className="p-4">
              <Loading variant="inline" message="Loading orders..." detail="Preparing recent order activity" />
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className={adminTableClass}>
                <thead>
                  <tr>
                    <th className={adminThClass}>Customer</th>
                    <th className={adminThClass}>Date</th>
                    <th className={adminThClass}>Status</th>
                    <th className={adminThClass}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <motion.tr key={order._id} layout className="hover:bg-[#fffaf0]">
                      <td className={adminTdClass}>
                        <div className="font-bold">{order.userInfo?.name || "Unknown"}</div>
                        <div className="text-xs text-[#695f4c]">{order.userInfo?.email}</div>
                      </td>
                      <td className={adminTdClass}>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}</td>
                      <td className={adminTdClass}><AdminStatusBadge status={order.status} /></td>
                      <td className={`${adminTdClass} font-bold tabular-nums`}>{order.total || 0} LE</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <AdminEmptyState title="No orders yet" description="New checkout activity will appear here." icon={ShoppingBag} />
          )}
        </AdminPanel>

        <AdminPanel className="p-4">
          <h3 className="text-base font-bold text-[#211900]">Quick Actions</h3>
          <p className="mt-1 text-sm text-[#695f4c]">Common admin tasks for daily operations.</p>
          <div className="mt-4 grid gap-2">
            {[
              { href: "/Adminn/Products", label: "Manage products", icon: Package },
              { href: "/Adminn/Gallery", label: "Update gallery", icon: Sparkles },
              { href: "/Adminn/Business", label: "Review business leads", icon: BriefcaseBusiness },
              { href: "/Adminn/Customize", label: "Review customization", icon: Contact },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex min-h-12 items-center gap-3 rounded-lg border border-[#e8dcc2] bg-[#fffdf8] px-3 text-sm font-bold text-[#2d250d] transition hover:border-[#c99a20] hover:bg-[#fff7e4]"
                >
                  <Icon className="h-4 w-4 text-[#7a5f07]" aria-hidden="true" />
                  {action.label}
                </Link>
              );
            })}
          </div>
        </AdminPanel>
      </div>
    </AdminShell>
  );
};

export default Dashboard;
