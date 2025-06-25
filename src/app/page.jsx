"use client";
import Image from "next/image";
import Nav1 from "./components/Nav1/page";
import Footer from "./components/footer/page";
import Card from "./components/Card/page";
import GallerySlider from "./components/gallarySlider/page";
import Form from "./components/Form/page";
import facebook from "./images/facebook.svg";
import wp from "./images/wp.svg";
import insta from "./images/instaa.svg";
import map from "./images/mapp.svg";
import dogleft from "./images/dogleft.svg";
import dogright from "./images/dogright.svg";
import draw from "./images/draw.svg";
import Link from "next/link";
import Cart from "./components/Cart/page";
import { useGetProductsQuery } from "./features/Api/ProductApi";

export default function Home() {
  const { data: Products = [], isLoading } = useGetProductsQuery();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // Shuffle function
  function shuffle(array) {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  // Get 4 random products
  const randomProducts = shuffle(Products).slice(0, 4);

  return (
    <main>
      <Nav1 />
      <Cart />
      <section className="w-full  aspect-[80/50] bg-home bg-cover bg-no-repeat flex flex-col items-center justify-center  ">
        <h1 className=" w-full h-max text-[48px] font-extrabold text-center text-white [text-shadow:2px_2px_19px_#F9E18BD1] max-[900px]:text-[20px]">
          KHALED EL GAMAL
        </h1>
        <h1 className=" w-full h-max text-[48px] font-extrabold text-center text-white  [text-shadow:2px_2px_19px_#F9E18BD1] max-[900px]:text-[20px]">
          The Power Of Creativity
        </h1>
        <div className="w-[13%] h-max p-3 bg-[#01010166] rounded-[22px] flex items-center justify-center gap-5 mt-4 max-[600px]:w-[45%] max-[900px]:w-[25%]  max-[1439px]:w-[21%] ">
          <a href="tel:+201159227861" target="_blank" rel="noopener noreferrer">
            <Image
              src={wp}
              alt="whatsapp"
              width={24}
              height={24}
              className=""
            />
          </a>
          <a href="http://" target="_blank" rel="noopener noreferrer">
            <Image
              src={insta}
              alt="instagram"
              width={24}
              height={24}
              className=""
            />
          </a>
          <a href="http://" target="_blank" rel="noopener noreferrer">
            <Image
              src={facebook}
              alt="facebook"
              width={24}
              height={24}
              className=""
            />
          </a>
          <a
            href="https://maps.app.goo.gl/fusJbKjX4nHmefsC8?g_st=iw"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src={map} alt="map" width={24} height={24} className="" />
          </a>
        </div>
      </section>
      <section className="w-full h-max flex bg-white">
        <div className="w-[25%] pt-10 h-max ml-2 max-[900px]:hidden">
          <div className="w-[100%] h-max relative flex items-center justify-end pr-5">
            {/* Blurred background layer */}
            <div className="w-full absolute inset-0 rounded-r-full bg-[#FFCF67]/30 blur-2xl z-0" />

            {/* Sharp image layer */}
            <div className="relative z-10">
              <Image src={dogleft} alt="dog icon left" />
            </div>
          </div>
        </div>
        <div className="w-[48%] h-max pb-10 pt-5 flex justify-start items-center flex-col gap-5 max-[900px]:w-full max-[900px]:p-5">
          <span className="w-full h-max text-[#BCBCBC] text-[24px] font-normal text-center">
            Who we are
          </span>
          <h1 className="w-full h-max text-[36px] text-[#FFCF67] font-semibold text-center max-[900px]:text-[29px]">
            KHA<span className="text-[#CFA854]">LED EL G</span>AMAL
          </h1>
          <p className="w-full h-max text-center text-[16px] text-black font-normal">
            Khaled El Gammal - 19 Years of Artistic Excellence With over 19
            years of experience, Khaled El Gammal is a distinguished destination
            for the finest treasures of Khan El Khalili. Renowned for
            exceptional handcrafted products, the shop reflects a deep
            appreciation for Egyptian heritage and artisanal mastery. Each piece
            is a testament to our creative strength, blending tradition with
            innovation to deliver truly artistic and unique creations. Our
            philosophy: The Power of Creativity.
          </p>
        </div>
        <div className="w-[25%] pt-10  h-max max-[900px]:hidden">
          <div className="w-[100%] h-max relative flex items-center justify-start pl-5">
            {/* Blurred background layer */}
            <div className="w-full absolute inset-0 rounded-l-full bg-[#FFCF67]/30 blur-2xl z-0" />

            {/* Sharp image layer */}
            <div className="relative z-10">
              <Image src={dogright} alt="dog icon right" />
            </div>
          </div>
        </div>
      </section>
      <section className="w-full h-max flex bg-white max-[900px]:flex-wrap">
        <div className="w-[33%] h-max max-[900px]:w-full max-[900px]:flex max-[900px]:justify-center max-[900px]:items-center">
          <Image src={draw} alt="draw icon" priority />
        </div>
        <div className="w-[34%] h-max flex min-h-[238px] justify-center items-center max-[900px]:w-full">
          <h1 className="w-full text-[36px] font-semibold text-[#FFCF67] text-center">
            Trending Product
          </h1>
        </div>
        <div className="w-[33%] h-max max-[900px]:hidden">
          <Image src={draw} alt="draw icon" priority />
        </div>
      </section>
      <section className="w-full h-max bg-white pt-5 pb-5 flex justify-center items-center gap-10 flex-wrap">
        {randomProducts.map((product) => (
          <Card
            key={product._id}
            id={product._id}
            image={`${baseUrl}/uploads/${product.mainImage}`}
            title={product.title}
            price={product.price}
            description={product.description}
            discountPrice={product.discountPrice}
            inStock={product.inStock}
            stock={product.stock}
          />
        ))}

        <div className="w-full h-max flex justify-center items-center">
          <Link
            href="/pages/shop"
            className="mt-8 px-8 py-3 bg-[#FFCF67] text-white font-bold rounded-full shadow hover:bg-[#e6b94e] transition"
          >
            View Full Products
          </Link>
        </div>
      </section>
      <section className="w-full h-max pb-5 flex flex-col gap-5 bg-white">
        <div className="w-full h-max pt-5 pl-5 ">
          <h1 className="w-full h-max  text-[32px] font-semibold text-[#FFCF67]">
            Gallery Collection
          </h1>
        </div>
        <div className="w-full h-max flex justify-center items-center">
          <GallerySlider />
        </div>
      </section>
      <section className="w-full h-max pb-5 pt-5 bg-white flex justify-center items-center">
        <Form />
      </section>
      <Footer />
    </main>
  );
}
