"use client";

import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useAddBusinessMutation } from "@/app/features/Api/BusinessFormApi";
import { useGetProductsQuery } from "@/app/features/Api/ProductApi";
import Loading from "../loading/page";
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

const BusinessForm = () => {
  const [addBusiness, { isLoading }] = useAddBusinessMutation();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    projectDetails: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
    projectDetails: "",
    category: "",
  });

  const { data: products = [], isLoading: productsLoading } = useGetProductsQuery();

  const categories = useMemo(() => {
    const cats = products.map((p) => p.category?.trim()).filter(Boolean);
    return Array.from(new Set(cats));
  }, [products]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      phone: "",
      email: "",
      projectDetails: "",
      category: "",
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

    if (!selectedCategory) {
      newErrors.category = "Category is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleOptionChange = (e) => {
    setSelectedCategory(e.target.value);
    setErrors((prev) => ({ ...prev, category: "" }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      comment: formData.projectDetails,
      category: selectedCategory,
    };

    const toastId = toast.loading("Sending your business form...");
    try {
      await addBusiness(payload).unwrap();
      toast.success("Your business form is sent!", { id: toastId });
      setFormData({
        name: "",
        phone: "",
        email: "",
        projectDetails: "",
      });
      setSelectedCategory("");
    } catch (error) {
      toast.error("Error: " + (error?.data?.message || "Please try again."), { id: toastId });
    }
  };

  return (
    <motion.section
      className="premium-surface relative w-full max-w-[760px] rounded-[24px] px-5 py-7 sm:px-8 sm:py-9"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
    >
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <h1 className="text-3xl font-black text-[#b88710] sm:text-4xl">Business Inquiry</h1>
        <p className="mt-3 text-base font-semibold leading-7 text-[#70664f] sm:text-lg">
          Tell us what product you need, and we will get back to you within 24 hours.
        </p>
      </div>

      <motion.form onSubmit={handleSubmit} className="text-[#211900]" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }}>
        <motion.div className="mb-6" variants={staggerItem}>
          <label htmlFor="business-category" className="mb-2 block text-sm font-bold text-[#6f5702]">
            Product Category
          </label>
          <select
            id="business-category"
            className={`premium-input w-full px-4 py-3 font-semibold ${errors.category ? "border-red-500" : ""}`}
            value={selectedCategory}
            onChange={handleOptionChange}
            disabled={isLoading || productsLoading}
            aria-invalid={Boolean(errors.category)}
          >
            <option value="" disabled hidden>
              {productsLoading ? "Loading categories..." : "Select Category"}
            </option>
            {categories.map((category, index) => (
              <option className="bg-white text-black" key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ErrorMessage message={errors.category} />
        </motion.div>

        <div className="grid gap-6">
          {[
            { label: "Name", name: "name", type: "text", placeholder: "Your Name", autocomplete: "name" },
            { label: "Phone", name: "phone", type: "tel", placeholder: "Your Mobile Number", autocomplete: "tel" },
            { label: "Email", name: "email", type: "email", placeholder: "Your Email Address", autocomplete: "email" },
          ].map((field) => (
            <motion.div key={field.name} className="relative" variants={staggerItem}>
              <label htmlFor={`business-${field.name}`} className="mb-2 block text-sm font-bold text-[#6f5702]">
                {field.label}
              </label>
              <input
                id={`business-${field.name}`}
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
            <label htmlFor="business-comment" className="mb-2 block text-sm font-bold text-[#6f5702]">
              Comment
            </label>
            <textarea
              id="business-comment"
              name="projectDetails"
              value={formData.projectDetails}
              onChange={handleInputChange}
              className={`premium-input min-h-[140px] w-full resize-y px-4 py-3 ${errors.projectDetails ? "border-red-500" : ""}`}
              rows="5"
              placeholder="Tell us quantities, product type, or custom needs"
              disabled={isLoading}
              aria-invalid={Boolean(errors.projectDetails)}
            />
            <ErrorMessage message={errors.projectDetails} />
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
      {isLoading && <Loading variant="overlay" message="Sending request..." detail="Submitting your business inquiry" />}
    </motion.section>
  );
};

export default BusinessForm;
