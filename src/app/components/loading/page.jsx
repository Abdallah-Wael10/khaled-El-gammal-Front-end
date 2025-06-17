import React from 'react'
import GoldKey from "@/app/components/Cart/images/goldkey.svg"
import Image from "next/image"

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#FFF8E1] to-[#FFCF67]/30">
      <div className="relative flex items-center justify-center">
        <span className="animate-spin-slow inline-block">
          <Image
            src={GoldKey}
            alt="Loading"
            width={80}
            height={80}
            className="drop-shadow-lg"
            priority
          />
        </span>
      </div>
      <p className="mt-6 text-xl font-bold text-[#FFCF67] tracking-wide animate-pulse">
        Loading, please wait...
      </p>
    </div>
  )
}

export default Loading
