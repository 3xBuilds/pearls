"use client"

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { contractAdds } from '@/utils/contractAdds'
import pearlTokenabi from '@/utils/newAbis/pearlTokenabi'
import {ethers} from "ethers";
//Wagmi
import { useAccount } from 'wagmi'


import mintBtnUp from '../assets/images/mint_up.png'
import mintBtnDown from '../assets/images/mint_down.png'

import stakeBtnUp from '../assets/images/stake_up.png'
import stakeBtnDown from '../assets/images/stake_down.png'

import raffleBtnUp from '../assets/images/raffle_up.png'
import raffleBtnDown from '../assets/images/raffle_down.png'

const backBtnUp = 'https://d19rxn9gjbwl25.cloudfront.net/buttons/backSmallUp.png'
const backBtnDown = 'https://d19rxn9gjbwl25.cloudfront.net/buttons/backSmallDown.png'



//Button Layout
import { useEffect, useState } from 'react'
import NavButton from './UI/Buttons/navButton'
import { WalletConnectButton } from "./UI/Buttons/walletConnectButton"

export default function Navbar() {

    const params = usePathname();

    const [openNav, setOpenNav] = useState(false);

    const[balance, setBalance] = useState(0);
    const {address, isConnected} = useAccount();

    // const [isClient, setIsClient] = useState(false)



    async function tokenBalanceSetup() {

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
    
        try {
          const contract = new ethers.Contract(contractAdds.pearlToken, pearlTokenabi, signer);
        //   setLoader(false);
    
          return contract;
        }
        catch (err) {
    
    
          console.log("Error", err)
        //   Swal.fire({
        //     title: 'Error!',
        //     text: 'Couldn\'t get fetching contract',
        //     // imageUrl: error,
        //     // imageWidth: 200,
        //     // imageHeight: 200,
        //     // imageAlt: "Taco OOPS!",
        //     confirmButtonText: 'Bruh 😭',
        //     confirmButtonColor: "#facc14",
        //     customClass: {
        //       container: "border-8 border-black",
        //       popup: "bg-white rounded-2xl border-8 border-black",
        //       image: "-mb-5",
        //       confirmButton: "w-40 text-black"
        //     }
        //   })
        }
      }

      async function getBalance(){
        try{

            const contract = await tokenBalanceSetup();
            setBalance(Number(ethers.utils.formatEther(String(await contract.balanceOf(address)))));
        }
        catch(err){
            console.log(err);
            setTimeout(getBalance, 1000);
        }
      }

    useEffect(() => {
        // setIsClient(true);
        getBalance();
      }, [])

    return (<>
        {openNav && <div className='fixed top-0 left-0 z-50 w-screen h-screen bg-yellow-400 flex flex-col gap-1 items-center justify-center'>
            <NavButton upImage={mintBtnUp} downImage={mintBtnDown} selected={params == "/" ? true : false} link={"/"} />
            <NavButton upImage={stakeBtnUp} downImage={stakeBtnDown} selected={params == "/stake" ? true : false} link={"/stake"} />
            <NavButton upImage={raffleBtnUp} downImage={raffleBtnDown} selected={params == "/raffle" ? true : false} link={"/raffle"} />
            {/* <NavButton upImage={minimartBtnUp} downImage={minimartBtnDown} selected={params == "/minimart" ? true : false} link={"/minimart"} /> */}
        </div>}

        <div suppressHydrationWarning={true} className="w-full flex items-center justify-between px-10 max-lg:px-2 fixed z-50 top-0 left-0 py-4">


            <div className='min-[890px]:hidden'>
                <button onClick={() => { setOpenNav(prev => !prev) }} className='group cursor-pointer'>
                    <Image width={80} height={80} src={backBtnUp} alt="home" className={"w-10 group-hover:hidden"} />
                    <Image width={80} height={80} src={backBtnDown} alt="home" className={"w-10 hidden group-hover:block"} />
                </button>
            </div>

            <div className="w-fit max-[890px]:hidden flex flex-row items-center justify-center gap-5 max-[1060px]:gap-2 max-lg:gap-1">
                <NavButton upImage={mintBtnUp} downImage={mintBtnDown} selected={params == "/" ? true : false} link={"/"} />
                <NavButton upImage={stakeBtnUp} downImage={stakeBtnDown} selected={params == "/stake" ? true : false} link={"/stake"} />
                <NavButton upImage={raffleBtnUp} downImage={raffleBtnDown} selected={params == "/raffle" ? true : false} link={"/raffle"} />
                {/* <NavButton upImage={minimartBtnUp} downImage={minimartBtnDown} selected={params == "/minimart" ? true : false} link={"/minimart"} /> */}
            </div>
            
            <div suppressHydrationWarning={true} className='flex flex-row gap-2'>
              <WalletConnectButton />
              {isConnected && <div className="bg-gradient-to-br from-red-900 to-red-600 px-4 py-2.5 rounded-lg border-2 border-black text-white">
                {balance} $PEARLS
              </div>}
            </div>
        </div>
    </>
    )
}

