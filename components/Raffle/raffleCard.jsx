'use client'

import Image from "next/image"

const guacos = "https://d19rxn9gjbwl25.cloudfront.net/projectImages/staking/guacos.png"

export default function RaffleCard({ id, name, link, img, buttonText }) {
    return (
        <>
            <div className="flex flex-col items-center relative shadow-xl border-4 bg-gradient-to-b from-[#76a6ff] to-[#f8c561] border-black rounded-xl p-2 w-[300px] h-[200px]">
                <div className=" translate-y-[-70px] p-10 text-center">
                    <Image src={guacos} className="" width={200} height={200} alt={name} />
                    <h1 className="text-black mt-3">{name} {id}</h1>
                    <button className="bg-[#fdcd35] w-[70%] h-[20%] rounded-full shadow-xl border-2 border-black cursor-default text-black">
                        {buttonText}
                    </button>
                </div>

            </div>
        </>
    )
}