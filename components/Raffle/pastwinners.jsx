import raffleabi from "@/utils/newAbis/raffleabi"
import erc721abi from "@/utils/newAbis/erc721abi"
import { contractAdds } from "@/utils/contractAdds"
import {useState, useEffect} from "react"
import Image from "next/image"

import {ethers} from "ethers";

export default function PastWinners({data}){

    const [winnerAddress, setWinnerAddress] = useState("");
    const [nftName, setNftName] = useState("");
    const [nftImage, setNftImage] = useState("");
    const [tokenId, setTokenId] = useState(null);

    useEffect(()=>{
        setERC721(data[0]);
        setTokenId(Number(data[1]));
        setWinnerAddress(data[2]);
        setNftImage(data[3]);
        console.log("HELELELELEL")
    },[])

    async function setERC721(contractAdd){
        try{

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
    
            const contract1 = new ethers.Contract(contractAdd, erc721abi, signer);
            setNftName(await contract1.name());
          }
          catch(err){
            console.log(err);
          }
    }


    return(
        <>
            <div className="bg-red-500 p-3 mb-10 text-center grid grid-cols-1 w-72 rounded-2xl text-white border-2 border-black">
            <div className="bg-white w-full row-span-3 h-48 border-2 border-black rounded-lg overflow-hidden">
                {nftImage != "" && <Image width={1920} height={1080} className="mx-auto h-full col-span-2 bg-white w-full border-2 object-cover" src={nftImage}/>}
            </div>
                
                <div className="col-span-1">
                    <h2 className="text-2xl mt-2 text-white">{nftName} #{tokenId}</h2>
                    <a href={`https://polygonscan.com/address/${winnerAddress}`} target="_blank" className="text-sm text-blue-800 underline overflow-ellipsis w-full px-5">{winnerAddress.substring(0,5)+"..."+winnerAddress.substring(winnerAddress.length-5, winnerAddress.length)}</a>
                </div>
            </div>
        </>
    )
}