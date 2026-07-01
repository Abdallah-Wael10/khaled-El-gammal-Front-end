"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAddCustomizationMutation } from "@/app/features/Api/CustomizeFormApi";
import { toast } from "react-hot-toast";
import { fadeUp, scaleTap, staggerContainer, staggerItem } from "@/app/lib/motion";

const ErrorMessage = ({ message }) => (
  <AnimatePresence>
    {message && (
      <motion.p
        className="mt-2 text-sm font-semibold text-red-600"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        role="alert"
      >
        {message}
      </motion.p>
    )}
  </AnimatePresence>
);

const CustomizeForm = () => {
  const [addCustomization, { isLoading }] = useAddCustomizationMutation();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    projectDetails: "",
    images: [],
  });
  const [preview, setPreview] = useState([]);
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
    projectDetails: "",
    images: "",
  });

  useEffect(() => {
    return () => {
      preview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [preview]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      phone: "",
      email: "",
      projectDetails: "",
      images: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!formData.phone.match(phoneRegex)) {
      newErrors.phone = "Invalid phone number (10-15 digits)";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.match(emailRegex)) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    if (!formData.projectDetails.trim()) {
      newErrors.projectDetails = "Project details are required";
      isValid = false;
    } else if (formData.projectDetails.length < 20) {
      newErrors.projectDetails = "Project details must be at least 20 characters";
      isValid = false;
    }

    if (!formData.images.length) {
      newErrors.images = "Please upload at least one image";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    preview.forEach((url) => URL.revokeObjectURL(url));
    setFormData((prev) => ({ ...prev, images: files }));
    setErrors((prev) => ({ ...prev, images: "" }));
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("phone", formData.phone);
    payload.append("email", formData.email);
    payload.append("comment", formData.projectDetails);
    formData.images.forEach((img) => payload.append("image", img));

    const toastId = toast.loading("Sending your customization...");
    try {
      await addCustomization(payload).unwrap();
      toast.success("Your customization form is sent!", { id: toastId });
      setFormData({
        name: "",
        phone: "",
        email: "",
        projectDetails: "",
        images: [],
      });
      preview.forEach((url) => URL.revokeObjectURL(url));
      setPreview([]);
    } catch (error) {
      toast.error("Error: " + (error?.data?.message || "Please try again."), { id: toastId });
    }
  };

  return (
    <motion.section
      className="premium-surface w-full max-w-[760px] rounded-[24px] px-5 py-7 sm:px-8 sm:py-9"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
    >
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <p className="text-base font-semibold leading-7 text-[#70664f] sm:text-lg">
          Upload images and tell us what you want. We will help you make it real with{" "}
          <span className="text-[#b88710]">Khaled El Gamal</span>.
        </p>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="text-[#211900]"
        encType="multipart/form-data"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
      >
        <div className="grid gap-6">
          {[
            { label: "Name", name: "name", type: "text", placeholder: "Your Name", autocomplete: "name" },
            { label: "Phone", name: "phone", type: "tel", placeholder: "Your Mobile Number", autocomplete: "tel" },
            { label: "Email", name: "email", type: "email", placeholder: "Your Email Address", autocomplete: "email" },
          ].map((field) => (
            <motion.div key={field.name} className="relative" variants={staggerItem}>
              <label htmlFor={`customize-${field.name}`} className="mb-2 block text-sm font-bold text-[#6f5702]">
                {field.label}
              </label>
              <input
                id={`customize-${field.name}`}
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleInputChange}
                className={`premium-input w-full px-4 py-3 ${errors[field.name] ? "border-red-500" : ""}`}
                placeholder={field.placeholder}
                autoComplete={field.autocomplete}
                disabled={isLoading}
                aria-invalid={Boolean(errors[field.name])}
              />
              <ErrorMessage message={errors[field.name]} />
            </motion.div>
          ))}

          <motion.div className="relative" variants={staggerItem}>
            <label htmlFor="customize-comment" className="mb-2 block text-sm font-bold text-[#6f5702]">
              Comment
            </label>
            <textarea
              id="customize-comment"
              name="projectDetails"
              value={formData.projectDetails}
              onChange={handleInputChange}
              className={`premium-input min-h-[150px] w-full resize-y px-4 py-3 ${errors.projectDetails ? "border-red-500" : ""}`}
              rows="5"
              placeholder="Describe the style, material, size, or mood you want"
              disabled={isLoading}
              aria-invalid={Boolean(errors.projectDetails)}
            />
            <ErrorMessage message={errors.projectDetails} />
          </motion.div>

          <motion.div className="relative" variants={staggerItem}>
            <label htmlFor="custom-image-upload" className="mb-2 block text-sm font-bold text-[#6f5702]">
              Upload Inspiration Images <span className="font-semibold text-[#9b8b64]">(max 5)</span>
            </label>
            <p className="mb-3 text-sm leading-6 text-[#70664f]">
              Add images that represent the style or design you want.
            </p>
            <label
              htmlFor="custom-image-upload"
              className={`flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 text-center transition-colors ${
                errors.images
                  ? "border-red-500 bg-red-50"
                  : "border-[#d9a928] bg-[#fffaf0] hover:bg-[#fff1bf]"
              }`}
            >
              <svg className="mb-3 h-10 w-10 text-[#b88710]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-bold text-[#211900]">Click to upload or drag and drop</span>
              <span className="mt-1 text-sm text-[#70664f]">JPG, PNG, or WebP inspiration images</span>
              <input
                id="custom-image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                disabled={isLoading}
              />
            </label>
            <ErrorMessage message={errors.images} />
            <AnimatePresence>
              {preview.length > 0 && (
                <motion.div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {preview.map((img, idx) => (
                    <motion.div key={img} className="overflow-hidden rounded-xl border border-[#ead9a5] bg-white shadow-sm" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
                      <Image
                        src={img}
                        alt={`Inspiration Preview ${idx + 1}`}
                        width={140}
                        height={140}
                        className="aspect-square w-full object-cover"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          className="premium-button mt-8 flex w-full items-center justify-center px-6 text-lg disabled:cursor-not-allowed disabled:opacity-60"
          {...scaleTap}
        >
          {isLoading ? "Sending..." : "Send"}
        </motion.button>
      </motion.form>
    </motion.section>
  );
};

export default CustomizeForm;
