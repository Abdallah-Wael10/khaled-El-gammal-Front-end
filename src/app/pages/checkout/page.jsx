"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCreateCheckoutMutation } from "@/app/features/Api/CheckoutApi";
import { clearCart } from "@/app/redux/slices/cartSlice";
import { toast } from "react-hot-toast";
import Nav1 from "@/app/components/Nav1/page";
import Footer from "@/app/components/footer/page";
import Cart from "@/app/components/Cart/page";
import Loading from "@/app/components/loading/page";
import Image from "next/image";
import { useGetShippingQuery } from "@/app/features/Api/ShippingApi";
import { motion } from "motion/react";
import { fadeUp, scaleTap, staggerContainer, staggerItem } from "@/app/lib/motion";

const fieldGroups = [
  [
    { label: "Name", name: "name", type: "text", placeholder: "Your Name", autocomplete: "name" },
    { label: "Phone", name: "phone", type: "tel", placeholder: "Your Phone", autocomplete: "tel" },
    { label: "Email", name: "email", type: "email", placeholder: "Your Email", autocomplete: "email" },
  ],
  [
    { label: "Country", name: "country", type: "text", placeholder: "Your Country", autocomplete: "country-name" },
    { label: "Governorate", name: "governorate", type: "text", placeholder: "Your Governorate", autocomplete: "address-level1" },
    { label: "Address", name: "address", type: "text", placeholder: "Your Address", autocomplete: "street-address" },
    { label: "Apartment", name: "apartment", type: "text", placeholder: "Your Apartment", autocomplete: "address-line2", optional: true },
  ],
];

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

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      (item.discountPrice && item.discountPrice > 0
        ? item.discountPrice * item.quantity
        : item.price * item.quantity),
    0
  );

  const total = subtotal + (shippingLoading ? 0 : shippingCost || 0);

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
        items: cart.map((item) => ({
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
    <div className="flex min-h-screen flex-col bg-[#fffaf0] text-[#211900]">
      <Nav1 />
      <Cart />
      <main className="flex-1">
        <section className="premium-section px-5 py-10 text-center sm:py-14">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mx-auto max-w-3xl">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#9b8b64]">Checkout</span>
            <h1 className="mt-4 text-4xl font-black text-[#211900] sm:text-5xl">Complete your order</h1>
            <p className="mt-4 text-base font-medium leading-7 text-[#70664f]">
              Add your contact and delivery details. Payment is currently cash on delivery.
            </p>
          </motion.div>
        </section>

        <section className="bg-white px-5 py-12">
          <motion.div
            className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.35fr_0.85fr]"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.section className="premium-surface rounded-[28px] p-5 sm:p-8" variants={staggerItem}>
              <div className="mb-8">
                <h2 className="text-2xl font-black text-[#211900]">Your Info</h2>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#eee6cf]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#f2c95c] to-[#b88710]"
                    initial={{ scaleX: 0, transformOrigin: "left" }}
                    animate={{ scaleX: 0.55 }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>

              <form className="text-[#211900]" onSubmit={handleSubmit}>
                <div className="grid gap-8">
                  <div>
                    <h3 className="mb-5 text-lg font-black text-[#6f5702]">Contact Information</h3>
                    <div className="grid gap-5 md:grid-cols-3">
                      {fieldGroups[0].map((field) => (
                        <label key={field.name} className="grid gap-2 text-sm font-bold text-[#6f5702]">
                          {field.label}
                          <input
                            type={field.type}
                            name={field.name}
                            className="premium-input w-full px-4 py-3"
                            placeholder={field.placeholder}
                            value={userInfo[field.name]}
                            onChange={handleChange}
                            autoComplete={field.autocomplete}
                            required={!field.optional}
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-5 text-lg font-black text-[#6f5702]">Address Details</h3>
                    <div className="grid gap-5 md:grid-cols-2">
                      {fieldGroups[1].map((field) => (
                        <label key={field.name} className="grid gap-2 text-sm font-bold text-[#6f5702]">
                          {field.label}
                          <input
                            type={field.type}
                            name={field.name}
                            className="premium-input w-full px-4 py-3"
                            placeholder={field.placeholder}
                            value={userInfo[field.name]}
                            onChange={handleChange}
                            autoComplete={field.autocomplete}
                            required={!field.optional}
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <label className="grid gap-2 text-sm font-bold text-[#6f5702]">
                    Notes <span className="font-semibold text-[#9b8b64]">(Optional)</span>
                    <textarea
                      name="notes"
                      rows={5}
                      className="premium-input min-h-[140px] w-full resize-y px-4 py-3"
                      placeholder="Delivery notes or product preferences"
                      value={userInfo.notes}
                      onChange={handleChange}
                    />
                  </label>

                  <div>
                    <h3 className="mb-4 text-lg font-black text-[#6f5702]">Payment Method</h3>
                    <label className="flex min-h-14 items-center gap-3 rounded-2xl border border-[#ead9a5] bg-[#fffaf0] px-5 py-4">
                      <input
                        type="checkbox"
                        id="cash-on-delivery"
                        name="payment-method"
                        value="cash-on-delivery"
                        className="h-5 w-5 accent-[#b88710]"
                        checked
                        readOnly
                      />
                      <span className="text-base font-bold text-[#211900]">Cash on Delivery</span>
                    </label>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="premium-button flex w-full items-center justify-center px-8 text-lg disabled:cursor-not-allowed disabled:opacity-60"
                    {...scaleTap}
                  >
                    {isLoading ? "Placing Order..." : "Order Now"}
                  </motion.button>
                </div>
              </form>
            </motion.section>

            <motion.aside className="premium-surface h-max rounded-[28px] p-5 sm:p-8 lg:sticky lg:top-28" variants={staggerItem}>
              <h2 className="mb-5 text-2xl font-black text-[#211900]">Your Items</h2>
              {!hydrated ? (
                <Loading variant="inline" message="Loading cart..." detail="Checking your selected items" />
              ) : (
                <>
                  <div className="custom-scrollbar flex max-h-[380px] flex-col gap-4 overflow-y-auto pr-1">
                    {cart.length === 0 ? (
                      <span className="rounded-2xl bg-[#fffaf0] px-5 py-6 text-center font-semibold text-[#70664f]">
                        Your cart is empty.
                      </span>
                    ) : (
                      cart.map((item) => (
                        <div key={item.id} className="grid grid-cols-[70px_1fr_auto] items-center gap-3 border-b border-[#ead9a5] pb-4">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.mainImage}`}
                            alt={item.title}
                            width={70}
                            height={70}
                            priority
                            className="aspect-square rounded-xl border border-[#ead9a5] object-cover"
                          />
                          <div className="min-w-0">
                            <div className="truncate font-bold text-[#211900]">{item.title}</div>
                            <div className="font-semibold text-[#b88710]">
                              {item.discountPrice && item.discountPrice > 0 ? (
                                <>
                                  <span>{item.discountPrice} LE</span>
                                  <span className="ml-2 text-sm text-red-500 line-through">{item.price} LE</span>
                                </>
                              ) : (
                                <span>{item.price} LE</span>
                              )}
                            </div>
                            <div className="text-sm text-[#70664f]">
                              Qty: {item.quantity} {item.size && <>| Size: {item.size}</>}
                            </div>
                          </div>
                          <div className="text-right text-sm font-black text-[#211900]">
                            {(item.discountPrice && item.discountPrice > 0
                              ? item.discountPrice * item.quantity
                              : item.price * item.quantity)}{" "}
                            LE
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="mt-5 border-t border-[#ead9a5] pt-5 text-[#211900]">
                    <div className="flex justify-between text-base font-semibold text-[#70664f]">
                      <span>Subtotal</span>
                      <span>{subtotal} LE</span>
                    </div>
                    <div className="mt-2 flex justify-between text-base font-semibold text-[#70664f]">
                      <span>Shipping</span>
                      <span>
                        {shippingLoading
                          ? "..."
                          : shippingCost === 0
                          ? "Free Shipping"
                          : `${shippingCost} LE`}
                      </span>
                    </div>
                    <div className="mt-4 flex justify-between border-t border-[#ead9a5] pt-4 text-2xl font-black text-[#b88710]">
                      <span>Total</span>
                      <span>{shippingLoading ? "..." : `${total} LE`}</span>
                    </div>
                  </div>
                </>
              )}
            </motion.aside>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CheckOut;
