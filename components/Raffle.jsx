'use client'

import Image from "next/image";
import { useAccount } from 'wagmi'
import { useEffect, useState } from "react";
import RaffleFetcher from "./Raffle/raffleFetcher";
import PastWinners from "./Raffle/pastwinners"

const contruction = "https://d19rxn9gjbwl25.cloudfront.net/projectImages/contructiontaco.png"


const bg = "https://d19rxn9gjbwl25.cloudfront.net/projectImages/taco-raffles/raffleBg.png";
const bgConnected = "https://d19rxn9gjbwl25.cloudfront.net/projectImages/taco-raffles/raffleLive.png";
const bgMobile = "https://d19rxn9gjbwl25.cloudfront.net/projectImages/taco-raffles/raffleBgMobile.png";
// const bgMobileConnected = "https://d19rxn9gjbwl25.cloudfront.net/projectImages/taco-raffles/raffleLiveMobile.png";

const banner = "https://d19rxn9gjbwl25.cloudfront.net/ui/taco_raffle_banner.png";
const guacLogo = "https://d19rxn9gjbwl25.cloudfront.net/ui/guac_coin.png";

import RaffleCard from "./Raffle/raffleCard"

import {raffleData} from "../EDITABLES/raffleData"

export default function Raffle() {
  const { isConnected, address } = useAccount()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [isConnected])

  return (
    <>
      {/* Background */}
      <div className="fixed top-0 left-0 w-screen h-full z-0 bg-[#d1ffc3] md:block overflow-x-hidden">
        <div className="relative h-full">
          {!isConnected && isClient && <Image width={1920} height={1080} src={bg} className="object-cover max-sm:hidden h-full" />}
          {isConnected && isClient && <Image width={1920} height={1080} src={bgConnected} className="object-cover max-sm:hidden h-full" />}
          {!isConnected && isClient && <Image width={1920} height={1080} src={bgMobile} className="object-cover sm:hidden h-full" />}
          {/* {isConnected && isClient && <Image width={1920} height={1080} src={bgMobileConnected} className="object-cover sm:hidden " />} */}
        </div>
      </div>

      {isConnected && isClient && <main className="flex flex-col items-center overflow-x-hidden gap-10 w-screen max-[1240px]:bg-[#d1ffc3] max-[1240px]:h-fit relative">
        <div className="relative w-[50%] max-md:w-[90%] pt-16 mt-10 ">
          <Image width={1920} height={1080} src={banner} className="h-full" />
        </div>
        <div className="text-black text-center">
          <h1 className="text-4xl max-sm:px-10 max-sm:text-3xl">Purchase Tickets Using<span className=" inline-block ml-2 "><Image className="w-10" width={100} height={100} src={guacLogo}></Image></span> $Guac!</h1>

          <div className="grid gap-5 lg:grid-cols-4 max-lg:grid-cols-2 max-lg:w-[80%] max-md:grid-cols-1 w-[90%] mx-auto mt-10">
            <RaffleFetcher number = {1}/>
            <RaffleFetcher number = {2}/>
            <RaffleFetcher number = {3}/>
            <RaffleFetcher number = {4}/>
          </div>

        </div>
        <div className=" text-black translate-y-5 text-center">
          <h1 className="text-5xl">PREVIOUS WINNERS:</h1>
        </div>
        <div className="w-[85%] shadow-inner shadow-black/50 px-6 py-10 flex flex-wrap items-center justify-center gap-10 border-4 rounded-[32px] border-black bg-lime-300 mb-10">
        <div className="grid gap-5 lg:grid-cols-4 max-lg:grid-cols-2 max-lg:w-[80%] max-md:grid-cols-1 w-[90%] mx-auto mt-10">
          <PastWinners num={1}/>
          <PastWinners num={2}/>
          <PastWinners num={3}/>
          <PastWinners num={4}/>
        </div>
        </div>
      </main>}

{/* <div className="relative z-10 text-center top-[10rem]">
        <Image width={1920} height={1080} src={contruction} className="w-[20rem] mx-auto"/>
        <h1 className="text-black text-[2rem]">Under Construction!</h1>
      </div> */}

    </>
  );
}
