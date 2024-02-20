"use client"

import Image from 'next/image'
import { usePathname } from 'next/navigation'

//Wagmi
import { useAccount } from 'wagmi'

//Images
const homeBtnUp = 'https://d19rxn9gjbwl25.cloudfront.net/buttons/homeUpLg.png'
const homeBtnDown = 'https://d19rxn9gjbwl25.cloudfront.net/buttons/homeDownLg.png'

const pixelTacoBtnUp = 'https://d19rxn9gjbwl25.cloudfront.net/buttons/pixelTacoUp.png'
const pixelTacoBtnDown = 'https://d19rxn9gjbwl25.cloudfront.net/buttons/pixelTacoDown.png'

const doodledBtnUp = 'https://d19rxn9gjbwl25.cloudfront.net/buttons/doodledUp.png'
const doodledBtnDown = 'https://d19rxn9gjbwl25.cloudfront.net/buttons/doodledDown.png'

//Buttons
const pixelDoodBtnUp = 'https://d19rxn9gjbwl25.cloudfront.net/buttons/pixelDoodUp.png'
const pixelDoodBtnDown = 'https://d19rxn9gjbwl25.cloudfront.net/buttons/pixelDoodDown.png'

const stakeBtnUp = 'https://d19rxn9gjbwl25.cloudfront.net/buttons/stakeUp.png'
const stakeBtnDown = 'https://d19rxn9gjbwl25.cloudfront.net/buttons/stakeDown.png'

const raffleBtnUp = 'https://d19rxn9gjbwl25.cloudfront.net/buttons/raffleUp.png'
const raffleBtnDown = 'https://d19rxn9gjbwl25.cloudfront.net/buttons/raffleDown.png'

const minimartBtnUp = 'https://d19rxn9gjbwl25.cloudfront.net/buttons/marketUp.png'
const minimartBtnDown = 'https://d19rxn9gjbwl25.cloudfront.net/buttons/marketDown.png'

const backBtnUp = 'https://d19rxn9gjbwl25.cloudfront.net/buttons/backSmallUp.png'
const backBtnDown = 'https://d19rxn9gjbwl25.cloudfront.net/buttons/backSmallDown.png'

const tacoBtnUp = 'https://d19rxn9gjbwl25.cloudfront.net/buttons/Taco+Tribe+Up.png'
const tacoBtnDown = 'https://d19rxn9gjbwl25.cloudfront.net/buttons/Taco+Tribe+DOWN.png'


//Button Layout
import { useEffect, useState } from 'react'
import NavButton from './UI/Buttons/navButton'
import { WalletConnectButton } from "./UI/Buttons/walletConnectButton"

export default function Navbar() {

    const params = usePathname();

    const [openNav, setOpenNav] = useState(false);

    const { address, isConnected, isDisconnected } = useAccount();

    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
      }, [])

    return (<>
        {openNav && <div className='fixed top-0 left-0 z-50 w-screen h-screen bg-yellow-400 flex flex-col gap-1 items-center justify-center'>
            <NavButton upImage={stakeBtnUp} downImage={stakeBtnDown} selected={params == "/" ? true : false} link={"/"} />
            <NavButton upImage={raffleBtnUp} downImage={raffleBtnDown} selected={params == "/raffle" ? true : false} link={"/raffle"} />
            <NavButton upImage={minimartBtnUp} downImage={minimartBtnDown} selected={params == "/minimart" ? true : false} link={"/minimart"} />
        </div>}

        <div suppressHydrationWarning={true} className="w-full flex items-center justify-between px-10 max-lg:px-2 fixed z-50 top-0 left-0 py-4">


            <div className='min-[890px]:hidden'>
                <button onClick={() => { setOpenNav(prev => !prev) }} className='group cursor-pointer'>
                    <Image width={80} height={80} src={backBtnUp} alt="home" className={"w-10 group-hover:hidden"} />
                    <Image width={80} height={80} src={backBtnDown} alt="home" className={"w-10 hidden group-hover:block"} />
                </button>
            </div>

            <div className="w-fit max-[890px]:hidden flex flex-row items-center justify-center gap-5 max-[1060px]:gap-2 max-lg:gap-1">
                <NavButton upImage={stakeBtnUp} downImage={stakeBtnDown} selected={params == "/" ? true : false} link={"/"} />
                <NavButton upImage={raffleBtnUp} downImage={raffleBtnDown} selected={params == "/raffle" ? true : false} link={"/raffle"} />
                <NavButton upImage={minimartBtnUp} downImage={minimartBtnDown} selected={params == "/minimart" ? true : false} link={"/minimart"} />
            </div>
            <div suppressHydrationWarning={true} className='flex flex-row gap-2'>
                <WalletConnectButton />
                {/* {isClient && isConnected ? <GuacBalance /> : <></>} */}
            </div>
        </div>
    </>
    )
}

