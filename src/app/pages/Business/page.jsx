import React from 'react'
import Nav1 from '@/app/components/Nav1/page'
import Footer  from '@/app/components/footer/page'
import Image from 'next/image'
import Svg from "./images/own.svg"
import dollar from "./images/dollar.svg"
import setting from "./images/setting.svg"
import support from "./images/support.svg"
import quality from "./images/quality.svg"
import BusinessForm from '@/app/components/BusinessForm/page'
import Cart from '@/app/components/Cart/page';

const Business = () => {
  return (
    <main className='bg-white'>
      <Nav1 />
      <Cart />
      <section className='w-full h-max pt-10 pb-5 flex justify-center items-center bg-white'>
        <div className="w-full h-max pb-5 flex flex-col items-center justify-center">
          <h1 className='w-full h-max pb-2 text-[32px] text-black font-bold text-center max-[900px]:text-[26px] max-[420px]:text-[19px]'>
            Do you own a store or business?
          </h1>
          <p className='w-full h-max pb-2 text-[20px] font-normal text-[#919191] text-center max-[900px]:text-[17px] max-[420px]:text-[11px]'>
            handmade products special prices and guaranteed quality.
          </p>
          <Image src={Svg} alt="svg" className="mt-4 w-[400px] max-w-[90vw] max-[900px]:w-[80%]" />
        </div>
      </section>
      <section className='w-full h-max pb-5 bg-white flex flex-col justify-center items-center'>
        <h1 className='w-full h-max pb-5 text-[32px] font-normal text-center text-[#BCBCBC] max-[900px]:text-[26px]'>
          Why Buy from <span className='text-[#FFCF67]'>KHALED EL GAMAL</span>
        </h1>
        <div className='w-full h-max pb-5 flex flex-wrap justify-center items-center gap-0 max-[900px]:gap-5'>
          <div className='w-1/2 max-[900px]:w-full flex flex-col gap-5 justify-center items-center pb-5'>
            <div className='w-full max-w-[432px] min-w-0 flex justify-center items-center gap-5 rounded-2xl p-4 shadow transition-all hover:scale-105 max-[900px]:w-[95%]'>
              <div className='w-[40px] min-w-[40px] flex justify-center items-center'>
                <Image src={dollar} alt="dollar icon" className='w-8 h-8' />
              </div>
              <div className='flex-1 flex justify-start pl-3 items-center'>
                <h1 className='text-[18px] max-[900px]:text-[15px] font-medium text-black'>
                  Special prices for business owners
                </h1>
              </div>
            </div>
            <div className='w-full max-w-[432px] min-w-0 flex justify-center items-center gap-5 rounded-2xl p-4 shadow transition-all hover:scale-105 max-[900px]:w-[95%]'>
              <div className='w-[40px] min-w-[40px] flex justify-center items-center'>
                <Image src={setting} alt="setting icon" className='w-8 h-8' />
              </div>
              <div className='flex-1 flex justify-start pl-3 items-center'>
                <h1 className='text-[18px] max-[900px]:text-[15px] font-medium text-black'>
                  Product customization options
                </h1>
              </div>
            </div>
          </div>
          <div className='w-1/2 max-[900px]:w-full flex flex-col gap-5 justify-center items-center pb-5'>
            <div className='w-full max-w-[432px] min-w-0 flex justify-center items-center gap-5 rounded-2xl p-4 shadow transition-all hover:scale-105 max-[900px]:w-[95%]'>
              <div className='w-[40px] min-w-[40px] flex justify-center items-center'>
                <Image src={quality} alt="quality icon" className='w-8 h-8' />
              </div>
              <div className='flex-1 flex justify-start pl-3 items-center'>
                <h1 className='text-[18px] max-[900px]:text-[15px] font-medium text-black'>
                  High-quality craftsmanship
                </h1>
              </div>
            </div>
            <div className='w-full max-w-[432px] min-w-0 flex justify-center items-center gap-5 rounded-2xl p-4 shadow transition-all hover:scale-105 max-[900px]:w-[95%]'>
              <div className='w-[40px] min-w-[40px] flex justify-center items-center'>
                <Image src={support} alt="support icon" className='w-8 h-8' />
              </div>
              <div className='flex-1 flex justify-start pl-3 items-center'>
                <h1 className='text-[18px] max-[900px]:text-[15px] font-medium text-black'>
                  Dedicated support and delivery
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='w-full h-max pb-5 pt-10 justify-center items-center flex'>
        <BusinessForm />
      </section>
      <Footer />
    </main>
  )
}

export default Business
