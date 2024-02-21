"use client"
import { useAccount } from 'wagmi';
import Image from "next/image";
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { contractAdds } from '@/utils/contractAdds';
import pearlabi from '@/utils/newAbis/stakingpearlabi';
import { useGlobalContext } from '@/context/MainContext';

const Staking = () => {
  const { isConnected, address } = useAccount()
  const [isClient, setIsClient] = useState(false)
  const { loader, setLoader } = useGlobalContext();
  const [displayNFT, setDisplayNFT] = useState([]);

  useEffect(() => {
    setIsClient(true)
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
    const dispArr = [];


    const contract = await stakingSetup();
    const res = await contract?.fetchMyNfts();
    await res.wait();

    console.log(res);

    res.map((item)=>{
      const tokenId = item[0];
      const reward = item[1];
      const stakeType = item[2];

      const name = `Pearls #${tokenId}`;
      const img = `https://ipfs.io/ipfs/bafybeign6syuudwqztvjulqeukfoqhhkaphkohpw5pogvvejht3mnkkxdq/${tokenId}.png`;
      
      setDisplayNFT((prev)=>[...prev, {tokenId, reward, stakeType, name, img}])
    })
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
    <div className='w-screen h-screen pt-24 text-center'>

        {!isConnected && isClient && <div className=" min-h-screen">
            <h1 className="text-3xl text-black text-center">
                Seems like you are not connected.
                <br className=" max-lg:hidden"/>
                <br/>
                <span className="text-[3rem]">Please Connect Your Wallet!!!</span>
            </h1>
        </div>}

        

    </div>
  )
}

export default Staking