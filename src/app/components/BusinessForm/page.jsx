"use client";
import React, { useState } from 'react';
import { useAddBusinessMutation } from '@/app/features/Api/BusinessFormApi';
import Loading from '../loading/page';
import { toast } from 'react-hot-toast';

const ProductCategory = [
  "Frame earthenware",
  "Box with Stone",
  "Table with Stone",
  "Chess",
  "Others",
];

const BusinessForm = () => {
  const [addBusiness, { isLoading }] = useAddBusinessMutation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectDetails: '',
  });
  const [selectedCategory, setSelectedCategory] = useState(ProductCategory[0]);
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    projectDetails: '',
    category: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      phone: '',
      email: '',
      projectDetails: '',
      category: '',
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

    if (!selectedCategory) {
      newErrors.category = 'Category is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleOptionChange = (e) => {
    setSelectedCategory(e.target.value);
    setErrors(prev => ({ ...prev, category: '' }));
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
      category: selectedCategory,
    };

    const toastId = toast.loading("Sending your business form...");
    try {
      await addBusiness(payload).unwrap();
      toast.success("Your business form is sent!", { id: toastId });
      setFormData({
        name: '',
        phone: '',
        email: '',
        projectDetails: '',
      });
      setSelectedCategory(ProductCategory[0]);
    } catch (error) {
      toast.error("Error: " + (error?.data?.message || "Please try again."), { id: toastId });
    }
  };

  return (
    <div className="w-auto p-2 h-max bg-white rounded-[23px] border border-gray-400 max-460:w-[94%] max-460:h-max">
      <div className="w-full h-max flex justify-center pb-5 items-center flex-col gap-5">
        <h1 className="text-[36px] text-[#FFCF67] font-black">Contact us</h1>
        <p className="text-[24px] font-bold text-[#737373]">
          Get in touch with <span className="text-[#FFCF67]">Khaled El Gamal</span>
        </p>
        <p className='w-full h-max text-[#00000054] text-[20px] font-medium text-center'>
          Tell us what product you need, and we'll get back to you within 24 hours
        </p>
      </div>

      <form onSubmit={handleSubmit} className="pb-7 text-black">
        <div className='w-full h-max pb-10 flex justify-center items-center'>
          <select
            className='w-[80%] p-2 rounded-[30px] text-[16px] font-semibold text-[#FFCF67] bg-white border border-[#FFCF67] shadow-sm transition-all duration-200 focus:outline-none focus:border-[#FFCF67] focus:ring-2 focus:ring-[#FFCF67]'
            value={selectedCategory}
            onChange={handleOptionChange}
            disabled={isLoading}
          >
            {ProductCategory.map((category, index) => (
              <option className="bg-white text-black font-semibold text-center" key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        {errors.category && <p className="text-red-500 text-sm text-center mb-2">{errors.category}</p>}

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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
            {errors.projectDetails && <p className="text-red-500 text-sm mt-1">{errors.projectDetails}</p>}
          </div>
        </div>

        <div className="w-full flex justify-center mt-8">
          <button
            type="submit"
            disabled={isLoading}
            className="w-[80%] h-14 bg-[#FFCF67] text-white text-xl font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
      {isLoading && <Loading />}
    </div>
  );
};

export default BusinessForm;
