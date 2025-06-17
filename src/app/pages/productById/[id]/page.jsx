"use client"
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";import { useContext } from "react";
import Nav1 from '@/app/components/Nav1/page'
import Footer from '@/app/components/footer/page'
import Card from '@/app/components/Card/page'
import vasa from "@/app/components/Nav1/images/vasa.png";
import Image from "next/image";
const ProductById = () => {
  //     const { id } = useParams();
  // const { Projects} = useContext();
  // const [project, setProject] = useState(null);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  // const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  // const imageRefs = useRef([]); // Reference for images
  // const [visibleImages, setVisibleImages] = useState({}); // Store visibility status

  // useEffect(() => {
  //   if (!id) return;

  //   const fetchProjectById = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);
  //       const response = await fetch(`${baseUrl}/api/projects/${id}`);

  //       if (!response.ok) throw new Error("Failed to fetch project");

  //       const data = await response.json();
  //       setProject(data);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProjectById();
  // }, [id, baseUrl]);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           setVisibleImages((prev) => ({
  //             ...prev,
  //             [entry.target.dataset.index]: true,
  //           }));
  //         }
  //       });
  //     },
  //     { threshold: 0.3 } // Trigger when 30% of the image is visible
  //   );

  //   imageRefs.current.forEach((img) => img && observer.observe(img));

  //   return () => {
  //     imageRefs.current.forEach((img) => img && observer.unobserve(img));
  //   };
  // }, [project]); // Run after project is loaded

  // if (loading) return <LoadingSpinner />;
  // if (error) return <h1 className="text-red-500">{error}</h1>;
  // if (!project) return null;
const SizeFilter = [
   "Small",
   "Medium",
   "Large"
]
  const detailsRef = useRef(null);

  return (
    <div className="bg-white">
      <Nav1 />
      <section className="w-full h-max  pb-5 pt-15 flex justify-center items-center gap-10 ">
               <div className="w-[45%] h-[490px] rounded-[18px] bg-white border-[#00000026] flex items-center justify-center shadow-xl overflow-hidden">
                  <Image
                    src={vasa}
                    width={'100%'}
                    height={400}
                    sizes="(max-width: 900px) 80vw, 400px"
                    className="object-contain max-h-[90%] max-w-[100%] transition-transform duration-300 hover:scale-105"
                    alt="Certifications"
                    priority
                    quality={100}
                    style={{ imageRendering: "auto" }}
                  />
                </div>
               <div className="w-[40%] h-max pb-5 pl-10 pt-4 rounded-[18px] ">
                <h1 className="w-full h-max pb-5 text-[18px] text-[#A4A4A4] font-bold text-start ">KHALED EL GAMAL</h1>
                <h1 className="w-full h-max pb-5 text-[24px] text-[#FFCF67] font-semibold text-start">VASA EGY</h1>
                <span className="w-full h-max pb-5 text-[18px] text-[#FFCF67] font-semibold text-start">EGP 800</span>
                <p className="w-[50%] h-max pb-5 pt-5 text-[14px]  text-[#BCBCBC] font-semibold text-start">Please add your content here. Keep it short and simple. And smile  </p>
                <h2 className="w-full h-max pb-5 text-[14px] text-[#A4A4A4] font-semibold text-start">6 items in stock</h2>
                <h2 className="w-full h-max pb-5 text-[12px] text-black font-normal text-start">QUANTITY</h2>
                <div className="w-full h-max flex justify-center items-center gap-2">
                    <div className="w-1/2  h-max pl-2 pb-2 pt-2  bg-white flex justify-start items-center border border-[#00000014] rounded-[8px]">
                        <button className="w-[15%] h-[30px] active:scale-75 transition-all ease-in-out   flex justify-center items-center rounded-[10px]   text-[12px] bg-[#FFCF67] text-white font-semibold">-</button>
                        <span className="px-3 py-1 text-[13px] text-black  font-normal">1</span>
                        <button className="w-[15%] h-[30px] active:scale-75  transition-all ease-in-out  flex justify-center items-center rounded-[10px]   text-[12px] bg-[#FFCF67] text-white font-semibold">+</button>
                    </div>
                    <div className="w-1/2 h-max  flex justify-center items-center ">
                       <select className='w-[50%] p-2 rounded-[10px] text-[16px] font-semibold text-[#FFCF67] bg-white border border-[#FFCF67] shadow-sm transition-all duration-200 focus:outline-none focus:border-[#FFCF67] focus:ring-2 focus:ring-[#FFCF67]' defaultValue="">
                           <option value="" disabled hidden>Size</option>
                           {SizeFilter.map((size, index) => (
                                    <option className="bg-white text-black font-medium" key={index} value={size}>
                                        {size}
                                  </option>
                              ))}
                       </select>
                    </div>
                </div>
                <div className="w-full h-max pt-5 flex justify-start items-center gap-5">
                    <button className="w-[40%] h-[42px]  text-[16px] font-semibold bg-white border rounded-[12px] border-[#00000033] text-black hover:shadow-[2px_2px_19px_#FFCF67] transition-all duration-300 ease-in-out active:scale-75 ">Add to Cart</button>
                    <button className="w-[40%] h-[42px] rounded-[12px] text-[16px] font-semibold bg-[#FFCF67] text-white hover:shadow-[2px_2px_19px_#FFCF67] transition-all duration-300 ease-in-out active:scale-75">Buy Now</button>
                </div>
                {/* dropdown with details and text Shipping, Return & Refund Policies */}
                <div className="w-full h-max pt-5 flex justify-start">
 
 <details
      ref={detailsRef}
      className="group w-[60%]  border border-amber-400 rounded-2xl bg-white shadow-xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl focus-within:ring-2 focus-within:ring-amber-300"
      aria-label="Shipping, Return & Refund Policies"
    >
      <summary
        className="flex items-center gap-3 cursor-pointer px-6 py-4 text-[14px] font-semibold text-black select-none bg-white group-open:bg-amber-50 rounded-t-2xl transition-all duration-200 hover:bg-amber-100 focus:outline-none focus:bg-amber-100"
        aria-controls="accordion-content"
      >
        <svg
          className="w-5 h-5 text-amber-400 transition-transform duration-300 ease-in-out group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        Shipping, Return & Refund Policies
      </summary>
      <div
        id="accordion-content"
        className="details-content px-6 pt-2 pb-6 text-base text-gray-600 leading-relaxed overflow-hidden"
        role="region"
      >
        <p className="mb-4">
          <span className="font-semibold text-amber-400">Shipping:</span> We deliver across Egypt within{' '}
          <span className="font-semibold">3-7 business days</span>. All items are securely packaged to ensure safe arrival.
        </p>
        <p className="mb-4">
          <span className="font-semibold text-amber-400">Returns:</span> If you are not satisfied with your purchase, you
          may return it within <span className="font-semibold">14 days</span> in its original condition for a full refund or
          exchange.
        </p>
        <p>
          <span className="font-semibold text-amber-400">Refunds:</span> Refunds are processed within{' '}
          <span className="font-semibold">5 business days</span> after we receive your returned item. For any questions,
          please contact our support team.
        </p>
      </div>
    </details>

</div>

               </div> 
      </section>
      <section className="w-full h-max pb-10 pt-10 flex flex-col justify-center items-center bg-white">
                <h1 className="w-full h-max pb-5 text-center text-[42px] text-[#FFCF67] font-medium"> items that you can't miss out on</h1>
                <div className="w-full h-max flex pt-5 justify-center items-center gap-10 flex-wrap">
                      <Card />
                      <Card />
                      <Card />
                      <Card />
                      <Card />
                      <Card />
                      <Card />
                      <Card />
                </div>
      </section>
      <Footer />
      
    </div>
  )
}

export default ProductById
