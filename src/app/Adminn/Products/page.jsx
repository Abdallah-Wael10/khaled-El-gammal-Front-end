"use client";

import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Edit3, Loader2, Package, Plus, Settings2, Trash2, Upload } from "lucide-react";
import {
  useCreateShippingMutation,
  useDeleteShippingMutation,
  useGetShippingQuery,
  useUpdateShippingMutation,
} from "@/app/features/Api/ShippingApi";
import {
  useAddProductImageMutation,
  useAddProductMutation,
  useDeleteProductImageMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useReplaceProductImageMutation,
  useUpdateProductMutation,
} from "@/app/features/Api/ProductApi";
import Loading from "@/app/components/loading/page";
import {
  AdminButton,
  AdminConfirmDialog,
  AdminEmptyState,
  AdminField,
  AdminModal,
  AdminPageHeader,
  AdminPanel,
  AdminSearch,
  AdminShell,
  AdminStatusBadge,
  AdminToolbar,
  adminInputClass,
} from "@/app/components/Admin/AdminComponents";
import { useRequireAdmin } from "@/app/hooks/useRequireAdmin";
import {
  MAX_GALLERY_IMAGES,
  compressImageIfNeeded,
  useObjectUrl,
  validateImageFile,
} from "@/app/utils/imageUtils";
import { getSellingPrice } from "@/app/utils/pricing";

const emptyForm = {
  title: "",
  description: "",
  price: "",
  discountPrice: "",
  inStock: true,
  category: "",
  stock: "",
  sizes: [],
  mainImage: null,
  images: [],
};

const Products = () => {
  const { checking } = useRequireAdmin();
  const { data: products = [], isLoading, refetch } = useGetProductsQuery();
  const [addProduct, { isLoading: adding }] = useAddProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [addProductImage] = useAddProductImageMutation();
  const [replaceProductImage] = useReplaceProductImageMutation();
  const [deleteProductImage] = useDeleteProductImageMutation();
  const { data: shippingData, isLoading: shippingLoading, refetch: refetchShipping } = useGetShippingQuery();
  const [createShipping, { isLoading: creatingShipping }] = useCreateShippingMutation();
  const [updateShipping, { isLoading: updatingShipping }] = useUpdateShippingMutation();
  const [deleteShipping, { isLoading: deletingShipping }] = useDeleteShippingMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [shippingInput, setShippingInput] = useState("");
  const imagesInputRef = useRef(null);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch = !query || [product.title, product.category].some((value) => String(value || "").toLowerCase().includes(query));
      const matchesStock = showInStockOnly ? product.inStock : true;
      return matchesSearch && matchesStock;
    });
  }, [products, search, showInStockOnly]);

  const openModal = (product = null) => {
    setEditMode(Boolean(product));
    setCurrentProduct(product);
    setForm({
      title: product?.title || "",
      description: product?.description || "",
      price: product?.price || "",
      discountPrice: product?.discountPrice || "0",
      inStock: product?.inStock ?? true,
      category: product?.category || "",
      stock: product?.stock || "",
      sizes: product?.sizes ? [...product.sizes] : [],
      mainImage: null,
      images: [],
    });
    setModalOpen(true);
  };

  const resetForm = () => {
    setModalOpen(false);
    setForm(emptyForm);
    setCurrentProduct(null);
    setEditMode(false);
  };

  const handleAddSize = (size) => {
    if (size && !form.sizes.includes(size)) {
      setForm((current) => ({ ...current, sizes: [...current.sizes, size] }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const price = Number(form.price);
    const discountAmount = Number(form.discountPrice) || 0;
    if (discountAmount > 0 && discountAmount >= price) {
      alert("Discount cannot exceed price");
      return;
    }
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("discountPrice", form.discountPrice || "0");
    formData.append("inStock", form.inStock);
    formData.append("category", form.category);
    formData.append("stock", form.stock);
    if (form.sizes.length === 0) formData.append("sizes[]", "");
    else form.sizes.forEach((size) => formData.append("sizes[]", size));
    if (form.mainImage) formData.append("mainImage", form.mainImage);
    form.images.forEach((img) => formData.append("images", img));

    try {
      if (editMode && currentProduct) {
        await updateProduct({ id: currentProduct._id, formData }).unwrap();
      } else {
        await addProduct(formData).unwrap();
      }
      resetForm();
      refetch();
    } catch (err) {
      alert(err?.data?.message || "Error saving product");
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget._id).unwrap();
      setDeleteTarget(null);
      refetch();
    } catch {
      alert("Error deleting product");
    } finally {
      setDeleting(false);
    }
  };

  const saveShipping = async () => {
    const value = Number(shippingInput);
    if (Number.isNaN(value)) return;
    if (shippingData) await updateShipping({ shippingCost: value });
    else await createShipping({ shippingCost: value });
    setShippingInput("");
    refetchShipping();
  };

  if (checking) return <Loading message="Checking admin access..." detail="Opening product management" />;

  return (
    <AdminShell title="Products">
      <AdminPageHeader
        eyebrow="Catalog"
        title="Products Management"
        description="Manage product details, stock, sizes, images, and shipping settings from one compact workspace."
        actions={<AdminButton icon={Plus} onClick={() => openModal()}>Add product</AdminButton>}
      />

      <AdminPanel className="mb-6">
        <AdminToolbar>
          <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
            <AdminSearch value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products..." />
            <label className="flex min-h-11 items-center gap-2 rounded-lg border border-[#d8ccb3] bg-white px-3 text-sm font-bold text-[#5f512d]">
              <input
                type="checkbox"
                checked={showInStockOnly}
                onChange={(event) => setShowInStockOnly(event.target.checked)}
                className="h-4 w-4 accent-[#d8aa2e]"
              />
              In stock only
            </label>
          </div>
          <div className="whitespace-nowrap text-sm font-bold text-[#695f4c]">{filteredProducts.length} products</div>
        </AdminToolbar>

        {isLoading ? (
          <Loading variant="inline" message="Loading products..." detail="Preparing product cards" />
        ) : filteredProducts.length > 0 ? (
          <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <motion.article
                key={product._id}
                layout
                whileHover={{ y: -3 }}
                className="overflow-hidden rounded-lg border border-[#e8dcc2] bg-[#fffdf8] shadow-sm"
              >
                <div className="relative aspect-[4/3] bg-[#f2ead7]">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${product.mainImage}`}
                    alt={product.title || "Product"}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3"><AdminStatusBadge status={product.inStock ? "In stock" : "Out of stock"} /></span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="line-clamp-1 text-base font-bold text-[#211900]">{product.title}</h3>
                      <p className="mt-1 text-sm text-[#695f4c]">{product.category || "Uncategorized"}</p>
                    </div>
                    <p className="font-bold tabular-nums text-[#7a5f07]">{product.price} LE</p>
                  </div>
                  <div className="mt-3 flex min-h-7 flex-wrap gap-1">
                    {(product.sizes || []).slice(0, 5).map((size) => (
                      <span key={size} className="rounded-full bg-[#fff3cf] px-2 py-1 text-xs font-bold text-[#7a5f07]">{size}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <AdminButton variant="secondary" icon={Edit3} onClick={() => openModal(product)}>Edit</AdminButton>
                    <AdminButton variant="danger" icon={Trash2} onClick={() => setDeleteTarget(product)}>Delete</AdminButton>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <AdminEmptyState
            title="No products found"
            description="Adjust your search or add a new product to the catalog."
            icon={Package}
            action={<AdminButton icon={Plus} onClick={() => openModal()}>Add product</AdminButton>}
          />
        )}
      </AdminPanel>

      <AdminPanel className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#fff3cf] text-[#7a5f07]">
              <Settings2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-base font-bold text-[#211900]">Shipping Cost</h3>
              <p className="text-sm text-[#695f4c]">
                {shippingLoading
                  ? "Loading shipping..."
                  : shippingData
                  ? shippingData.shippingCost === 0
                    ? "Free Shipping"
                    : `${shippingData.shippingCost} LE`
                  : "Not set"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="number"
              min={0}
              placeholder="Set shipping cost"
              value={shippingInput}
              onChange={(event) => setShippingInput(event.target.value)}
              className={adminInputClass}
            />
            <AdminButton loading={creatingShipping || updatingShipping} onClick={saveShipping}>
              {shippingData ? "Update" : "Add"}
            </AdminButton>
            {shippingData && (
              <AdminButton
                variant="danger"
                loading={deletingShipping}
                onClick={async () => {
                  await deleteShipping();
                  refetchShipping();
                }}
              >
                Delete
              </AdminButton>
            )}
          </div>
        </div>
      </AdminPanel>

      <AdminModal
        open={modalOpen}
        onClose={resetForm}
        title={editMode ? "Edit Product" : "Add Product"}
        size="full"
      >
        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid content-start gap-5">
            <ImageManager
              editMode={editMode}
              currentProduct={currentProduct}
              setCurrentProduct={setCurrentProduct}
              form={form}
              setForm={setForm}
              imagesInputRef={imagesInputRef}
              addProductImage={addProductImage}
              replaceProductImage={replaceProductImage}
              deleteProductImage={deleteProductImage}
            />
          </div>

          <div className="grid content-start gap-4">
            <AdminField label="Title">
              <input className={adminInputClass} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
            </AdminField>
            <AdminField label="Description">
              <textarea className={adminInputClass} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={5} required />
            </AdminField>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Price">
                <input type="number" className={adminInputClass} value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required />
              </AdminField>
              <AdminField label="Discount Amount">
                <input
                  type="number"
                  min={0}
                  className={adminInputClass}
                  value={form.discountPrice}
                  onChange={(event) => setForm({ ...form, discountPrice: event.target.value })}
                  placeholder="0"
                />
                <p className="mt-1 text-xs text-[#695f4c]">
                  Amount deducted from price. Example: 1000 price - 200 discount = 800 selling price.
                </p>
              </AdminField>
              {form.price && (
                <p className="text-sm font-bold text-[#7a5f07] sm:col-span-2">
                  Selling price: {getSellingPrice(form.price, form.discountPrice)} LE
                </p>
              )}
              <AdminField label="In Stock">
                <select className={adminInputClass} value={String(form.inStock)} onChange={(event) => setForm({ ...form, inStock: event.target.value === "true" })}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </AdminField>
              <AdminField label="Stock">
                <input type="number" className={adminInputClass} value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} required />
              </AdminField>
            </div>
            <AdminField label="Category">
              <input className={adminInputClass} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required />
            </AdminField>
            <AdminField label="Sizes">
              <div className="flex min-h-11 flex-wrap gap-2 rounded-lg border border-[#d8ccb3] bg-[#fffdf8] p-2">
                {form.sizes.map((size) => (
                  <span key={size} className="inline-flex items-center gap-1 rounded-full bg-[#fff3cf] px-2 py-1 text-xs font-bold text-[#7a5f07]">
                    {size}
                    <button type="button" className="text-red-700" onClick={() => setForm({ ...form, sizes: form.sizes.filter((item) => item !== size) })} aria-label={`Remove ${size}`}>
                      x
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Type size and press Enter"
                  className="min-w-48 flex-1 bg-transparent px-1 text-sm outline-none"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddSize(event.currentTarget.value.trim());
                      event.currentTarget.value = "";
                    }
                  }}
                />
              </div>
            </AdminField>
            <div className="flex justify-end gap-2 border-t border-[#eee2c9] pt-4">
              <AdminButton variant="secondary" onClick={resetForm}>Cancel</AdminButton>
              <AdminButton type="submit" loading={adding || updating}>{editMode ? "Save changes" : "Add product"}</AdminButton>
            </div>
          </div>
        </form>
      </AdminModal>

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete product?"
        message={`This will permanently remove "${deleteTarget?.title || "this product"}" from the catalog.`}
        confirmLabel="Delete product"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteProduct}
      />
    </AdminShell>
  );
};

function ImageSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
      <Loader2 className="h-5 w-5 animate-spin text-white" aria-hidden="true" />
    </div>
  );
}

function PendingGalleryThumb({ file, onRemove, disabled }) {
  const previewUrl = useObjectUrl(file);
  if (!previewUrl) return null;

  return (
    <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-[#e8dcc2]">
      <img src={previewUrl} alt="New product gallery" className="h-full w-full object-cover" />
      <button
        type="button"
        className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-md bg-red-600 text-white disabled:opacity-50"
        onClick={onRemove}
        disabled={disabled}
        aria-label="Remove image"
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

function MainImagePreview({ file }) {
  const previewUrl = useObjectUrl(file);
  if (!previewUrl) return null;
  return <img src={previewUrl} alt="Main preview" className="h-full w-full object-cover" />;
}

function ImageManager({
  editMode,
  currentProduct,
  setCurrentProduct,
  form,
  setForm,
  imagesInputRef,
  addProductImage,
  replaceProductImage,
  deleteProductImage,
}) {
  const [uploading, setUploading] = useState(false);
  const [replacingImage, setReplacingImage] = useState(null);
  const [deletingImage, setDeletingImage] = useState(null);

  const galleryCount = editMode
    ? (currentProduct?.images?.length || 0)
    : form.images.length;
  const galleryFull = galleryCount >= MAX_GALLERY_IMAGES;
  const imageBusy = uploading || Boolean(replacingImage) || Boolean(deletingImage);

  const prepareFile = async (file) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      alert(validationError);
      return null;
    }
    return compressImageIfNeeded(file);
  };

  const handleGalleryFiles = async (fileList, inputElement) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    if (editMode && currentProduct) {
      const remainingSlots = MAX_GALLERY_IMAGES - (currentProduct.images?.length || 0);
      if (remainingSlots <= 0) {
        alert("Maximum 10 gallery images allowed");
        if (inputElement) inputElement.value = "";
        return;
      }
      if (files.length > remainingSlots) {
        alert(`You can only add ${remainingSlots} more image${remainingSlots === 1 ? "" : "s"}`);
      }

      setUploading(true);
      let latestProduct = currentProduct;

      for (const file of files.slice(0, remainingSlots)) {
        const prepared = await prepareFile(file);
        if (!prepared) continue;

        try {
          latestProduct = await addProductImage({ id: currentProduct._id, image: prepared }).unwrap();
          setCurrentProduct(latestProduct);
        } catch (err) {
          alert(err?.data?.message || "Failed to upload image");
          break;
        }
      }

      setUploading(false);
    } else {
      const validFiles = [];
      for (const file of files) {
        if (form.images.length + validFiles.length >= MAX_GALLERY_IMAGES) {
          alert("Maximum 10 gallery images allowed");
          break;
        }
        const prepared = await prepareFile(file);
        if (prepared) validFiles.push(prepared);
      }
      if (validFiles.length) {
        setForm((current) => ({ ...current, images: [...current.images, ...validFiles] }));
      }
    }

    if (inputElement) inputElement.value = "";
    if (imagesInputRef.current) imagesInputRef.current.value = "";
  };

  const handleDeleteImage = async (imageName) => {
    if (!currentProduct || imageBusy) return;
    setDeletingImage(imageName);
    try {
      const updated = await deleteProductImage({ id: currentProduct._id, imageName }).unwrap();
      setCurrentProduct(updated);
    } catch (err) {
      alert(err?.data?.message || "Failed to delete image");
    } finally {
      setDeletingImage(null);
    }
  };

  const handleReplaceImage = async (imageName, event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !currentProduct || imageBusy) return;

    const prepared = await prepareFile(file);
    if (!prepared) return;

    setReplacingImage(imageName);
    try {
      const updated = await replaceProductImage({
        id: currentProduct._id,
        imageName,
        image: prepared,
      }).unwrap();
      setCurrentProduct(updated);
    } catch (err) {
      alert(err?.data?.message || "Failed to replace image");
    } finally {
      setReplacingImage(null);
    }
  };

  return (
    <AdminPanel className="p-4">
      <h3 className="text-base font-bold text-[#211900]">Product Images</h3>
      <div className="mt-4 grid gap-4">
        <label className="block">
          <span className="text-sm font-bold text-[#2d250d]">Main Image</span>
          <div className="relative mt-2 aspect-square max-w-64 overflow-hidden rounded-lg border-2 border-dashed border-[#d8aa2e] bg-[#fffdf8]">
            {form.mainImage ? (
              <MainImagePreview file={form.mainImage} />
            ) : editMode && currentProduct?.mainImage ? (
              <Image src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${currentProduct.mainImage}`} alt="Main product" fill className="object-cover" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-[#7a5f07]">
                <Upload className="h-7 w-7" aria-hidden="true" />
                <span className="text-sm font-bold">Upload main image</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={(event) => setForm((current) => ({ ...current, mainImage: event.target.files?.[0] || null }))}
              required={!editMode}
              disabled={imageBusy}
              aria-label="Choose main product image"
            />
          </div>
        </label>

        <div>
          <p className="text-sm font-bold text-[#2d250d]">Gallery Images</p>
          <p className="mt-1 text-xs text-[#695f4c]">
            {editMode
              ? "Images upload immediately. Max 10 images, 10MB each."
              : "Images are uploaded when you save the product. Max 10 images, 10MB each."}
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            {editMode && currentProduct?.images?.map((img) => (
              <div key={img} className="relative h-20 w-20 overflow-hidden rounded-lg border border-[#e8dcc2]">
                <Image src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${img}`} alt="Product gallery" fill className="object-cover" />
                {(replacingImage === img || deletingImage === img) && <ImageSpinner />}
                <button
                  type="button"
                  className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-md bg-red-600 text-white disabled:opacity-50"
                  onClick={() => handleDeleteImage(img)}
                  disabled={imageBusy}
                  aria-label="Remove image"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <label className={`absolute bottom-1 left-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-[#d8aa2e] text-[#211900] ${imageBusy ? "pointer-events-none opacity-50" : ""}`} aria-label="Replace image">
                  <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={imageBusy}
                    onChange={(event) => handleReplaceImage(img, event)}
                  />
                </label>
              </div>
            ))}
            {!editMode && form.images.map((img, index) => (
              <PendingGalleryThumb
                key={`${img.name}-${index}`}
                file={img}
                disabled={imageBusy}
                onRemove={() => setForm((current) => ({
                  ...current,
                  images: current.images.filter((_, itemIndex) => itemIndex !== index),
                }))}
              />
            ))}
            <label className={`relative flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-[#d8aa2e] bg-[#fffdf8] text-[#7a5f07] ${galleryFull || imageBusy ? "pointer-events-none opacity-50" : "cursor-pointer"}`}>
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <>
                  <Plus className="h-5 w-5" aria-hidden="true" />
                  <span className="text-xs font-bold">Add</span>
                </>
              )}
              <input
                ref={imagesInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={galleryFull || imageBusy}
                onChange={(event) => handleGalleryFiles(event.target.files, event.target)}
              />
            </label>
          </div>
        </div>
      </div>
    </AdminPanel>
  );
}

export default Products;
