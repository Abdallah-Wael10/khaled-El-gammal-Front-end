"use client";
import React, { useState, useEffect } from "react";
import { useGetCustomizationQuery, useUpdateCustomizationMutation } from "@/app/features/Api/CustomizeFormApi";
import Nav2 from "@/app/components/Nav2/page";
import { getAuthToken } from "@/app/utils/page";
import Loading from "@/app/components/loading/page";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CustomizeAdmin = () => {
  const { data, isLoading, error, refetch } = useGetCustomizationQuery();
  const [updateCustomization, { isLoading: updating }] = useUpdateCustomizationMutation();
  const [selectedLead, setSelectedLead] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();
  const token = getAuthToken();

  // Check for token and admin role
  useEffect(() => {
    if (!token) {
      router.push("/Adminn/login");
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

  const handleOpenLead = (lead) => {
    setSelectedLead(lead);
    setModalOpen(true);
  };

  const handleSetActive = async (lead) => {
    if (lead.status === "Active") return;
    try {
      await updateCustomization({
        id: lead._id,
        body: { status: "Active" },
        token,
      }).unwrap();
      refetch();
      setSelectedLead({ ...lead, status: "Active" });
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <div className="text-red-500 text-center mt-10">Error loading customize requests</div>;

  return (
    <div className="bg-gradient-to-br from-[#FFFDF7] via-[#FFF6D4] to-[#FFFCF2] min-h-screen text-black">
      <Nav2 />
      <main className="max-w-4xl mx-auto px-2 sm:px-4 py-6 sm:py-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFCF67] text-center mb-2 tracking-tight">
          Customize Requests
        </h1>
        <p className="text-center text-[#A4A4A4] text-base sm:text-lg mb-8 sm:mb-10">
          Manage all customize requests from users here.<br />
          Click any lead to view details and update status.
        </p>
        <div className="bg-white/90 rounded-2xl shadow-xl p-4 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#FFCF67] mb-4 sm:mb-6">All Requests</h2>
          {data && data.length > 0 ? (
            <ul className="divide-y divide-[#f3e6c2]">
              {data.map((lead) => (
                <li
                  key={lead._id}
                  className="flex flex-col md:flex-row md:items-center justify-between py-3 sm:py-4 px-1 sm:px-2 cursor-pointer hover:bg-[#FFF6D4]/70 rounded-xl transition-all duration-200 group gap-2"
                  onClick={() => handleOpenLead(lead)}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                    <span className="font-semibold text-[#2B2201] text-sm md:text-base truncate max-w-[140px] md:max-w-[180px]">
                      {lead.name}
                    </span>
                    <span className="md:ml-2 text-[#A4A4A4] text-xs md:text-sm truncate max-w-[120px]">{lead.email}</span>
                    <span className="md:ml-2 text-[#A4A4A4] text-xs md:text-sm">{lead.phone}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-1 md:mt-0">
                    {Array.isArray(lead.image) && lead.image.length > 0 && (
                      <div className="flex gap-1">
                        {lead.image.map((img, idx) => (
                          <Image
                            key={idx}
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${img}`}
                            width={36}
                            height={36}
                            alt="lead-img"
                            className="rounded-md object-cover border border-[#FFCF67]/40 w-[32px] h-[32px] md:w-[40px] md:h-[40px]"
                          />
                        ))}
                      </div>
                    )}
                    <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-bold shadow-sm ${lead.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {lead.status}
                    </span>
                    <button
                      className={`px-2 md:px-3 py-1 rounded-lg text-xs font-semibold shadow transition-all duration-200 ${
                        lead.status === "Active"
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-[#FFCF67] text-white hover:bg-[#FFD96B] hover:text-[#2B2201] active:scale-95"
                      }`}
                      disabled={lead.status === "Active" || updating}
                      onClick={e => {
                        e.stopPropagation();
                        handleSetActive(lead);
                      }}
                    >
                      Mark as Active
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-[#A4A4A4]">No customize requests found.</p>
          )}
        </div>
        {/* Pop-up Modal for Lead Details */}
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
              <h3 className="text-lg sm:text-xl font-bold text-[#2B2201] mb-2">Lead Details</h3>
              {selectedLead && (
                <div className="space-y-2 text-sm sm:text-base">
                  <div><b>Name:</b> {selectedLead.name}</div>
                  <div><b>Email:</b> {selectedLead.email}</div>
                  <div><b>Phone:</b> {selectedLead.phone}</div>
                  {Array.isArray(selectedLead.image) && selectedLead.image.length > 0 && (
                    <div className="flex flex-wrap gap-2 animate-fade-in mt-2">
                      {selectedLead.image.map((img, idx) => (
                        <Image
                          key={idx}
                          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${img}`}
                          width={120}
                          height={80}
                          alt={`lead-img-${idx}`}
                          className="rounded-lg object-cover border border-[#FFCF67]/40"
                        />
                      ))}
                    </div>
                  )}
                  <div><b>Comment:</b> {selectedLead.comment}</div>
                  <div>
                    <b>Status:</b>{" "}
                    <span className={`px-4 py-1 rounded-full text-xs font-bold shadow-sm ${selectedLead.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {selectedLead.status}
                    </span>
                  </div>
                  {selectedLead.status !== "Active" && (
                    <button
                      className="mt-4 px-4 py-2 rounded-lg  bg-[#FFCF67] text-white font-bold hover:bg-[#FFD96B] hover:text-[#2B2201] transition active:scale-95 w-full sm:w-auto"
                      onClick={() => handleSetActive(selectedLead)}
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

export default CustomizeAdmin;
