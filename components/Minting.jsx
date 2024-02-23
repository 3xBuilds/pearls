'use client'

import Image from "next/image";
import PearlMint from "./Mint/PearlMint";

import { useAccount } from 'wagmi'
import { useEffect, useState } from "react";

import bg from "../assets/images/taco-truck-night.png"
import bgConnected from "../assets/images/taco-truck-day-inside.png";
import bgMobile from "../assets/images/taco-truck-night-mobile.png";
import bgMobileConnected from "../assets/images/taco-truck-day-inside-mobile.png";

export default function Minting() {
  const { isConnected, address } = useAccount()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [isConnected])


  return (
    <>
      {/* Background */}
      <div className="absolute top-0 left-0 w-screen h-screen z-0 md:block max-h-screen overflow-hidden">
        <div className="relative h-full">
          {!isConnected && isClient && <Image width={1920} height={1080} src={bg} className="object-cover max-sm:hidden w-full h-full" />}
          {isConnected && isClient && <Image width={1920} height={1080} src={bgConnected} className="object-cover max-sm:hidden w-full h-full scale-110" />}
          {!isConnected && isClient && <Image width={1920} height={1080} src={bgMobile} className="object-cover sm:hidden h-full" />}
          {isConnected && isClient && <Image width={1920} height={1080} src={bgMobileConnected} className="object-cover sm:hidden h-full" />}
        </div>
      </div>

      <main className=" w-screen h-screen relative">
        <PearlMint/>
      </main>
    </>
  );
}
