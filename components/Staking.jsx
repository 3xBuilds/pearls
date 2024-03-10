"use client"
import { useAccount } from 'wagmi';
import Image from "next/image";
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { contractAdds } from '@/utils/contractAdds';
import pearlabi from '@/utils/newAbis/stakingpearlabi';
import { useGlobalContext } from '@/context/MainContext';
import { ethers } from "ethers";
import stakingBanner from '../assets/images/stakingBanner.png'

import bg from "../assets/images/taco-truck-night.png"
import bgMobile from "../assets/images/taco-truck-night-mobile.png";


const Staking = () => {
  const { isConnected, address } = useAccount()
  const [isClient, setIsClient] = useState(false)
  const { loader, setLoader } = useGlobalContext();
  const [balance, setBalance] = useState(0);
  const [unstakedList, setUnstakedList] = useState(false);
  const [displayNFT, setDisplayNFT] = useState([]);

  useEffect(() => {
    setIsClient(true)
    if(isConnected){
      fetchNFTs();
    }
  }, [isConnected])

  async function stakingSetup() {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    try {
      const contract = new ethers.Contract(contractAdds.stakingPearls, pearlabi, signer);
      setLoader(false);

      return contract;
    }
    catch (err) {


      console.log("Error", err)
      Swal.fire({
        title: 'Error!',
        text: 'Couldn\'t get fetching contract',
        // imageUrl: error,
        // imageWidth: 200,
        // imageHeight: 200,
        // imageAlt: "Taco OOPS!",
        confirmButtonText: 'Bruh 😭',
        confirmButtonColor: "#facc14",
        customClass: {
          container: "border-8 border-black",
          popup: "bg-white rounded-2xl border-8 border-black",
          image: "-mb-5",
          confirmButton: "w-40 text-black"
        }
      })
    }
  }

  async function claim(tokenId) {
    setLoader(true);
    try {
      const contract = await stakingSetup();
      const res = await contract?.claim(tokenId);
      await res.wait();

      setLoader(false);
      Swal.fire({
        title: 'Pearls Claimed!',
        text: 'Pearls was claimed!',
        icon: 'success',
        imageAlt: "Pearls!",
        confirmButtonText: 'LFG!',
        confirmButtonColor: "#facc14",
        customClass: {
          container: "border-8 border-black",
          popup: "bg-white rounded-2xl border-8 border-black",
          image: "-mb-5",
          confirmButton: "w-40 text-black"
        }
      }).then((res)=>{window.location.reload()});
    }
    catch (err) {
      setLoader(false);
      console.log(err);
    }
  }

  async function claimAll() {
    setLoader(true);
    try {
      const contract = await stakingSetup();
      const tokenIds = []

      displayNFT.map((item) => {
        const tokenId = item.tokenId;
        tokenIds.push(tokenId);
      })

      const res = await contract?.claimAll(tokenIds);
      await res.wait();

      setLoader(false);
      Swal.fire({
        title: 'Pearls Claimed!',
        text: 'Pearls was claimed!',
        icon: 'success',
        imageAlt: "Pearls!",
        confirmButtonText: 'LFG!',
        confirmButtonColor: "#facc14",
        customClass: {
          container: "border-8 border-black",
          popup: "bg-white rounded-2xl border-8 border-black",
          image: "-mb-5",
          confirmButton: "w-40 text-black"
        }
      }).then((res)=>{window.location.reload()});
    }
    catch (err) {
      setLoader(false);
      console.log(err);
    }
    setLoader(false);
  }

  async function fetchNFTs() {
    setDisplayNFT([])
    // const dispArr = [];

    const contract = await stakingSetup();

    try{
      const res = await contract?.fetchMyNfts();
      console.log("nfts: ",res);

      setBalance(res.length);

      res.map((item)=>{
        const tokenId = Number(item[0]);
        const reward = String(ethers.utils.formatEther(item[1]));
        const stakeType = Number(item[2]);

        const name = `Pearls #${tokenId}`;
        const img = `https://cf-ipfs.com/ipfs/bafybeign6syuudwqztvjulqeukfoqhhkaphkohpw5pogvvejht3mnkkxdq/${tokenId}.png`;
        
        setDisplayNFT((prev)=>[...prev, {tokenId, reward, stakeType, name, img}])
      })
    }catch(err){
      console.log(err);
      setTimeout(fetchNFTs, 1000);
    }
  }

  async function softStake(tokenId) {
    setLoader(true);
    try {
      const contract = await stakingSetup();
      const res = await contract?.softStake(tokenId);
      await res.wait();
      Swal.fire({
        title: 'Staked!',
        text: 'NFT was Staked!',
        icon: 'success',
        imageAlt: "Pearls!",
        confirmButtonText: 'LFG!',
        confirmButtonColor: "#facc14",
        customClass: {
          container: "border-8 border-black",
          popup: "bg-white rounded-2xl border-8 border-black",
          image: "-mb-5",
          confirmButton: "w-40 text-black"
        }
      }).then((res)=>{window.location.reload()});
    }
    catch (err) {
    setLoader(false);
      console.log(err);
    }
    setLoader(false);
  }

  async function softStakeAll() {
    setLoader(true);
    try {
      const contract = await stakingSetup();
      const tokenIds = []
      console.log(displayNFT);


      displayNFT.map((item) => {
        if(item.stakeType == 0){
          const tokenId = item.tokenId;
          tokenIds.push(tokenId);
        }
      })


      const res = await contract?.softStakeAll(tokenIds);
      await res.wait();
      Swal.fire({
        title: 'Staked!',
        text: 'NFTs were Staked',
        icon: 'success',
        imageAlt: "Taco!",
        confirmButtonText: 'LFG!',
        confirmButtonColor: "#facc14",
        customClass: {
          container: "border-8 border-black",
          popup: "bg-white rounded-2xl border-8 border-black",
          image: "-mb-5",
          confirmButton: "w-40 text-black"
        }
      }).then((res)=>{window.location.reload()});
    }
    catch (err) {
    setLoader(false);
      console.log(err);
    }
    setLoader(false);
  }
  
  return (
    <div className='w-screen h-screen overflow-hidden noscr bg-pearl-gray text-center'>

      {/* Background */}
      {!isConnected && isClient && <div className="absolute top-0 left-0 w-screen h-screen z-10 md:block max-h-screen overflow-hidden">
        <div className="relative h-full">
          <Image width={1920} height={1080} src={bg} className="object-cover max-sm:hidden w-full h-full" />
          <Image width={1920} height={1080} src={bgMobile} className="object-cover sm:hidden h-full" />
        </div>
      </div>}

        {
          isConnected && isClient && <div className="w-full h-full pt-24">
            {/* <h1 className="text-3xl text-black text-center">
                Staking Page
            </h1> */}
            <div className=' px-2 rounded-lg max-md:w-[90%] md:w-[60%] mx-auto'><Image className=' rounded-lg ' src={stakingBanner} alt={"staking banner"}  width={1000} height={1000} /></div>
            
            <div className=" rounded-lg border-2 border-black mt-10 w-32 mx-auto py-1 px-2 flex flex-col bg-pearl-red">
              <h2 className="text-sm text-white pb-1">You Own:</h2>
              <h3 className="bg-white rounded text-lg">{balance} NFTs</h3>
            </div>

            <h1 className="my-5">Stake your PEARL NFTs to get 10$PEARLS daily!</h1>

            <div className="flex justify-center items-center  w-fit mx-auto bg-red-500/50 rounded-xl border-2 border-black">
              <button onClick={()=>{setUnstakedList(true)}} className={` transition-all duration-300 ease-in-out transform w-40 hover:brightness-125 text-white p-2 rounded-md m-2 ${ unstakedList && " bg-pearl-red border-2 border-black " } `}>Not Staked</button>
              <button onClick={()=>{setUnstakedList(false)}} className={` transition-all duration-300 ease-in-out transform w-40 hover:brightness-125 text-white p-2 rounded-md m-2 ${ !unstakedList && " bg-pearl-red border-2 border-black " } `}>Staked</button>
            </div>
            
            <div className="flex justify-center items-center mt-6 bg-white/10 rounded-xl w-fit mx-auto">
              {/* <button onClick={fetchNFTs} className="bg-black text-white p-2 rounded-md m-2">Fetch NFTs</button> */}
              { unstakedList && <button onClick={softStakeAll} className="bg-pearl-red border-2 border-black border-x-4 transition-all duration-300 ease-in-out hover:-translate-y-2 transform w-64 hover:brightness-125 text-white p-2 rounded-md m-2">Stake All</button>}
              { !unstakedList && <button onClick={claimAll} className="bg-pearl-red border-2 border-black border-x-4 transition-all duration-300 ease-in-out hover:-translate-y-2 transform w-64 hover:brightness-125 text-white p-2 rounded-md m-2">Claim All</button>}
            </div>
            <div className="flex justify-center items-center">
              <div className="flex flex-wrap justify-center items-center">
                {displayNFT.map((item, index)=>{
                  if(unstakedList ? item.stakeType == "0" :  item.stakeType == "1" ) return (
                    <div key={index} className="m-2 bg-gradient-to-br from-red-800 via-pearl-red to-red-900 border-2 p-2 border-black w-64 rounded-xl">
                      <div className="flex flex-col justify-center items-center">
                        <div className=' rounded-lg bg-white w-full overflow-hidden relative group hover:scale-110 hover:border-2 hover:border-white transition-all duration-300 ease-in-out hover:shadow-black hover:shadow-2xl hover:z-50'>
                          <h1 className="text-black absolute bg-white group-hover:hidden rounded-br-xl px-3 py-0.5 top-0 left-0">{item.name}</h1>
                          <Image src={item.img} alt={item.name} className=' bg-white w-full h-full object-cover ' width={100} height={100} />
                        </div>
                        <div className='grid grid-cols-1 gap-3 w-full mt-2 bg-white/50 border-x-4 border-white px-2 rounded-full shadow-inner'>
                          
                          {
                            Number(item.stakeType)>0 ?
                            <h1 className={`text-black`}>Reward: {Number(item.reward).toFixed(1)}</h1>:
                            <h1 className={`text-black`}>Stake to get rewards</h1>
                          }
                          {/* <h1 className="text-black">Stake Type: {item.stakeType}</h1> */}
                        </div>
                        <div className='grid grid-cols-1 gap-2 w-full mt-2'>
                          {item.stakeType == "1" && <button onClick={()=>{claim(item.tokenId)}} className=" bg-white border-black border-2 hover:bg-pearl-red hover:border-white hover:text-white cursor-pointer w-full text-black p-2 rounded-md">Claim</button>}
                          {item.stakeType == "0" && <button onClick={()=>{softStake(item.tokenId)}} className="bg-black/50 hover:bg-black/80 cursor-pointer w-full text-white p-2 rounded-md">Stake</button>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        }

        

    </div>
  )
}

export default Staking