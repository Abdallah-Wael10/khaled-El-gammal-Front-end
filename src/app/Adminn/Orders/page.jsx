"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { useGetAllCheckoutsQuery, useUpdateCheckoutStatusMutation } from "@/app/features/Api/CheckoutApi";
import Loading from "@/app/components/loading/page";
import {
  AdminButton,
  AdminEmptyState,
  AdminModal,
  AdminPageHeader,
  AdminPanel,
  AdminShell,
  AdminStatusBadge,
  AdminTable,
  adminTdClass,
  adminThClass,
  adminTableClass,
} from "@/app/components/Admin/AdminComponents";
import { useRequireAdmin } from "@/app/hooks/useRequireAdmin";

const Orders = () => {
  const { checking } = useRequireAdmin();
  const { data: orders = [], isLoading, error, refetch } = useGetAllCheckoutsQuery();
  const [updateStatus, { isLoading: updating }] = useUpdateCheckoutStatusMutation();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [orders]);

  const handleSetActive = async (order) => {
    if (!order || order.status === "active") return;
    try {
      await updateStatus({ id: order._id, status: "active" }).unwrap();
      refetch();
      setSelectedOrder({ ...order, status: "active" });
    } catch {
      alert("Failed to update status");
    }
  };

  if (checking) return <Loading message="Checking admin access..." detail="Opening order management" />;

  return (
    <AdminShell title="Orders">
      <AdminPageHeader
        eyebrow="Sales"
        title="Orders Management"
        description="Review checkout activity, customer details, ordered items, and fulfillment status."
      />

      <AdminPanel>
        {isLoading ? (
          <Loading variant="inline" message="Loading orders..." detail="Preparing order management" />
        ) : error ? (
          <AdminEmptyState title="Could not load orders" description="Refresh the page or try again once the API is available." icon={ShoppingBag} />
        ) : sortedOrders.length > 0 ? (
          <AdminTable>
            <table className={adminTableClass}>
              <thead>
                <tr>
                  <th className={adminThClass}>Customer</th>
                  <th className={adminThClass}>Contact</th>
                  <th className={adminThClass}>Date</th>
                  <th className={adminThClass}>Status</th>
                  <th className={adminThClass}>Total</th>
                  <th className={`${adminThClass} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map((order) => (
                  <motion.tr key={order._id} layout className="hover:bg-[#fffaf0]">
                    <td className={adminTdClass}>
                      <div className="font-bold">{order.userInfo?.name || "Unknown"}</div>
                      <div className="text-xs text-[#695f4c]">#{String(order._id).slice(-6)}</div>
                    </td>
                    <td className={adminTdClass}>
                      <div>{order.userInfo?.email || "-"}</div>
                      <div className="text-xs text-[#695f4c]">{order.userInfo?.phone || "-"}</div>
                    </td>
                    <td className={adminTdClass}>{order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}</td>
                    <td className={adminTdClass}><AdminStatusBadge status={order.status} /></td>
                    <td className={`${adminTdClass} font-bold tabular-nums`}>{order.total || 0} LE</td>
                    <td className={`${adminTdClass} text-right`}>
                      <AdminButton variant="secondary" onClick={() => setSelectedOrder(order)}>Details</AdminButton>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </AdminTable>
        ) : (
          <AdminEmptyState title="No orders found" description="Customer checkout orders will appear here." icon={ShoppingBag} />
        )}
      </AdminPanel>

      <AdminModal
        open={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title="Order Details"
        size="lg"
      >
        {selectedOrder && (
          <div className="grid gap-5">
            <div className="grid gap-3 rounded-lg border border-[#eee2c9] bg-[#fffdf8] p-4 sm:grid-cols-2">
              {[
                ["Client", selectedOrder.userInfo?.name],
                ["Email", selectedOrder.userInfo?.email],
                ["Phone", selectedOrder.userInfo?.phone],
                ["Country", selectedOrder.userInfo?.country],
                ["Governorate", selectedOrder.userInfo?.governorate],
                ["Address", selectedOrder.userInfo?.address],
                ["Apartment", selectedOrder.userInfo?.apartment],
                ["Payment", selectedOrder.paymentMethod],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#7a5f07]">{label}</p>
                  <p className="mt-1 break-words text-sm font-semibold text-[#211900]">{value || "-"}</p>
                </div>
              ))}
              <div className="sm:col-span-2">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#7a5f07]">Notes</p>
                <p className="mt-1 whitespace-pre-line break-words text-sm text-[#211900]">{selectedOrder.userInfo?.notes || "-"}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#eee2c9] p-4">
              <div>
                <p className="text-sm font-bold text-[#211900]">Status</p>
                <div className="mt-2"><AdminStatusBadge status={selectedOrder.status} /></div>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#695f4c]">Total</p>
                <p className="text-2xl font-bold tabular-nums text-[#211900]">{selectedOrder.total || 0} LE</p>
              </div>
              {selectedOrder.status !== "active" && (
                <AdminButton icon={CheckCircle2} loading={updating} onClick={() => handleSetActive(selectedOrder)}>
                  Mark as Active
                </AdminButton>
              )}
            </div>

            <div>
              <h4 className="text-sm font-bold text-[#211900]">Products</h4>
              <div className="mt-3 grid gap-3">
                {selectedOrder.items?.length ? (
                  selectedOrder.items.map((item, index) => (
                    <div key={`${item.title}-${index}`} className="flex gap-3 rounded-lg border border-[#eee2c9] p-3">
                      <Image
                        src={item.mainImage ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.mainImage}` : "/no-image.png"}
                        alt={item.title || "Product"}
                        width={92}
                        height={72}
                        className="h-[72px] w-[92px] rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-[#211900]">{item.title || "Product"}</p>
                        <p className="mt-1 text-sm text-[#695f4c]">
                          Qty: {item.quantity || 1}
                          {item.size ? ` | Size: ${item.size}` : ""}
                        </p>
                      </div>
                      <div className="font-bold tabular-nums">{(item.price || 0) * (item.quantity || 1)} LE</div>
                    </div>
                  ))
                ) : (
                  <AdminEmptyState title="No products in this order" icon={ShoppingBag} />
                )}
              </div>
            </div>
          </div>
        )}
      </AdminModal>
    </AdminShell>
  );
};

export default Orders;
