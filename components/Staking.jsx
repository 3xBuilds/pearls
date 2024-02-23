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
import pearllogo from '../assets/images/pearllogo.png'

const Staking = () => {
  const { isConnected, address } = useAccount()
  const [isClient, setIsClient] = useState(false)
  const { loader, setLoader } = useGlobalContext();
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
        title: 'Pearl Claimed!',
        text: 'Pearl was claimed!',
        icon: 'success',
        imageAlt: "Pearl!",
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
        title: 'Pearl Claimed!',
        text: 'Pearl was claimed!',
        icon: 'success',
        imageAlt: "Pearl!",
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
        title: 'Soft Staked!',
        text: 'NFT was Soft Staked!',
        icon: 'success',
        imageAlt: "Pearl!",
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
      displayNFT.map((item) => {
        const tokenId = item.tokenId;
        tokenIds.push(tokenId);
      })
      const res = await contract?.softStakeAll(tokenIds);
      await res.wait();
      Swal.fire({
        title: 'Soft Staked!',
        text: 'NFTs were Soft Staked',
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
    <div className='w-screen h-screen overflow-hidden noscr bg-gradient-radial text-center'>

        {!isConnected && isClient && <div className=" min-h-screen w-full flex flex-col items-center justify-center">
            <Image src={pearllogo} alt={"pearl logo"} className=' rounded-lg w-64' width={1000} height={1000} />
            <h1 className="text-3xl text-white text-center">
                Seems like you are not connected.
                <br className=" max-lg:hidden"/>
                <br/>
                <span className="text-[3rem] mt-5">Please Connect Your Wallet!!!</span>
            </h1>
        </div>}

        {
          isConnected && isClient && <div className="w-full h-full pt-24">
            {/* <h1 className="text-3xl text-black text-center">
                Staking Page
            </h1> */}
            <div className=' border-x-4 border-purple-600 px-2 rounded-lg max-md:w-[90%] md:w-[50%] mx-auto'><Image className=' rounded-lg ' src={stakingBanner} alt={"staking banner"}  width={1000} height={1000} /></div>
            <div className="flex justify-center items-center mt-10 bg-white/10 rounded-xl w-fit mx-auto">
              {/* <button onClick={fetchNFTs} className="bg-black text-white p-2 rounded-md m-2">Fetch NFTs</button> */}
              <button onClick={claimAll} className="bg-gradient-bright w-40 hover:brightness-125 text-white p-2 rounded-md m-2">Claim All</button>
              <button onClick={softStakeAll} className="bg-gradient-bright w-40 hover:brightness-125 text-white p-2 rounded-md m-2">Soft Stake All</button>
            </div>
            <div className="flex justify-center items-center">
              <div className="flex flex-wrap justify-center items-center">
                {displayNFT.map((item, index)=>{
                  return (
                    <div key={index} className="m-2 bg-gradient-to-br from-slate-800 via-purple-600 to-slate-800 border-2 p-2 border-black w-64 rounded-xl">
                      <div className="flex flex-col justify-center items-center">
                        <Image src={item.img} alt={item.name} className=' rounded-lg bg-white w-full' width={100} height={100} />
                        <div className='grid grid-cols-2 gap-3 w-full mt-2 bg-white/50 border-x-4 border-white px-2 rounded-full shadow-inner'>
                          <h1 className="text-black">{item.name}</h1>
                          <h1 className="text-black">Reward: {item.reward}</h1>
                          {/* <h1 className="text-black">Stake Type: {item.stakeType}</h1> */}
                        </div>
                        <div className='grid grid-cols-2 gap-2 w-full mt-2'>
                          <button onClick={()=>{claim(item.tokenId)}} className=" bg-black/50 hover:bg-black/80 w-full text-white p-2 rounded-md">Claim</button>
                          <button onClick={()=>{softStake(item.tokenId)}} className="bg-black/50 hover:bg-black/80 w-full text-white p-2 rounded-md">Soft Stake</button>
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