"use client"

import { contractAdds } from "../../utils/contractAdds";
import erc20abi from "../../utils/newAbis/erc20abi";
import erc721abi from "../../utils/newAbis/erc721abi";
import minimartabi from "../../utils/newAbis/minimartabi";
import { MutatingDots } from "react-loader-spinner";
import { useAccount } from "wagmi";

import { ethers } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';

const error = "https://d19rxn9gjbwl25.cloudfront.net/ui/error.png"

export default function MinimartAggregator() {

  const { address } = useAccount();
  const [loadingNFTs, setLoadingNFTs] = useState(false)
  const [loading, setLoading] = useState(false);
  const [displayNFT, setDisplayNFT] = useState([]);


  async function contractSetup() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    try {
      const contract = new ethers.Contract(contractAdds.pearlMinimart, minimartabi, signer);
      return contract;
    }
    catch (err) {


      console.log("Error", err)
      Swal.fire({
        title: 'Error!',
        text: 'Couldn\'t get fetching contract',
        imageUrl: error,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "Pearl OOPS!",
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


  async function setERC20() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    try {
      const contract = new ethers.Contract(contractAdds.pearlToken, erc20abi, signer);

      return contract;
    }
    catch (err) {
      console.log(err);
    }
  }

  async function approve(price, index) {
    try {
      setLoading(true)
      const contract = await setERC20();

      const allowance = await contract.allowance(address, contractAdds.pearlMinimart);
      console.log(Number(allowance));

      if (allowance < ethers.utils.parseEther(String(price))) {

        const resp = await contract.approve(contractAdds.pearlMinimart, ethers.utils.parseEther(String(price)));
        resp.wait().then((res) => {
          buy(price, index);
        })
      }

      else {
        buy(price, index)
      }

    }

    catch (err) {
      console.log(err);
      setLoading(false);
    }

  }

  async function setERC721(contractAdd) {
    try {

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      if (contractAdd.toUpperCase() != "0X0000000000000000000000000000000000000000") {
        const contract = new ethers.Contract(contractAdd, erc721abi, signer);
        return contract
      }

    }
    catch (err) {
      console.log(err);
    }
  }


  async function minimartContractSetup() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    try {
      const contract = new ethers.Contract(contractAdds.pearlMinimart, minimartabi, signer);
      return contract;
    }
    catch (err) {


      console.log("Error", err)
      Swal.fire({
        title: 'Error!',
        text: 'Couldn\'t get fetching contract',
        imageUrl: error,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "Pearl OOPS!",
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

  async function buy(price, index) {
    try {
      const contract = await minimartContractSetup();
      const resp = await contract.buyMinimartItem(ethers.utils.parseEther(String(price)), index);

      resp.wait().then(() => {
        Swal.fire({
          icon: "success",
          title: "Item Bought",
          showConfirmButton: false,
          timer: 1500
        }).then((res) => {
          setLoading(false);
          window.location.reload();
        });


      })
    }
    catch (err) {
      setLoading(false);
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Couldn't buy Marketplace Item",
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  async function unList(item) {
    try {
      setLoading(true);
      const contract = await minimartContractSetup();
      const resp = await contract.unListItem(item);

      resp.wait().then(() => {
        console.log(resp)
        Swal.fire({
          icon: "success",
          title: "Item Unlisted",
          showConfirmButton: false,
          timer: 1500
        }).then((res) => { window.location.reload() }); setLoading(false);
      });
    }
    catch (err) {
      setLoading(false);
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Couldn't Unlist Marketplace Items",
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  async function displayListedNFTs() {
    try {
      setLoadingNFTs(true);
      // const contract = await setERC721Contract();

      
      const minimartContract = await minimartContractSetup();
      
      const data = await minimartContract.fetchData();

      console.log(data);
      
      for (let i = 0; i < data.length; i++) {
        
        const contract = await setERC721(data[i][0]);
        
        const contractAdd = data[i][0];
        
        if (contractAdd.toUpperCase() != "0X0000000000000000000000000000000000000000") {
          console.log("helloooooo", contractAdd);
          const tokenId = String(data[i][1]);
          console.log(tokenId);

          const uri = await contract.tokenURI(tokenId);
          const metadata = "https://ipfs.io/ipfs/" + uri.substr(7);

          try{

            // console.log(setTimeout(await fetch(metadata),3000));
            const meta = await fetch(metadata, {
              signal: AbortSignal.timeout(2000)
            });
            
            console.log(meta);
            const json = await meta.json();
            console.log(json);
            const name = json["name"];
            const img = "https://ipfs.io/ipfs/" + json["image"].substr(7);
            const price = ethers.utils.formatEther(String(data[i][3]));
            const owner = String(data[i][2]);

            console.log({ name, tokenId, img, price, owner, i });

            setDisplayNFT(oldArray =>[...oldArray, { name, tokenId, img, price, owner, i }]);
          }
          catch(err){
            console.log(err);
          }
          
        }
      }
      setLoadingNFTs(false);
    }

    catch (err) {
      console.log(err);
      setLoadingNFTs(false);
      Swal.fire({
        icon: "error",
        title: "Couldn't display Marketplace Items",
        showConfirmButton: false,
        timer: 1500
      });
    }

  }

  async function fetchListedNfts() {

    try {
      setListedIds(null)
      const contract = await minimartContractSetup();

      const data = await contract.fetchData();
      const arr = [];

      for (let i = 0; i < data.length; i++) {
        const contractAdd = data[i][0];


        if (contractAdd.toLowerCase() == selectedAddress.toLowerCase()) {
          const tokenId = Number(data[i][1]);
          arr[i] = tokenId;
        }

      }

      setListedIds(arr);
    }

    catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Couldn't fetch Marketplace Items",
        showConfirmButton: false,
        timer: 1500
      });
    }

  }

  useEffect(() => {
    displayListedNFTs();
  }, [])


  return (
    <div className="relative w-[90%] mx-auto z-[-2]">
      <div className="flex flex-row items-center justify-center w-full gap-5">
        <h3 className="text-black text-xl mb-10 grow px-4 py-1 bg-yellow-300 w-fit mx-auto border-2 border-black rounded-full"></h3>
        <h1 className="text-black text-3xl mb-10 px-4 py-1 bg-yellow-300 w-fit mx-auto border-2 border-black rounded-full">Listed NFTs</h1>
        <h3 className="text-black text-xl mb-10 grow px-4 py-1 bg-yellow-300 w-fit mx-auto border-2 border-black rounded-full"></h3>
      </div>
      <div className="mt-5 w-full">
    
        <div className="flex gap-x-5 items-center flex-wrap">
          {displayNFT.map((item) => (
            <div className="mx-auto">
              <div className="p-1.5 w-fit mx-auto rounded-3xl shadow-xl shadow-black/30 bg-white relative z-[1]"><Image width={1920} height={1080} src={item.img} className="shadow-md bg-white shadow-black/30 w-52 h-52 mx-auto rounded-2xl relative z-[2] border-2 border-black" /></div>
              <div className="bg-gradient-to-b from-[#fa9292] to-[#f6c461] w-60 px-5 -translate-y-24 shadow-2xl shadow-black/60 pt-28 border-2 border-black rounded-2xl">
                <h1 className="text-black text-xl rounded-t-xl bg-white w-fit px-3 mx-auto border-2 border-black border-b-0">{item.name}</h1>
                <h1 className="text-black bg-yellow-400 border-[2px] py-2 rounded-2xl border-black">{item.price} $GUAC</h1>
                {address.toLowerCase() === item.owner.toLowerCase() ? <button disabled={loading} onClick={() => { unList(item.i) }} className={`bg-red-500 py-2 text-2xl px-5 my-3 duration-300 rounded-2xl border-2 border-black hover:bg-red-600`}>{!loading? "Unlist": 
                  <MutatingDots
                  visible={true}
                  height="100"
                  width="100"
                  color="#a855f7"
                  secondaryColor="#fff"
                  radius="12.5"
                  ariaLabel="mutating-dots-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  />
                }</button>
                : <button onClick={() => { approve(item.price, item.i) }} className={`bg-blue-400 duration-300 relative text-2xl py-2 px-5 my-3 text-white rounded-2xl border-2 border-black hover:bg-blue-500`}>{!loading ? "Buy": 
                <MutatingDots
                visible={true}
                height="100"
                width="100"
                color="#a855f7"
                secondaryColor="#fff"
                radius="12.5"
                ariaLabel="mutating-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
                />
                }</button>}
              </div>
            </div>
          ))}

        </div>


        <div className="w-full">
          {(displayNFT.length<=0) && <h2 className="text-black text-3xl mx-auto text-center w-full">No NFTs Listed! <br /> Come Back Later</h2>}
        </div>

      </div>
        {loadingNFTs &&<div className="w-full flex items-center justify-center mx-auto"> <MutatingDots
                  visible={true}
                  height="100"
                  width="100"
                  color="#ffd000"
                  secondaryColor="#fff"
                  radius="12.5"
                  ariaLabel="mutating-dots-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  />
                  <h1 className="animate-pulse text-black">Loading All Items...</h1>
                  </div>}


    </div>
  )
}