"use client";
import React, { useState , useEffect} from "react";
import { useGetBusinessQuery , useUpdateBusinessMutation } from "@/app/features/Api/BusinessFormApi";
import Nav2 from "@/app/components/Nav2/page";
import { getAuthToken } from "@/app/utils/page";
import Loading from "@/app/components/loading/page";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";


const BusinessAdmin = () => {
  const { data, isLoading, error, refetch } = useGetBusinessQuery();
  const [updateBusiness, { isLoading: updating }] = useUpdateBusinessMutation();
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
      await updateBusiness({
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
  if (error) return <div className="text-red-500 text-center mt-10">Error loading contact requests</div>;

  return (
    <div className="bg-white min-h-screen text-black">
      <Nav2 />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#FFCF67] text-center mb-2 tracking-tight">
          Business Requests
        </h1>
        <p className="text-center text-[#A4A4A4] text-lg mb-10">
          Manage all business requests from users here.<br />
          Click any lead to view details and update status.
        </p>
        <div className="bg-white/90 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-[#FFCF67] mb-6">All Requests</h2>
          {data && data.length > 0 ? (
            <ul className="divide-y divide-[#f3e6c2]">
              {data.map((lead) => (
                <li
                  key={lead._id}
                  className="flex flex-col md:flex-row md:items-center justify-between py-4 px-2 cursor-pointer hover:bg-[#FFF6D4]/70 rounded-xl transition-all duration-200 group"
                  onClick={() => handleOpenLead(lead)}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <span className="font-semibold text-[#2B2201] text-base md:text-lg">{lead.name}</span>
                    <span className="ml-0 md:ml-2 text-[#A4A4A4] text-sm">{lead.email}</span>
                    <span className="ml-0 md:ml-2 text-[#A4A4A4] text-sm">{lead.phone}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${lead.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {lead.status}
                    </span>
                    <button
                      className={`px-3 py-1 rounded-lg text-xs font-semibold shadow transition-all duration-200 ${
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
            <p className="text-center text-[#A4A4A4]">No contact requests found.</p>
          )}
        </div>
        {/* Pop-up Modal for Lead Details */}
        <Transition show={modalOpen} as={React.Fragment}>
          <Dialog as="div" className="fixed inset-0 z-50 flex items-center text-black justify-center" onClose={() => setModalOpen(false)}>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-[95vw] max-w-md mx-auto flex flex-col gap-4 animate-fade-in">
              <button
                className="absolute top-3 right-3 text-2xl font-bold text-[#FFCF67] hover:text-[#917405] transition"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-xl font-bold text-[#2B2201] mb-2">Lead Details</h3>
              {selectedLead && (
                <div className="space-y-3 break-words">
                  <div>
                    <b>Name:</b>
                    <div className="text-[#2B2201] font-medium break-words">{selectedLead.name}</div>
                  </div>
                  <div>
                    <b>Email:</b>
                    <div className="text-[#2B2201] font-medium break-all">{selectedLead.email}</div>
                  </div>
                  <div>
                    <b>Phone:</b>
                    <div className="text-[#2B2201] font-medium break-all">{selectedLead.phone}</div>
                  </div>
                  <div>
                    <b>Category:</b>
                    <div className="text-[#2B2201] font-medium break-words">{selectedLead.category}</div>
                  </div>
                  <div>
                    <b>Comment:</b>
                    <div className="text-[#2B2201] font-medium whitespace-pre-line break-words max-h-40 overflow-y-auto px-2 py-1 bg-[#FFF6D4]/60 rounded">
                      {selectedLead.comment}
                    </div>
                  </div>
                  <div>
                    <b>Status:</b>{" "}
                    <span className={`px-4 py-1 rounded-full text-xs font-bold shadow-sm ${selectedLead.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {selectedLead.status}
                    </span>
                  </div>
                  {selectedLead.status !== "Active" && (
                    <button
                      className="mt-4 px-4 py-2 rounded-lg cursor-pointer bg-[#FFCF67] text-white font-bold hover:bg-[#FFD96B] hover:text-[#2B2201] transition active:scale-95 w-full"
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

export default BusinessAdmin;
