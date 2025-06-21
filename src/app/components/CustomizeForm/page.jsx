"use client";
import Image from 'next/image';
import React, { useState } from 'react';
import { useAddCustomizationMutation } from '@/app/features/Api/CustomizeFormApi';
import { toast } from 'react-hot-toast';

const CustomizeForm = () => {
  const [addCustomization, { isLoading }] = useAddCustomizationMutation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectDetails: '',
    images: [],
  });
  const [preview, setPreview] = useState([]);
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    projectDetails: '',
    images: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      phone: '',
      email: '',
      projectDetails: '',
      images: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!formData.phone.match(phoneRegex)) {
      newErrors.phone = 'Invalid phone number (10-15 digits)';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.match(emailRegex)) {
      newErrors.email = 'Invalid email address';
      isValid = false;
    }

    if (!formData.projectDetails.trim()) {
      newErrors.projectDetails = 'Project details are required';
      isValid = false;
    } else if (formData.projectDetails.length < 20) {
      newErrors.projectDetails = 'Project details must be at least 20 characters';
      isValid = false;
    }

    if (!formData.images.length) {
      newErrors.images = 'Please upload at least one image';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setFormData(prev => ({ ...prev, images: files }));
    setErrors(prev => ({ ...prev, images: '' }));
    setPreview(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('phone', formData.phone);
    payload.append('email', formData.email);
    payload.append('comment', formData.projectDetails);
    formData.images.forEach(img => payload.append('image', img));

    const toastId = toast.loading("Sending your customization...");
    try {
      await addCustomization(payload).unwrap();
      toast.success("Your customization form is sent!", { id: toastId });
      setFormData({
        name: '',
        phone: '',
        email: '',
        projectDetails: '',
        images: [],
      });
      setPreview([]);
    } catch (error) {
      toast.error("Error: " + (error?.data?.message || "Please try again."), { id: toastId });
    }
  };

  return (
    <div className="w-full max-w-[500px] md:max-w-[760px] mx-auto h-max bg-white rounded-[23px] border border-gray-400 px-2 md:px-6 py-6">
      <div className="w-full h-max flex justify-center pb-5 items-center flex-col gap-4">
        <p className="w-full h-max text-center pb-3 pt-3 text-[18px] font-normal text-[#737373] max-[500px]:text-[15px]">
          Upload images and tell us what you want. We'll help you make it real with <span className="text-[#FFCF67]">Khaled El Gamal</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="pb-4 text-black" encType="multipart/form-data">
        <div className="w-full flex flex-col items-center gap-6 md:gap-8">
          {/* Name Input */}
          <div className="w-full relative">
            <label className="absolute -top-2.5 left-3 text-sm text-[#FFCF67] bg-white px-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none ${
                errors.name ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#FFCF67]'
              }`}
              placeholder="Your Name"
              disabled={isLoading}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Phone Input */}
          <div className="w-full relative">
            <label className="absolute -top-2.5 left-3 text-sm text-[#FFCF67] bg-white px-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none ${
                errors.phone ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#FFCF67]'
              }`}
              placeholder="Your Mobile Number"
              disabled={isLoading}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Email Input */}
          <div className="w-full relative">
            <label className="absolute -top-2.5 left-3 text-sm text-[#FFCF67] bg-white px-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none ${
                errors.email ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#FFCF67]'
              }`}
              placeholder="Your Email Address"
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Project Details */}
          <div className="w-full relative">
            <label className="absolute -top-2.5 left-3 text-sm text-[#FFCF67] bg-white px-1">Comment</label>
            <textarea
              name="projectDetails"
              value={formData.projectDetails}
              onChange={handleInputChange}
              className={`w-full border rounded-lg px-4 py-3 focus:outline-none ${
                errors.projectDetails ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-[#FFCF67]'
              }`}
              rows="5"
              placeholder="Your Comment"
              disabled={isLoading}
            />
            {errors.projectDetails && <p className="text-red-500 text-sm mt-1">{errors.projectDetails}</p>}
          </div>

          {/* Image Upload */}
          <div className="w-full relative flex flex-col items-center">
            <label className="block text-base text-[#FFCF67] font-semibold mb-2">
              Upload Inspiration Images (max 5)
            </label>
            <span className="w-full h-max text-center text-[17px] pb-3 font-normal text-[#737373] max-[500px]:text-[14px]">
              Add images that represent the style or design you want. Our team will use them to create your custom piece.
            </span>
            <label
              htmlFor="custom-image-upload"
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[#FFCF67] rounded-lg cursor-pointer bg-[#FFF8E1] hover:bg-[#FFECB3] transition mb-2"
            >
              <svg className="w-10 h-10 text-[#FFCF67] mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-gray-700 font-medium">Click to upload or drag & drop (max 5)</span>
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
            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
            {preview.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3 justify-center">
                {preview.map((img, idx) => (
                  <Image
                    key={idx}
                    src={img}
                    alt={`Inspiration Preview ${idx + 1}`}
                    width={100}
                    height={100}
                    className="rounded-lg border border-gray-300 object-cover shadow"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex justify-center mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-[80%] h-14 bg-[#FFCF67] text-white text-xl font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomizeForm;