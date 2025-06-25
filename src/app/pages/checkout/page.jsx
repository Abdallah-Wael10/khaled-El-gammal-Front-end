"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCreateCheckoutMutation } from "@/app/features/Api/CheckoutApi";
import { clearCart } from "@/app/redux/slices/cartSlice";
import { toast } from "react-hot-toast";
import Nav1 from "@/app/components/Nav1/page";
import Footer from "@/app/components/footer/page";
import Image from "next/image";
import { useGetShippingQuery } from "@/app/features/Api/ShippingApi";

const CheckOut = () => {
  const [createCheckout, { isLoading }] = useCreateCheckoutMutation();
  const cart = useSelector((state) => state.cart.items);
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    email: "",
    country: "",
    governorate: "",
    address: "",
    apartment: "",
    notes: "",
  });
  const dispatch = useDispatch();
  const [hydrated, setHydrated] = useState(false);
  const { data: shippingData, isLoading: shippingLoading } = useGetShippingQuery();
  const shippingCost = typeof shippingData?.shippingCost === "number" ? shippingData.shippingCost : 0;

  useEffect(() => {
    setHydrated(true);
  }, []);

  // subtotal بالخصم لو موجود
  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      (item.discountPrice && item.discountPrice > 0
        ? item.discountPrice * item.quantity
        : item.price * item.quantity),
    0
  );

  // احسب التوتال بشكل آمن مع الشحن
  const total = subtotal + (shippingLoading ? 0 : (shippingCost || 0));

  const handleChange = (e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("Cart is empty!");
      return;
    }
    try {
      await createCheckout({
        userInfo,
        items: cart.map(item => ({
          productId: item.id,
          title: item.title,
          price: item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.price,
          mainImage: item.mainImage,
          quantity: item.quantity,
          size: item.size,
          originalPrice: item.price,
          discountPrice: item.discountPrice,
        })),
        total,
      }).unwrap();
      toast.success("Order placed successfully!");
      dispatch(clearCart());
    } catch (err) {
      toast.error(err?.data?.message || "Checkout failed");
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Nav1 />
      <main className="flex-1 w-full flex flex-col items-center justify-center py-10 px-2">
        <div className="w-full max-w-7xl flex flex-col md:flex-row gap-8 max-[900px]:flex-wrap">
          {/* Left: User Info */}
          <section className="w-full  bg-white rounded-2xl shadow-xl border border-[#FFCF67]/40 p-8 transition-all duration-300 max-[900px]:w-full">
            {/* Stepper */}
            <div className="flex flex-col gap-2 mb-8">
              <h1 className="text-xl font-bold text-[#FFCF67]">Step 1 - Your Info</h1>
              <div className="w-full h-3 bg-[#E4E4E7] rounded-full overflow-hidden">
                <div className="h-full bg-[#FFCF67] rounded-full transition-all duration-500" style={{ width: "50%" }} />
              </div>
            </div>
            {/* Contact Info */}
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Contact Information</h2>
            <form className="flex text-black flex-col gap-8" onSubmit={handleSubmit}>
              <div className="flex flex-wrap gap-6">
                <div className="flex-1 min-w-[180px] relative">
                  <label className="absolute -top-3 left-4 text-sm text-[#FFCF67] bg-white px-1 font-semibold">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#FFCF67] transition-all duration-300"
                    placeholder="Your Name"
                    value={userInfo.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex-1 min-w-[180px] relative">
                  <label className="absolute -top-3 left-4 text-sm text-[#FFCF67] bg-white px-1 font-semibold">Phone</label>
                  <input
                    type="number"
                    name="phone"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#FFCF67] transition-all duration-300"
                    placeholder="Your Phone"
                    value={userInfo.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex-1 min-w-[180px] relative">
                  <label className="absolute -top-3 left-4 text-sm text-[#FFCF67] bg-white px-1 font-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#FFCF67] transition-all duration-300"
                    placeholder="Your Email"
                    value={userInfo.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              {/* Address */}
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Address Details</h2>
              <div className="flex flex-col md:flex-row gap-6 w-full">
                <div className="flex-[1.3] flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="relative w-1/2">
                      <label className="absolute -top-3 left-4 text-sm text-[#FFCF67] bg-white px-1 font-semibold">Country</label>
                      <input
                        type="text"
                        name="country"
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#FFCF67] transition-all duration-300"
                        placeholder="Your Country"
                        value={userInfo.country}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="relative w-1/2">
                      <label className="absolute -top-3 left-4 text-sm text-[#FFCF67] bg-white px-1 font-semibold">Governorate</label>
                      <input
                        type="text"
                        name="governorate"
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#FFCF67] transition-all duration-300"
                        placeholder="Your Governorate"
                        value={userInfo.governorate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="relative w-1/2">
                      <label className="absolute -top-3 left-4 text-sm text-[#FFCF67] bg-white px-1 font-semibold">Address</label>
                      <input
                        type="text"
                        name="address"
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#FFCF67] transition-all duration-300"
                        placeholder="Your Address"
                        value={userInfo.address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="relative w-1/2">
                      <label className="absolute -top-3 left-4 text-sm text-[#FFCF67] bg-white px-1 font-semibold">Apartment</label>
                      <input
                        type="text"
                        name="apartment"
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#FFCF67] transition-all duration-300"
                        placeholder="Your Apartment"
                        value={userInfo.apartment}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                {/* Right: Notes */}
                <div className="flex-[0.7] flex flex-col">
                  <div className="relative h-full">
                    <label className="absolute -top-3 left-4 text-sm text-[#FFCF67] bg-white px-1 font-semibold">Notes (Optional)</label>
                    <textarea
                      name="notes"
                      rows={6}
                      className="w-full h-full min-h-[120px] border border-gray-200 rounded-lg px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#FFCF67] transition-all duration-300 resize-none"
                      placeholder="Your Notes"
                      value={userInfo.notes}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              {/* Payment */}
              <div className="flex flex-col gap-4 mt-4">
                <h3 className="text-base font-semibold text-gray-800">Select your preferred payment method</h3>
                <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-5 py-4 hover:shadow-md transition-all duration-300">
                  <input
                    type="checkbox"
                    id="cash-on-delivery"
                    name="payment-method"
                    value="cash-on-delivery"
                    className="accent-[#FFCF67] w-5 h-5 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-[#FFCF67]"
                    checked
                    readOnly
                  />
                  <label htmlFor="cash-on-delivery" className="text-base font-semibold text-gray-700">
                    Cash on Delivery
                  </label>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 rounded-xl bg-[#FFCF67] text-white text-lg font-bold shadow-md hover:bg-[#FFD96B] hover:scale-105 active:scale-95 transition-all duration-300"
              >
                {isLoading ? "Placing Order..." : "Order Now"}
              </button>
            </form>
          </section>
          {/* Right: Order Summary */}
          <section className="w-full  min-h-[705px] bg-white rounded-2xl shadow-xl border border-[#FFCF67]/40 p-8 flex flex-col gap-6 transition-all duration-300 max-[900px]:w-full">
            <h2 className="text-xl font-bold text-[#FFCF67] mb-4">Your Items</h2>
            {!hydrated ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 italic text-center min-h-[200px]">
                Loading...
              </div>
            ) : (
              <>
                <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[350px]">
                  {cart.length === 0 ? (
                    <span className="text-gray-400 italic text-center">Your cart is empty.</span>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 border-b border-gray-100 pb-3">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.mainImage}`}
                          alt={item.title}
                          width={70}
                          height={70}
                          priority
                          className="rounded-lg object-cover border border-[#FFCF67]/30"
                        />
                        <div className="flex-1 max-[321px]:text-[9px]">
                          <div className="font-semibold text-[#FFCF67]">{item.title}</div>
                          <div className="text-gray-700 font-medium ">
                            {item.discountPrice && item.discountPrice > 0 ? (
                              <>
                                <span>{item.discountPrice} LE</span>
                                <span className="ml-2 text-red-500 line-through text-sm max-[321px]:text-[9px]">{item.price} LE</span>
                              </>
                            ) : (
                              <span>{item.price} LE</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">Qty: {item.quantity} {item.size && <>| Size: {item.size}</>}</div>
                        </div>
                        <div className="font-bold text-black">
                          {(item.discountPrice && item.discountPrice > 0
                            ? item.discountPrice * item.quantity
                            : item.price * item.quantity)}{" "}
                          LE
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="border-t border-[#FFCF67]/30 text-black pt-4 flex flex-col gap-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Subtotal</span>
                    <span>{subtotal} LE</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Shipping</span>
                    <span>
                      {shippingLoading
                        ? "..."
                        : shippingCost === 0
                        ? "Free Shipping"
                        : `${shippingCost} LE`}
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-[#FFCF67]">
                    <span>Total</span>
                    <span>
                      {shippingLoading
                        ? "..."
                        : `${subtotal + (typeof shippingCost === "number" ? shippingCost : 0)} LE`}
                    </span>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>

  );
};

export default CheckOut;
