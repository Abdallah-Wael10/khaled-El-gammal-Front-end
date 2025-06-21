"use client";
import React, { useState, useEffect } from 'react';
import Nav2 from "@/app/components/Nav2/page";
import { getAuthToken } from "@/app/utils/page";
import { useRouter } from "next/navigation";
import {
  useGetGalleryQuery,
  useAddGalleryItemMutation,
  useDeleteGalleryItemMutation,
  useUpdateGalleryItemMutation,
} from '@/app/features/Api/galleryApi';
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import Loading from '@/app/components/loading/page';

const GalleryAdmin = () => {
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

  const { data: gallery = [], isLoading, refetch } = useGetGalleryQuery();
  const [addGalleryItem, { isLoading: adding }] = useAddGalleryItemMutation();
  const [deleteGalleryItem] = useDeleteGalleryItemMutation();
  const [updateGalleryItem, { isLoading: updating }] = useUpdateGalleryItemMutation();



  // State for add/edit modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [form, setForm] = useState({ title: "", image: null });

  // Open modal for add/edit
  const openModal = (item = null) => {
    setEditMode(!!item);
    setCurrentItem(item);
    setForm({
      title: item?.title || "",
      image: null,
    });
    setModalOpen(true);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    if (form.image) formData.append("image", form.image);

    try {
      if (editMode && currentItem) {
        await updateGalleryItem({ id: currentItem._id, formData }).unwrap();
      } else {
        await addGalleryItem(formData).unwrap();
      }
      setModalOpen(false);
      setForm({ title: "", image: null });
      setCurrentItem(null);
      refetch();
    } catch {
      alert("Error saving gallery item");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteGalleryItem(id).unwrap();
      refetch();
    } catch {
      alert("Error deleting gallery item");
    }
  };
  if (isLoading) return <Loading />;

  return (
    <div className="bg-gradient-to-br from-[#FFFDF7] via-[#FFF6D4] to-[#FFFCF2] min-h-screen text-black">
      <Nav2 />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#FFCF67] drop-shadow mb-1 max-[600px]:w-full max-[600px]:text-center max-[600px]:text-[20px]">Gallery Management</h1>
            <div className="flex flex-wrap gap-3 items-center text-[#917405] font-semibold text-sm max-[600px]:justify-center ">
              <span>Max image size: <span className="text-[#FFCF67] font-bold">10MB</span></span>
              <span className="hidden md:inline">|</span>
              <span>You have <span className="text-[#FFCF67] font-bold">{gallery.length}</span> items</span>
            </div>
          </div>
          <button
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#FFCF67] to-[#FFD96B] text-white font-bold shadow hover:from-[#FFD96B] hover:to-[#FFCF67] hover:text-[#2B2201] transition active:scale-95"
            onClick={() => openModal()}
          >
            + Add New
          </button>
        </div>
        <div className="bg-white/90 rounded-2xl shadow-xl p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <span className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FFCF67] mb-4"></span>
              <div className="text-[#FFCF67] font-bold text-lg">Loading gallery...</div>
            </div>
          ) : gallery && gallery.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {gallery.map((item) => (
                <div
                  key={item._id}
                  className="bg-[#FFFDF7] rounded-xl shadow-lg p-4 flex flex-col items-center group transition-all duration-200 hover:shadow-2xl hover:ring-2 hover:ring-[#FFCF67]/60"
                >
                  <div className="relative w-full flex items-center justify-center mb-3">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.image}`}
                      alt={item.title}
                      width={260}
                      height={180}
                      priority
                      className="rounded-lg object-cover border border-[#FFCF67]/30 shadow-md w-full h-44"
                    />
                    <span className="absolute top-2 right-2 bg-white/80 text-[#FFCF67] text-xs font-bold px-2 py-0.5 rounded shadow">
                      #{item._id.slice(-4)}
                    </span>
                  </div>
                  <div className="font-semibold text-[#2B2201] text-lg mb-2 text-center truncate w-full">{item.title}</div>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="px-4 py-1 rounded-lg bg-gradient-to-r from-[#FFCF67] to-[#FFD96B] text-white font-bold shadow hover:from-[#FFD96B] hover:to-[#FFCF67] hover:text-[#2B2201] transition active:scale-95"
                      onClick={() => openModal(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-1 rounded-lg bg-gradient-to-r from-red-400 to-red-600 text-white font-bold shadow hover:scale-105 hover:from-red-500 hover:to-red-700 transition-all duration-150"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-[#A4A4A4] text-lg py-16">No gallery items found.</div>
          )}
        </div>
        {/* Modal for Add/Edit */}
        <Transition show={modalOpen} as={React.Fragment}>
          <Dialog as="div" className="fixed inset-0 z-50 flex items-center justify-center" onClose={() => setModalOpen(false)}>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-[95vw] max-w-md mx-auto flex flex-col gap-4 animate-fade-in">
              <button
                className="absolute top-3 right-3 text-2xl font-bold text-[#FFCF67] hover:text-[#917405] transition"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-xl font-bold text-[#2B2201] mb-2 text-center">{editMode ? "Edit Gallery Item" : "Add New Gallery Item"}</h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="font-semibold text-[#2B2201]">
                  Title:
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border-2 border-[#FFCF67] rounded-lg focus:ring-2 focus:ring-[#FFCF67] outline-none"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </label>
                <label className="font-semibold text-[#2B2201]">
                  Image:
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full mt-1"
                    onChange={e => setForm({ ...form, image: e.target.files[0] })}
                    required={!editMode}
                  />
                </label>
                <button
                  type="submit"
                  className="mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#FFCF67] to-[#FFD96B] text-white font-bold hover:from-[#FFD96B] hover:to-[#FFCF67] hover:text-[#2B2201] transition active:scale-95"
                  disabled={adding || updating}
                >
                  {adding || updating ? "Saving..." : editMode ? "Save Changes" : "Add"}
                </button>
              </form>
            </div>
          </Dialog>
        </Transition>
      </main>
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.25s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97);}
          to { opacity: 1; transform: scale(1);}
        }
      `}</style>
    </div>
  );
};

export default GalleryAdmin;
