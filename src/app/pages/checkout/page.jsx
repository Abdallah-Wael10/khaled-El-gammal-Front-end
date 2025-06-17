import React from "react";
import Nav1 from "@/app/components/Nav1/page";
import Footer from "@/app/components/footer/page";

const CheckOut = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Nav1 />
      <main className="flex-1 w-full flex flex-col items-center justify-center py-10 px-2">
        <div className="w-full max-w-7xl flex flex-col md:flex-row gap-8">
          {/* Left: User Info */}
          <section className="w-full md:w-[60%] bg-white rounded-2xl shadow-xl border border-[#FFCF67]/40 p-8 transition-all duration-300">
            {/* Stepper */}
            <div className="flex flex-col gap-2 mb-8">
              <h1 className="text-xl font-bold text-[#FFCF67]">Step 1 - Your Info</h1>
              <div className="w-full h-3 bg-[#E4E4E7] rounded-full overflow-hidden">
                <div className="h-full bg-[#FFCF67] rounded-full transition-all duration-500" style={{ width: "50%" }} />
              </div>
            </div>
            {/* Contact Info */}
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Contact Information</h2>
            <form className="flex text-black flex-col gap-8">
              <div className="flex flex-wrap gap-6">
                <div className="flex-1 min-w-[180px] relative">
                  <label className="absolute -top-3 left-4 text-sm text-[#FFCF67] bg-white px-1 font-semibold">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#FFCF67] transition-all duration-300"
                    placeholder="Your Name"
                  />
                </div>
                <div className="flex-1 min-w-[180px] relative">
                  <label className="absolute -top-3 left-4 text-sm text-[#FFCF67] bg-white px-1 font-semibold">Phone</label>
                  <input
                    type="number"
                    name="phone"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#FFCF67] transition-all duration-300"
                    placeholder="Your Phone"
                  />
                </div>
                <div className="flex-1 min-w-[180px] relative">
                  <label className="absolute -top-3 left-4 text-sm text-[#FFCF67] bg-white px-1 font-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#FFCF67] transition-all duration-300"
                    placeholder="Your Email"
                  />
                </div>
              </div>
              {/* Address */}
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Address Details</h2>
              <div className="flex flex-col md:flex-row gap-6 w-full">
                {/* Left: Address Inputs in two lines, wider */}
                <div className="flex-[1.3] flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="relative w-1/2">
                      <label className="absolute -top-3 left-4 text-sm text-[#FFCF67] bg-white px-1 font-semibold">Country</label>
                      <input
                        type="text"
                        name="country"
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#FFCF67] transition-all duration-300"
                        placeholder="Your Country"
                      />
                    </div>
                    <div className="relative w-1/2">
                      <label className="absolute -top-3 left-4 text-sm text-[#FFCF67] bg-white px-1 font-semibold">Governorate</label>
                      <input
                        type="text"
                        name="governorate"
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#FFCF67] transition-all duration-300"
                        placeholder="Your Governorate"
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
                      />
                    </div>
                    <div className="relative w-1/2">
                      <label className="absolute -top-3 left-4 text-sm text-[#FFCF67] bg-white px-1 font-semibold">Apartment</label>
                      <input
                        type="text"
                        name="apartment"
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#FFCF67] transition-all duration-300"
                        placeholder="Your Apartment"
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
                  />
                  <label htmlFor="cash-on-delivery" className="text-base font-semibold text-gray-700">
                    Cash on Delivery
                  </label>
                </div>
                <div className="flex items-center gap-3 px-5 py-4">
                  <input
                    type="checkbox"
                    id="save-info"
                    name="save-info"
                    value="save-info"
                    className="accent-[#FFCF67] w-5 h-5 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-[#FFCF67]"
                  />
                  <label htmlFor="save-info" className="text-base font-semibold text-gray-700">
                    Save this information for next time
                  </label>
                </div>
              </div>
            
            </form>
          </section>
          {/* Right: Order Summary */}
          <section className="w-full md:w-[40%] min-h-[705px] bg-white rounded-2xl shadow-xl border border-[#FFCF67]/40 p-8 flex flex-col gap-6 transition-all duration-300">
            {/* Placeholder for selected items and total */}
            <h2 className="text-xl font-bold text-[#FFCF67] mb-4">Selected items</h2>
            <div className="flex-1 flex flex-col justify-center items-center text-gray-400 italic">
              <span>Your selected items will appear here.</span>
            </div>
            <div className="border-t border-[#FFCF67]/30 text-black pt-4 flex flex-col gap-2">
              <div className="flex justify-between text-lg font-semibold">
                <span>Subtotal</span>
                <span>0 LE</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Shipping</span>
                <span>0 LE</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-[#FFCF67]">
                <span>Total</span>
                <span>0 LE</span>
              </div>

            </div>
              {/* Submit Button */}
              <div className="flex justify-end mt-8">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-[#FFCF67] text-white text-lg font-bold shadow-md hover:bg-[#FFD96B] hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Place Order
                </button>
              </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckOut;
