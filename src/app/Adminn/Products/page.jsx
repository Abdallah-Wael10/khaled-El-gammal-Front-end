"use client";
import React, { useState, useEffect, useRef } from 'react';
import Nav2 from "@/app/components/Nav2/page";
import { getAuthToken } from "@/app/utils/page";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/loading/page";
import {
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAddProductImageMutation,
  useReplaceProductImageMutation,
  useDeleteProductImageMutation,
} from '@/app/features/Api/ProductApi';
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";

const Products = () => {
  const router = useRouter();
  const token = getAuthToken();

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

  const { data: products, isLoading, refetch } = useGetProductsQuery();
  const [addProduct, { isLoading: adding }] = useAddProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [addProductImage] = useAddProductImageMutation();
  const [replaceProductImage] = useReplaceProductImageMutation();
  const [deleteProductImage] = useDeleteProductImageMutation();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [form, setForm] = useState({
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
  });

  const imagesInputRef = useRef();

  // Open modal for add/edit
  const openModal = (product = null) => {
    setEditMode(!!product);
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

  // Add/remove size
  const handleAddSize = (size) => {
    if (size && !form.sizes.includes(size)) {
      setForm({ ...form, sizes: [...form.sizes, size] });
    }
  };
  const handleRemoveSize = (size) => {
    setForm({ ...form, sizes: form.sizes.filter(s => s !== size) });
  };

  // Add new images (append)
  const handleAddImages = (files) => {
    setForm({ ...form, images: [...form.images, ...Array.from(files)] });
    if (imagesInputRef.current) imagesInputRef.current.value = "";
  };

  // Remove new image before submit
  const handleRemoveNewImage = (idx) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });
  };

  // Handle submit (add/update product)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("discountPrice", form.discountPrice);
    formData.append("inStock", form.inStock);
    formData.append("category", form.category);
    formData.append("stock", form.stock);
if (form.sizes.length === 0) {
  formData.append("sizes[]", ""); 
} else {
  form.sizes.forEach(size => formData.append("sizes[]", size));
}
    if (form.mainImage) formData.append("mainImage", form.mainImage);
    form.images.forEach(img => formData.append("images", img));

    try {
      if (editMode && currentProduct) {
        await updateProduct({ id: currentProduct._id, formData }).unwrap();
      } else {
        await addProduct(formData).unwrap();
      }
      setModalOpen(false);
      setForm({
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
      });
      setCurrentProduct(null);
      refetch();
    } catch {
      alert("Error saving product");
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id).unwrap();
      refetch();
    } catch {
      alert("Error deleting product");
    }
  };

  // Add new image (append) to backend (not used in modal, but for direct API)
  const handleAddImage = async (file) => {
    if (!currentProduct) return;
    await addProductImage({ id: currentProduct._id, image: file });
    // بعد الإضافة اعمل refetch للمنتج
    const updated = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${currentProduct._id}`).then(res => res.json());
    setCurrentProduct(updated);
    refetch();
  };

  // Replace old image with new one 
  const handleReplaceImageApi = async (imageName, file) => {
    if (!currentProduct) return;
    await replaceProductImage({ id: currentProduct._id, imageName, image: file });
    // بعد الاستبدال اعمل refetch للمنتج
    const updated = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${currentProduct._id}`).then(res => res.json());
    setCurrentProduct(updated);
    refetch();
  };

  // Delete image 
  const handleDeleteImage = async (imageName) => {
    if (!currentProduct) return;
    await deleteProductImage({ id: currentProduct._id, imageName });
    // بعد الحذف اعمل refetch للمنتج
    const updated = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${currentProduct._id}`).then(res => res.json());
    setCurrentProduct(updated);
    refetch();
  };

  // Filter/Search state
  const [search, setSearch] = useState("");
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  // Filtered products
  const filteredProducts = (products || []).filter(product => {
    const matchesSearch =
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase());
    const matchesStock = showInStockOnly ? product.inStock : true;
    return matchesSearch && matchesStock;
  });

  return (
    <div className="bg-gradient-to-br from-[#FFFDF7] via-[#FFF6D4] to-[#FFFCF2] min-h-screen text-black">
      <Nav2 />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-[#FFCF67] max-[600px]:w-full max-[600px]:text-center max-[600px]:text-[20px]">Products Management</h1>
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <input
              type="text"
              placeholder="Search by name or category..."
              className="px-3 py-2 rounded-lg border-2 border-[#FFCF67] focus:ring-2 focus:ring-[#FFCF67] outline-none bg-white/80 text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <label className="flex items-center gap-2 text-[#917405] font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={showInStockOnly}
                onChange={e => setShowInStockOnly(e.target.checked)}
                className="accent-[#FFCF67] w-4 h-4"
              />
              In Stock Only
            </label>
            <button
              className="px-5 py-2 rounded-lg bg-[#FFCF67] text-white font-bold hover:bg-[#FFD96B] hover:text-[#2B2201] transition active:scale-95"
              onClick={() => openModal()}
            >
              + Add New
            </button>
          </div>
        </div>
        <div className="bg-white/90 rounded-2xl shadow-xl p-8">
          {isLoading ? (
            <div className="text-center text-[#FFCF67] font-bold">Loading...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-[#FFFDF7] rounded-xl shadow p-4 flex flex-col items-center group transition-all duration-200 hover:shadow-lg"
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${product.mainImage}`}
                    alt={product.title}
                    width={220}
                    height={160}
                    priority
                    className="rounded-lg object-cover border border-[#FFCF67]/30 mb-3"
                  />
                  <div className="font-semibold text-[#2B2201] text-lg mb-2">{product.title}</div>
                  <div className="text-[#A4A4A4] text-sm mb-2">{product.category}</div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {product.sizes.map((size, idx) => (
                      <span key={idx} className="px-2 py-1 rounded bg-[#FFCF67]/20 text-xs text-[#917405]">{size}</span>
                    ))}
                  </div>
                  <div className="flex gap-2 mb-2">
                    <span className="font-bold text-[#FFCF67]">{product.price} LE</span>
                    {product.discountPrice > 0 && (
                      <span className="text-red-500 line-through text-sm">{product.discountPrice} LE</span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="px-3 py-1 rounded-lg bg-[#FFCF67] text-white font-bold hover:bg-[#FFD96B] hover:text-[#2B2201] transition active:scale-95"
                      onClick={() => openModal(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 rounded-lg bg-red-400 text-white font-bold hover:bg-red-600 transition active:scale-95"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-[#A4A4A4]">No products found.</div>
          )}
        </div>
        {/* Modal for Add/Edit */}
        <Transition show={modalOpen} as={React.Fragment}>
          <Dialog as="div" className="fixed inset-0 z-50 flex items-center justify-center" onClose={() => setModalOpen(false)}>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
            <div
              className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full h-full mx-auto flex flex-col gap-4 animate-fade-in overflow-auto"
              style={{ maxWidth: "100vw", maxHeight: "100vh" }}
            >
              <button
                className="absolute top-3 right-3 text-2xl font-bold text-[#FFCF67] hover:text-[#917405] transition"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-2xl font-bold text-[#2B2201] mb-4 text-center">{editMode ? "Edit Product" : "Add New Product"}</h3>
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8 w-full h-full overflow-auto">
                {/* Left: Images */}
                <div className="flex-1 flex flex-col gap-8 items-center justify-start">
                  {/* Main Image */}
                  <div className="w-full flex flex-col items-center">
                    <div className="mb-2 font-semibold text-[#2B2201]">Main Image</div>
                    <div className="relative group flex flex-col items-center">
                      <div className="w-44 h-44 rounded-xl border-2 border-dashed border-[#FFCF67] flex items-center justify-center bg-[#FFFDF7] overflow-hidden shadow-sm">
                        {form.mainImage ? (
                          <img
                            src={URL.createObjectURL(form.mainImage)}
                            alt="main"
                            className="object-cover w-full h-full"
                          />
                        ) : editMode && currentProduct?.mainImage ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${currentProduct.mainImage}`}
                            alt="main"
                            width={180}
                            height={180}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-[#FFCF67] text-4xl">+</span>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={e => setForm({ ...form, mainImage: e.target.files[0] })}
                          required={!editMode}
                          title="Choose main image"
                        />
                      </div>
                      <span className="text-xs text-[#A4A4A4] mt-1">Click to {form.mainImage ? "change" : "add"} main image</span>
                    </div>
                  </div>
                  {/* Product Images */}
                  <div className="w-full flex flex-col items-center">
                    <div className="mb-2 font-semibold text-[#2B2201]">Product Images</div>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {/* صور backend (القديمة) */}
                      {editMode && currentProduct?.images?.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${img}`}
                            alt={`img-${idx}`}
                            width={90}
                            height={90}
                            className="rounded-lg object-cover border border-[#FFCF67]/30 shadow"
                          />
                          {/* زر حذف الصورة */}
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-90 hover:scale-110 transition"
                            onClick={async () => {
                              await handleDeleteImage(img);
                            }}
                            title="Remove"
                          >×</button>
                          <label
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FFCF67] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-90 hover:scale-110 transition cursor-pointer"
                            title="Replace"
                          >
                            ↻
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                if (e.target.files[0]) {
                                  await handleReplaceImageApi(img, e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                        </div>
                      ))}
                      {/* صور جديدة قبل الحفظ */}
                      {form.images && form.images.length > 0 &&
                        form.images.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={URL.createObjectURL(img)}
                              alt={`new-img-${idx}`}
                              width={90}
                              height={90}
                              className="rounded-lg object-cover border border-[#FFCF67]/30 shadow"
                            />
                            <button
                              type="button"
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-90 hover:scale-110 transition"
                              onClick={() => handleRemoveNewImage(idx)}
                              title="Remove"
                            >×</button>
                          </div>
                        ))}
                      {/* زر إضافة صورة جديدة */}
                      <label className="cursor-pointer flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-[#FFCF67] rounded-lg bg-[#FFFDF7] hover:bg-[#FFF6D4] transition">
                        <span className="text-[#FFCF67] text-3xl">+</span>
                        <input
                          ref={imagesInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={e => handleAddImages(e.target.files)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                {/* Right: Details */}
                <div className="flex-1 flex flex-col gap-4">
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
                    Description:
                    <textarea
                      className="w-full mt-1 p-2 border-2 border-[#FFCF67] rounded-lg focus:ring-2 focus:ring-[#FFCF67] outline-none"
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      required
                      rows={4}
                    />
                  </label>
                  <div className="flex gap-2">
                    <label className="font-semibold text-[#2B2201] flex-1">
                      Price:
                      <input
                        type="number"
                        className="w-full mt-1 p-2 border-2 border-[#FFCF67] rounded-lg focus:ring-2 focus:ring-[#FFCF67] outline-none"
                        value={form.price}
                        onChange={e => setForm({ ...form, price: e.target.value })}
                        required
                      />
                    </label>
                    <label className="font-semibold text-[#2B2201] flex-1">
                      Discount Price:
                      <input
                        type="number"
                        className="w-full mt-1 p-2 border-2 border-[#FFCF67] rounded-lg focus:ring-2 focus:ring-[#FFCF67] outline-none"
                        value={form.discountPrice}
                        onChange={e => setForm({ ...form, discountPrice: e.target.value })}
                        required
                      />
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <label className="font-semibold text-[#2B2201] flex-1">
                      In Stock:
                      <select
                        className="w-full mt-1 p-2 border-2 border-[#FFCF67] rounded-lg focus:ring-2 focus:ring-[#FFCF67] outline-none"
                        value={form.inStock}
                        onChange={e => setForm({ ...form, inStock: e.target.value === "true" })}
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </label>
                    <label className="font-semibold text-[#2B2201] flex-1">
                      Stock:
                      <input
                        type="number"
                        className="w-full mt-1 p-2 border-2 border-[#FFCF67] rounded-lg focus:ring-2 focus:ring-[#FFCF67] outline-none"
                        value={form.stock}
                        onChange={e => setForm({ ...form, stock: e.target.value })}
                        required
                      />
                    </label>
                  </div>
                  <label className="font-semibold text-[#2B2201]">
                    Category:
                    <input
                      type="text"
                      className="w-full mt-1 p-2 border-2 border-[#FFCF67] rounded-lg focus:ring-2 focus:ring-[#FFCF67] outline-none"
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      required
                    />
                  </label>
                  {/* Sizes */}
                  <label className="font-semibold text-[#2B2201]">
                    Sizes:
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {form.sizes.map((size, idx) => (
                        <span key={idx} className="px-2 py-1 rounded bg-[#FFCF67]/20 text-xs text-[#917405] flex items-center gap-1">
                          {size}
                          <button type="button" className="ml-1 text-red-500" onClick={() => handleRemoveSize(size)}>×</button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Add size (e.g. 100x100)"
                        className="flex-1 p-2 border-2 border-[#FFCF67] rounded-lg focus:ring-2 focus:ring-[#FFCF67] outline-none"
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSize(e.target.value.trim());
                            e.target.value = "";
                          }
                        }}
                      />
                    </div>
                  </label>
                  <button
                    type="submit"
                    className="mt-2 px-4 py-2 rounded-lg bg-[#FFCF67] text-white font-bold hover:bg-[#FFD96B] hover:text-[#2B2201] transition active:scale-95"
                    disabled={adding || updating}
                  >
                    {adding || updating ? "Saving..." : editMode ? "Save Changes" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </Dialog>
        </Transition>
      </main>

    </div>
  );
};

export default Products;
