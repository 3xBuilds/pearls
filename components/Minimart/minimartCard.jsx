'use client'

import Image from "next/image";


const guacLogo = "https://d19rxn9gjbwl25.cloudfront.net/projectImages/staking/Guac logo small.png";

const buyUp = "https://d19rxn9gjbwl25.cloudfront.net/buttons/buyUp.png"
const buyDown = "https://d19rxn9gjbwl25.cloudfront.net/buttons/buyDown.png"

export default function MinimartCard({ id, name, img, cost, stateChangeFunction }) {

    return (
        <>
            <div className="flex flex-col items-center justify-center relative shadow-xl border-4 bg-gradient-to-b from-[#fa9292] to-[#f6c461] border-black rounded-xl p-4 w-[310px]">
                <div className="text-center">
                    <div className="border-4 border-black rounded-3xl w-full aspect-square overflow-hidden transition-transform transform hover:-rotate-3 ease-in-out duration-300">
                        <Image src={img} className=" object-cover h-full w-full bg-white" width={241} height={241} alt={"HEjhdsvcw"} />
                    </div>
                    <h1 className="text-black mt-3 ">{name} {id}</h1>
                    <div className="grid grid-cols-2 items-center justify-center my-2 mb-3 text-xs text-black whitespace-nowrap gap-2">
                        <div className="bg-[#fdcd35] rounded-full px-4 py-1">
                            You Own: 0/10
                        </div>
                        <div className="bg-[#fdcd35] rounded-full px-4 py-1">
                            Tickets Bought: 1/1
                        </div>
                    </div>
                    <div className="flex justify-center gap-3 items-center relative">
                        {/* <button onClick={() => stateChangeFunction(true)} className="bg-[#fdcd35] text-black w-[150px] h-[50px] rounded-full shadow-xl border-2 border-black cursor-pointer">
                            Buy Ticket
                        </button> */}
                        <button onClick={() => stateChangeFunction(true)} className="group relative z-20">
                            <Image width={200} height={80} src={buyUp} alt="home" className={"w-32 group-hover:hidden"} />
                            <Image width={200} height={80} src={buyDown} alt="home" className={"w-32 hidden group-hover:block"} />
                        </button>
                        <h1 className="text-black text-2xl bg-white pl-10 -ml-10 pr-5 rounded-r-full py-0.5 border-black border-2 whitespace-nowrap">{cost}<span className=" inline-block ml-1 -mb-1"><Image width={25} height={25} src={guacLogo}></Image></span></h1>
                    </div>
                </div>
            </div>    
        </>
    )
}