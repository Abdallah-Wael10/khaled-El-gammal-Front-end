"use client";
import Image from 'next/image';
import React, { useState } from 'react';
import { useAddContactMutation } from '@/app/features/Api/contactUsApi';
import { toast } from 'react-hot-toast';

const Form = () => {
  const [addContact, { isLoading: isAdding }] = useAddContactMutation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectDetails: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    projectDetails: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      phone: '',
      email: '',
      projectDetails: '',
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
      newErrors.projectDetails = 'Comment is required';
      isValid = false;
    } else if (formData.projectDetails.length < 10) {
      newErrors.projectDetails = 'Comment must be at least 10 characters';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      comment: formData.projectDetails,
    };

    const toastId = toast.loading("Sending your message...");
    try {
      await addContact(payload).unwrap();
      toast.success("Your form is sent!", { id: toastId });
      setFormData({
        name: '',
        phone: '',
        email: '',
        projectDetails: '',
      });
    } catch (err) {
      toast.error("Error: " + (err?.data?.message || "Please try again."), { id: toastId });
    }
  };

  return (
    <div className="w-[760px] h-max bg-white rounded-[23px] border border-gray-400 max-460:w-[94%] max-460:h-max">
      <div className="w-full h-max flex justify-center pb-5 items-center flex-col gap-5">
        <h1 className="text-[36px] text-[#FFCF67] font-black">Contact us</h1>
        <p className="text-[24px] font-bold text-[#737373] max-[900px]:text-[20px] text-center max-[321px]:text-[16px]">
          Get in touch with <span className="text-[#FFCF67]">Khaled El Gamal</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="pb-7 text-black">
        <div className="w-full flex flex-col items-center gap-[60px] px-4">
          {/* Name Input */}
          <div className="w-[80%] relative">
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
              disabled={isAdding}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Phone Input */}
          <div className="w-[80%] relative">
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
              disabled={isAdding}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Email Input */}
          <div className="w-[80%] relative">
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
              disabled={isAdding}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Project Details */}
          <div className="w-[80%] relative">
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
              disabled={isAdding}
            />
            {errors.projectDetails && <p className="text-red-500 text-sm mt-1">{errors.projectDetails}</p>}
          </div>
        </div>

        <div className="w-full flex justify-center mt-8">
          <button
            type="submit"
            disabled={isAdding}
            className="w-[80%] h-14 bg-[#FFCF67] text-white text-xl font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;