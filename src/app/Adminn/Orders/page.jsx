"use client";
import React, { useState, useEffect } from "react";
import { useGetAllCheckoutsQuery, useUpdateCheckoutStatusMutation } from "@/app/features/Api/CheckoutApi";
import Nav2 from "@/app/components/Nav2/page";
import { getAuthToken } from "@/app/utils/page";
import Loading from "@/app/components/loading/page";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Orders = () => {
  const { data: orders, isLoading, error, refetch } = useGetAllCheckoutsQuery();
  const [updateStatus, { isLoading: updating }] = useUpdateCheckoutStatusMutation();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();
  const token = getAuthToken();

  // Redirect if not admin
  useEffect(() => {
    if (!token) {
      router.replace("/Adminn/login");
      return;
    }
    let role = null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.role;
    } catch {
      role = null;
    }
    if (role !== "admin") {
      router.replace("/Adminn/login");
    }
  }, [token, router]);

  const handleOpenOrder = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleSetActive = async (order) => {
    if (order.status === "active") return;
    try {
      await updateStatus({
        id: order._id,
        status: "active",
      }).unwrap();
      refetch();
      setSelectedOrder({ ...order, status: "active" });
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <div className="text-red-500 text-center mt-10">Error loading orders</div>;

  return (
    <div className="bg-gradient-to-br from-[#FFFDF7] via-[#FFF6D4] to-[#FFFCF2] min-h-screen text-black">
      <Nav2 />
      <main className="max-w-6xl mx-auto px-2 sm:px-4 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2B2201] text-center mb-2 tracking-tight">
          Orders Management
        </h1>
        <p className="text-center text-[#A4A4A4] text-base sm:text-lg mb-8 sm:mb-10">
          Review all orders, see client details, products, and update order status.
        </p>
        <div className="bg-white/90 rounded-2xl shadow-xl p-4 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#FFCF67] mb-4 sm:mb-6">All Orders</h2>
          {orders && orders.length > 0 ? (
            <ul className="divide-y divide-[#f3e6c2]">
              {orders.map((order) => (
                <li
                  key={order._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-3 sm:py-4 px-1 sm:px-2 cursor-pointer hover:bg-[#FFF6D4]/70 rounded-xl transition-all duration-200 group gap-2"
                  onClick={() => handleOpenOrder(order)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-semibold text-[#2B2201] text-sm sm:text-base md:text-lg truncate max-w-[140px] sm:max-w-[180px]">
                      {order.userInfo?.name || "Unknown"}
                    </span>
                    <span className="sm:ml-2 text-[#A4A4A4] text-xs sm:text-sm truncate max-w-[120px]">{order.userInfo?.email}</span>
                    <span className="sm:ml-2 text-[#A4A4A4] text-xs sm:text-sm">{order.userInfo?.phone}</span>
                    <span className="sm:ml-2 text-[#A4A4A4] text-xs sm:text-sm">
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 sm:mt-0">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-sm ${order.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {order.status}
                    </span>
                    <span className="font-bold text-[#FFCF67] text-sm sm:text-base">{order.total} LE</span>
                    <button
                      className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-semibold shadow transition-all duration-200 ${
                        order.status === "active"
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-[#FFCF67] text-white hover:bg-[#FFD96B] hover:text-[#2B2201] active:scale-95"
                      }`}
                      disabled={order.status === "active" || updating}
                      onClick={e => {
                        e.stopPropagation();
                        handleSetActive(order);
                      }}
                    >
                      Mark as Active
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-[#A4A4A4]">No orders found.</p>
          )}
        </div>
        {/* Pop-up Modal for Order Details */}
        <Transition show={modalOpen} as={React.Fragment}>
          <Dialog as="div" className="fixed inset-0 z-50 flex items-center text-black justify-center" onClose={() => setModalOpen(false)}>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
            <div
              className="relative z-10 bg-white rounded-2xl shadow-2xl p-4 sm:p-8 w-[98vw] max-w-lg sm:max-w-2xl mx-auto flex flex-col gap-4 animate-fade-in"
              style={{ maxHeight: "90vh", overflowY: "auto" }}
            >
              <button
                className="sticky top-0 left-full float-right text-2xl font-bold text-[#FFCF67] hover:text-[#917405] transition bg-white z-10"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
                style={{ alignSelf: "flex-end" }}
              >
                &times;
              </button>
              <h3 className="text-lg sm:text-xl font-bold text-[#2B2201] mb-2">Order Details</h3>
              {selectedOrder && (
                <div className="space-y-2 text-sm sm:text-base">
                  <div><b>Client Name:</b> {selectedOrder.userInfo?.name}</div>
                  <div><b>Email:</b> {selectedOrder.userInfo?.email}</div>
                  <div><b>Phone:</b> {selectedOrder.userInfo?.phone}</div>
                  <div><b>Country:</b> {selectedOrder.userInfo?.country}</div>
                  <div><b>Governorate:</b> {selectedOrder.userInfo?.governorate}</div>
                  <div><b>Address:</b> {selectedOrder.userInfo?.address}</div>
                  <div><b>Apartment:</b> {selectedOrder.userInfo?.apartment}</div>
                  <div><b>Notes:</b> {selectedOrder.userInfo?.notes}</div>
                  <div><b>Order Date:</b> {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : ""}</div>
                  <div><b>Status:</b>{" "}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${selectedOrder.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div><b>Total:</b> <span className="font-bold text-[#FFCF67]">{selectedOrder.total} LE</span></div>
                  <div><b>Payment Method:</b> {selectedOrder.paymentMethod}</div>
                  <div className="mt-3">
                    <b>Products:</b>
                    <div className="flex flex-col gap-3 mt-2">
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 border-b border-gray-100 pb-3">
                            <Image
                              src={
                                item.mainImage
                                  ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.mainImage}`
                                  : "/no-image.png"
                              }
                              alt={item.title || "Product"}
                              width={120}
                              height={80}
                              className="rounded-lg object-cover border border-[#FFCF67]/30 w-[90px] h-[70px] sm:w-[120px] sm:h-[80px]"
                            />
                            <div className="flex-1 text-center sm:text-left">
                              <div className="font-semibold text-[#FFCF67] truncate">{item.title}</div>
                              <div className="text-gray-700 font-medium">
                                <span>{item.price} LE</span>
                              </div>
                              <div className="text-xs text-gray-500">
                                Qty: {item.quantity} {item.size && <>| Size: {item.size}</>}
                              </div>
                            </div>
                            <div className="font-bold text-black text-sm">
                              {item.price * item.quantity} LE
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-[#A4A4A4]">No products in this order.</span>
                      )}
                    </div>
                  </div>
                  {selectedOrder.status !== "active" && (
                    <button
                      className="mt-4 px-4 py-2 rounded-lg bg-[#FFCF67] text-white font-bold hover:bg-[#FFD96B] hover:text-[#2B2201] transition active:scale-95 w-full sm:w-auto"
                      onClick={() => handleSetActive(selectedOrder)}
                      disabled={updating}
                    >
                      {updating ? "Updating..." : "Mark as Active"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </Dialog>
        </Transition>
      </main>
    </div>
  );
};

export default Orders;
