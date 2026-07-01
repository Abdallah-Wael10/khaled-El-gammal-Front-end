"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { toast } from "react-hot-toast";
import { useGetAllCheckoutsQuery, useUpdateCheckoutStatusMutation } from "@/app/features/Api/CheckoutApi";
import Loading from "@/app/components/loading/page";
import OrderStatusBadge from "@/app/components/Admin/OrderStatusBadge";
import {
  AdminButton,
  AdminConfirmDialog,
  AdminEmptyState,
  AdminModal,
  AdminPageHeader,
  AdminPanel,
  AdminShell,
  AdminTable,
  adminTdClass,
  adminThClass,
  adminTableClass,
} from "@/app/components/Admin/AdminComponents";
import { useRequireAdmin } from "@/app/hooks/useRequireAdmin";
import {
  ORDER_STATUSES,
  ORDER_STATUS_META,
  getStockConfirmationMessage,
  normalizeOrderStatus,
  requiresStockConfirmation,
} from "@/app/utils/orderStatus";

const STATUS_FILTERS = [
  { id: "all", label: "All" },
  ...ORDER_STATUSES.map((status) => ({
    id: status,
    label: ORDER_STATUS_META[status].label,
  })),
];

const PIPELINE_STATUSES = ["pending", "in_progress", "sold"];

function OrderStatusPipeline({ currentStatus }) {
  const normalized = normalizeOrderStatus(currentStatus);
  const currentIndex = PIPELINE_STATUSES.indexOf(normalized);

  return (
    <div className="grid gap-2">
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#7a5f07]">Fulfillment pipeline</p>
      <div className="flex flex-wrap items-center gap-2">
        {PIPELINE_STATUSES.map((status, index) => {
          const isComplete = currentIndex > index;
          const isCurrent = normalized === status;
          return (
            <React.Fragment key={status}>
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                  isCurrent
                    ? "bg-[#fff3cf] text-[#7a5f07] ring-2 ring-[#d8aa2e]"
                    : isComplete
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-[#f7f1e4] text-[#9b8b64]"
                }`}
              >
                {ORDER_STATUS_META[status].label}
              </span>
              {index < PIPELINE_STATUSES.length - 1 && (
                <span className="text-xs font-bold text-[#c4b48d]" aria-hidden="true">
                  →
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

const Orders = () => {
  const { checking } = useRequireAdmin();
  const { data: orders = [], isLoading, error, refetch } = useGetAllCheckoutsQuery();
  const [updateStatus, { isLoading: updating }] = useUpdateCheckoutStatusMutation();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [pendingStatus, setPendingStatus] = useState(null);

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return sortedOrders;
    return sortedOrders.filter((order) => normalizeOrderStatus(order.status) === statusFilter);
  }, [sortedOrders, statusFilter]);

  const applyStatusUpdate = async (order, nextStatus) => {
    if (!order) return;
    try {
      const result = await updateStatus({ id: order._id, status: nextStatus }).unwrap();
      const updatedOrder = result.order || { ...order, status: nextStatus, stockAdjusted: order.stockAdjusted };
      setSelectedOrder(updatedOrder);
      refetch();
      toast.success(result.stockMessage || result.message || "Order status updated");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    } finally {
      setPendingStatus(null);
    }
  };

  const handleStatusSelect = (order, nextStatus) => {
    if (!order || normalizeOrderStatus(order.status) === nextStatus) return;
    if (requiresStockConfirmation(nextStatus)) {
      setPendingStatus({ order, nextStatus });
      return;
    }
    applyStatusUpdate(order, nextStatus);
  };

  if (checking) return <Loading message="Checking admin access..." detail="Opening order management" />;

  return (
    <AdminShell title="Orders">
      <AdminPageHeader
        eyebrow="Sales"
        title="Orders Management"
        description="Review checkout activity, update fulfillment status, and keep product stock in sync."
      />

      <AdminPanel>
        <div className="flex flex-wrap gap-2 border-b border-[#eee2c9] p-4">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setStatusFilter(filter.id)}
              className={`min-h-9 rounded-full px-3 text-sm font-bold transition-colors ${
                statusFilter === filter.id
                  ? "bg-[#fff3cf] text-[#7a5f07] ring-1 ring-[#d8aa2e]"
                  : "bg-white text-[#695f4c] hover:bg-[#fffaf0]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <Loading variant="inline" message="Loading orders..." detail="Preparing order management" />
        ) : error ? (
          <AdminEmptyState title="Could not load orders" description="Refresh the page or try again once the API is available." icon={ShoppingBag} />
        ) : filteredOrders.length > 0 ? (
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
                {filteredOrders.map((order) => (
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
                    <td className={adminTdClass}>
                      <div className="flex flex-col gap-1">
                        <OrderStatusBadge status={order.status} />
                        {order.stockAdjusted && (
                          <span className="text-[11px] font-bold text-emerald-700">Stock updated</span>
                        )}
                      </div>
                    </td>
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
          <AdminEmptyState
            title="No orders found"
            description={statusFilter === "all" ? "Customer checkout orders will appear here." : "No orders match this status filter."}
            icon={ShoppingBag}
          />
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

            <div className="grid gap-4 rounded-lg border border-[#eee2c9] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[#211900]">Status</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <OrderStatusBadge status={selectedOrder.status} />
                    {selectedOrder.stockAdjusted && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                        Stock updated
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#695f4c]">Total</p>
                  <p className="text-2xl font-bold tabular-nums text-[#211900]">{selectedOrder.total || 0} LE</p>
                </div>
              </div>

              <OrderStatusPipeline currentStatus={selectedOrder.status} />

              <div className="grid gap-3 sm:grid-cols-2">
                {ORDER_STATUSES.map((status) => {
                  const isActive = normalizeOrderStatus(selectedOrder.status) === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      disabled={updating || isActive}
                      onClick={() => handleStatusSelect(selectedOrder, status)}
                      className={`rounded-lg border p-3 text-left transition-colors ${
                        isActive
                          ? "border-[#d8aa2e] bg-[#fff9ea]"
                          : "border-[#eee2c9] bg-white hover:border-[#d8aa2e] hover:bg-[#fffdf8]"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      <p className="text-sm font-bold text-[#211900]">{ORDER_STATUS_META[status].label}</p>
                      <p className="mt-1 text-xs leading-5 text-[#695f4c]">{ORDER_STATUS_META[status].description}</p>
                    </button>
                  );
                })}
              </div>
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

      <AdminConfirmDialog
        open={Boolean(pendingStatus)}
        title={`Mark as ${pendingStatus ? ORDER_STATUS_META[pendingStatus.nextStatus]?.label : ""}?`}
        message={pendingStatus ? getStockConfirmationMessage(pendingStatus.nextStatus) : ""}
        confirmLabel="Update status"
        loading={updating}
        onCancel={() => setPendingStatus(null)}
        onConfirm={() => pendingStatus && applyStatusUpdate(pendingStatus.order, pendingStatus.nextStatus)}
      />
    </AdminShell>
  );
};

export default Orders;
