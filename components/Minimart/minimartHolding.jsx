import { EvmChain } from "@moralisweb3/common-evm-utils";
import { ethers } from "ethers";
import Moralis from "moralis";
import Image from "next/image";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { useAccount } from "wagmi";
import { contractAdds } from "../../../utils/contractAdds";
import erc721abi from "../../../utils/newAbis/erc721abi";
import minimartabi from "../../../utils/newAbis/minimartabi";

const error = "https://d19rxn9gjbwl25.cloudfront.net/ui/error.png"


export default function MinimartHolding({ contractAddress, listed }) {

  const chain = EvmChain.POLYGON;
  const { isConnected, address } = useAccount();

  const [displayNFT, setDisplayNFT] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [price, setPrice] = useState(0);
  const [tokenId, setTokenId] = useState(null);

  const [loading, setLoading] = useState(false);

  async function setERC721Contract() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    try {
      const contract = new ethers.Contract(contractAddress, erc721abi, signer);
      console.log(contract);
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
        imageAlt: "Taco OOPS!",
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

  async function minimartContractSetup() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    try {
      const contract = new ethers.Contract(contractAdds.minimart, minimartabi, signer);
      console.log(contract);
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
        imageAlt: "Taco OOPS!",
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

  async function approval(tokenId, price) {

    try {
      setLoading(true);
      const contract = await setERC721Contract();
      const approve = await contract?.approve(contractAdds.minimart, tokenId);

      approve.wait().then((res) => {

        setMinimartItem(tokenId, price);


      });

    }
    catch (err) {
      setLoading(false);
      console.log("Error", err)
      Swal.fire({
        title: 'Error!',
        text: 'Faced an Error!',
        imageUrl: error,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "Taco OOPS!",
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

  async function setMinimartItem(tokenId, price) {
    try {
      const contract = await minimartContractSetup();
      price = ethers.utils.parseEther(String(price));

      const txn = await contract.setMinimartItem(contractAddress, tokenId, price);
      txn.wait().then(() => {
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "NFT has been listed for " + ethers.utils.formatEther(String(price)) + " $GUAC",
          showConfirmButton: false,
          timer: 1500
        }).then((res) => { window.location.reload() });
      });

    }
    catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  async function moralisSetup() {
    await Moralis.start({
      apiKey: process.env.NEXT_PUBLIC_API_KEY
    });

    // console.log( process.env.NEXT_PUBLIC_API_KEY);
  }

  async function holdingNFTs() {

    try {

      const response = await Moralis.EvmApi.nft.getWalletNFTs({
        address,
        chain,
      });

      const arr = [];

      for (let i = 0; i < response.toJSON().result.length; i++) {

        if (response.toJSON().result[i].token_address.toLowerCase() == contractAddress.toLowerCase()) {
          const tokenId = Number(response.toJSON().result[i].token_id);
          console.log("I am listed", listed);


          if (!listed.includes(tokenId)) {

            const metadata = JSON.parse(response.toJSON().result[i].metadata);

            const name = metadata["name"];
            const img = metadata["image"];
            const image = "https://ipfs.io/ipfs/" + img.substr(7);


            arr.push({ name, image, tokenId });
          }
        }
      }
      setDisplayNFT(arr);
    }

    catch (err) {
      console.log(err);

      Swal.fire({
        icon: "error",
        title: "Couldn't fetch your balance!",
        showConfirmButton: false,
        timer: 1500
      });
    }

    // console.log(response.toJSON().result, contractAddress.toLowerCase());
  }

  function handlePrice(e) {
    setPrice(e.target.value);
  }

  useEffect(() => {
    moralisSetup();
  }, [])

  useEffect(() => {
    holdingNFTs();
  }, [contractAddress, listed])



  return (
    <div className="flex gap-5 flex-wrap justify-center text-black p-4">
      {displayNFT.length <= 0 && <div> <h3 className="font-bold text-black my-2">No Owned NFTs</h3> </div>}
      {showModal && <div className="bg-yellow-400 px-6 py-4 border-4 rounded-2xl border-black">
        <h1>#{tokenId}</h1>
        <input min={0} placeholder="Set Amount in Ether" onChange={handlePrice} type="number" className="mt-2 px-3 py-2 rounded-2xl"></input>
        <button onClick={() => { approval(tokenId, price) }} className={`bg-blue-400 ml-2 px-2 py-1 border-2 ${loading && "animate-spin"} border-black rounded-2xl text-white hover:bg-blue-500`}>Set</button>
        <button onClick={() => {
          setShowModal(false);
          setTokenId(null)
          setPrice(null);
        }} className="h-8 ml-2 w-8 bg-red-400 hover:bg-red-500 rounded-full  border-2 border-black">x</button>
      </div>}
      {displayNFT.map((item) => (
        <div className="bg-red-300 border-4 w-fit mx-auto border-black rounded-2xl py-3 px-2 shadow-xl shadow-black/60">
          <div className="w-40 h-40 mx-auto">
            <Image src={item.image} width={1920} height={1080} className="w-[100%] rounded-2xl border-2 border-black mx-auto" />
          </div>
          <h1>{item.name}</h1>
          <button onClick={() => {
            setShowModal(true);
            setTokenId(item.tokenId);
          }} className="bg-blue-400 hover:bg-blue-500 border-2 border-black text-white rounded-2xl px-3 py-2 mt-3 text-lg">List</button>
        </div>
      ))}
    </div>
  )
}