"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Edit3, GalleryHorizontalEnd, Plus, Trash2 } from "lucide-react";
import {
  useAddGalleryItemMutation,
  useDeleteGalleryItemMutation,
  useGetGalleryQuery,
  useUpdateGalleryItemMutation,
} from "@/app/features/Api/galleryApi";
import Loading from "@/app/components/loading/page";
import {
  AdminButton,
  AdminConfirmDialog,
  AdminEmptyState,
  AdminField,
  AdminModal,
  AdminPageHeader,
  AdminPanel,
  AdminShell,
  AdminToolbar,
  adminInputClass,
} from "@/app/components/Admin/AdminComponents";
import { useRequireAdmin } from "@/app/hooks/useRequireAdmin";

const GalleryAdmin = () => {
  const { checking } = useRequireAdmin();
  const { data: gallery = [], isLoading, refetch } = useGetGalleryQuery();
  const [addGalleryItem, { isLoading: adding }] = useAddGalleryItemMutation();
  const [deleteGalleryItem] = useDeleteGalleryItemMutation();
  const [updateGalleryItem, { isLoading: updating }] = useUpdateGalleryItemMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ title: "", image: null });

  const openModal = (item = null) => {
    setEditMode(Boolean(item));
    setCurrentItem(item);
    setForm({ title: item?.title || "", image: null });
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteGalleryItem(deleteTarget._id).unwrap();
      setDeleteTarget(null);
      refetch();
    } catch {
      alert("Error deleting gallery item");
    } finally {
      setDeleting(false);
    }
  };

  if (checking) return <Loading message="Checking admin access..." detail="Opening gallery management" />;

  return (
    <AdminShell title="Gallery">
      <AdminPageHeader
        eyebrow="Media"
        title="Gallery Management"
        description="Maintain public gallery images with clear titles and stable previews."
        actions={<AdminButton icon={Plus} onClick={() => openModal()}>Add image</AdminButton>}
      />

      <AdminPanel>
        <AdminToolbar>
          <div>
            <h3 className="text-sm font-bold text-[#211900]">Gallery Library</h3>
            <p className="text-sm text-[#695f4c]">Max image size: 10MB</p>
          </div>
          <div className="text-sm font-bold text-[#695f4c]">{gallery.length} items</div>
        </AdminToolbar>

        {isLoading ? (
          <Loading variant="inline" message="Loading gallery..." detail="Preparing media cards" />
        ) : gallery.length > 0 ? (
          <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {gallery.map((item) => (
              <motion.article
                key={item._id}
                layout
                whileHover={{ y: -3 }}
                className="overflow-hidden rounded-lg border border-[#e8dcc2] bg-[#fffdf8] shadow-sm"
              >
                <div className="relative aspect-[4/3] bg-[#f2ead7]">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.image}`}
                    alt={item.title || "Gallery image"}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-[#7a5f07]">
                    #{String(item._id).slice(-4)}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-1 min-h-6 text-base font-bold text-[#211900]">{item.title}</h3>
                  <div className="mt-4 flex gap-2">
                    <AdminButton variant="secondary" icon={Edit3} onClick={() => openModal(item)}>Edit</AdminButton>
                    <AdminButton variant="danger" icon={Trash2} onClick={() => setDeleteTarget(item)}>Delete</AdminButton>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <AdminEmptyState
            title="No gallery items found"
            description="Add the first gallery image to populate the public gallery."
            icon={GalleryHorizontalEnd}
            action={<AdminButton icon={Plus} onClick={() => openModal()}>Add image</AdminButton>}
          />
        )}
      </AdminPanel>

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editMode ? "Edit Gallery Item" : "Add Gallery Item"}
      >
        <form onSubmit={handleSubmit} className="grid gap-4">
          <AdminField label="Title">
            <input
              type="text"
              className={adminInputClass}
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              required
            />
          </AdminField>
          <AdminField label="Image">
            <input
              type="file"
              accept="image/*"
              className={adminInputClass}
              onChange={(event) => setForm({ ...form, image: event.target.files?.[0] || null })}
              required={!editMode}
            />
          </AdminField>
          <div className="flex justify-end gap-2">
            <AdminButton variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AdminButton>
            <AdminButton type="submit" loading={adding || updating}>{editMode ? "Save changes" : "Add image"}</AdminButton>
          </div>
        </form>
      </AdminModal>

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete gallery item?"
        message={`This will remove "${deleteTarget?.title || "this image"}" from the gallery.`}
        confirmLabel="Delete image"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </AdminShell>
  );
};

export default GalleryAdmin;
