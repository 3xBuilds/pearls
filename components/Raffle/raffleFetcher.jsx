import { contractAdds } from "../../utils/contractAdds"
import raffleabi from "../../utils/newAbis/raffleabi"
import erc721abi from "../../utils/newAbis/erc721abi"
import erc20abi from "../../utils/newAbis/erc20abi"
import { useState, useEffect } from "react"
import Image from "next/image"
import {useAccount} from "wagmi"

import {ethers} from "ethers"
import { InfinitySpin } from "react-loader-spinner"

export default function RaffleFetcher({number}){

    const [name, setName] = useState("");
    const [amount, setAmount] = useState(1);
    const [image, setImage] = useState("");
    const [ticketsSold, setTicketsSold] = useState(0);
    const [entrants, setEntrants] = useState(0);

    const [itemExists, setItemExists] = useState(false);
    const [limitPerWallet, setLimitPerWallet] = useState(0);
    const [limit, setLimit] = useState(0);
    const [holding, setHolding] = useState(0);

    const [loading, setLoading]  = useState(false);

    const [price, setPrice] = useState("");

    const arrowright = "https://d19rxn9gjbwl25.cloudfront.net/projectImages/arrowright.png"

    const[ticketModal, setTicketModal] = useState(false);
    
    const{ address } = useAccount();

    async function setRaffle(){
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = provider.getSigner();

        try {
        const contract = new ethers.Contract(contractAdds.pearlRaffle, raffleabi, signer);
        // console.log("raffle", raffleAdd);
        return contract;
        }
        catch(err){
            console.log(err);
        }
    }

    async function setERC721(contractAdd){
        try{

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
    
            const contract1 = new ethers.Contract(contractAdds.pearlRaffle, raffleabi, signer);
            const add = await contract1?.raffleContract(number);
            console.log(add);
            if(add.toUpperCase() == "0X0000000000000000000000000000000000000000"){
              const contract = new ethers.Contract(contractAdd, erc721abi, signer);
              return contract
            }
    
            else{
              const contract = new ethers.Contract(add, erc721abi, signer)
              return contract;
    
            }
          }
          catch(err){
            console.log(err);
          }
    }

    async function setERC20(){
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = provider.getSigner();

        try {
        const contract = new ethers.Contract(contractAdds.pearlToken, erc20abi, signer);

        return contract;
        }
        catch(err){
            console.log(err);
        }
    }

    async function changeAmount(val){
        if(amount>=1)
        setAmount(amount+val);
        if(amount == 0 && val == 1)
        setAmount(1);
    }
    
    async function fetchRaffle(){
        try{
            setLoading(true)
            console.log("WALLET", address);
            const contract = await setRaffle();
            const add = await contract?.raffleContract(number);
            const tokenId = Number(await contract?.raffleTokenId(number));

            if(add.toLowerCase() == "0x0000000000000000000000000000000000000000") {
                console.log("NO CONTRACT");
                setLoading(false);
                return;
            }

            const limitperWallet = Number(await contract?.ticketLimitPerWallet(number))
            const limit = Number(await contract?.ticketLimit(number));

            
            if(limit > 0){
                setPrice(String(await contract?.raffleEntryCost(number)));
                setLimit(limit);
                setLimitPerWallet(limitperWallet);
                setHolding(Number(await contract?.walletHolding(number, address)));
                setItemExists(true);
                const contract721 = await setERC721(add);
    
                const tokenURI = await contract721.tokenURI(tokenId);
                console.log(tokenURI);

                if(tokenURI[0] == "h"){

                    const metadata = tokenURI;

                    const meta = await fetch(metadata);
                    const json = await meta.json();
                    const name = json["name"];
                    const image = json["image"];
                    const newimage = `https://cf-ipfs.com/ipfs/${image.substr(7)}`
    
                    console.log(newimage);
        

                    setTicketsSold(Number(await contract?.ticketsSold(number)));
                    setEntrants(Number(await contract?.totalEntrants(number)));
                    setName(name);
                    setImage(newimage);

                }

                else{
                    const metadata = `https://cf-ipfs.com/ipfs/${tokenURI.substr(7)}`;
                    
                    const meta = await fetch(metadata);
                    const json = await meta.json();
                    const name = json["name"];
                    const image = json["image"];
                    const newimage = `https://cf-ipfs.com/ipfs/${image.substr(7)}`
    
                    console.log(newimage);
        

                    setTicketsSold(Number(await contract?.ticketsSold(number)));
                    setEntrants(Number(await contract?.totalEntrants(number)));
                    setName(name);
                    setImage(newimage);
                }
             
                setLoading(false)

            }
        }

        catch(err){
            console.log(err);
            setTimeout( fetchRaffle(), 1000);
        }
    }


    async function approve(){
        try{
            setLoading(true);
            console.log(ethers.utils.parseEther(String(amount*Number(ethers.utils.formatEther(price)))));
            const erc20contract = await setERC20();

            const allowance = await erc20contract.allowance(address, contractAdds.pearlRaffle);

            if(allowance < ethers.utils.parseEther(String(amount*Number(ethers.utils.formatEther(price)))) ){
                console.log(erc20contract, ethers.utils.parseEther(String(amount*Number(ethers.utils.formatEther(price)))));
                const txn = await erc20contract?.approve(contractAdds.pearlRaffle, ethers.utils.parseEther(String(amount*Number(ethers.utils.formatEther(price)))));
                txn.wait().then((res)=>{
                    buytickets();
                })
            }

            else{
                buytickets();
            }
        }
        catch(err){
            console.log(err);
            setLoading(false);
        }
    }

    async function buytickets(){
        try{
            const contract = await setRaffle();
            console.log(number, String(ethers.utils.parseEther(String(amount*Number(ethers.utils.formatEther(price))))));
            const txn = await contract?.enterRaffle(number, amount);
            txn.wait().then((res)=>{
                setLoading(false);
                window.location.reload();
            })
        }
        catch(err){
            console.log(err);
            setLoading(false);
        }


    }

    useEffect(()=>{
        fetchRaffle();
    },[])
    
    return(
        <div className="flex">
            {itemExists ? <div className="bg-gradient-to-br from-red-800 via-pearl-red to-red-900 border-2 p-2 border-black w-80 rounded-xl">
                <div className=' rounded-lg bg-white w-full overflow-hidden relative group hover:scale-110 hover:border-2 hover:border-white transition-all duration-300 ease-in-out hover:shadow-black hover:shadow-2xl hover:z-50'>
                    <h1 className="text-black absolute bg-white group-hover:hidden rounded-br-xl px-3 py-0.5 top-0 left-0">{name}</h1>
                    <Image src={image} alt={name} className=' bg-white w-full h-full object-cover ' width={100} height={100} />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-red-900 border-2 border-black text-black rounded-xl p-0.5 text-xs w-full flex flex-col items-center justify-center">
                        <h3 className="text-white mb-1">Participants:</h3>
                        <div className="text-base bg-white rounded-lg w-full">{entrants}</div>
                    </div>
                    <div className="bg-red-900 border-2 border-black text-black rounded-xl p-0.5 text-xs w-full flex flex-col items-center justify-center">
                        <h3 className="text-white mb-1">Tickets Sold:</h3>
                        <div className="text-base bg-white rounded-lg w-full">{ticketsSold}/{limit}</div>
                    </div>
                    <h2 className="bg-black/20 col-span-2 text-sm text-white border-2 border-x-4 border-black rounded-xl py-1 leading-none w-full mx-auto">Your Tickets: {holding}/{limitPerWallet}</h2>
                </div>
                <h2 className="text-black bg-gradient-to-br from-red-200 via-white/60 to-red-200 w-fit rounded-t-none rounded-xl py-1 px-4 mx-auto text-[1rem] border-x-2 border-black border-b-2">Price: {ethers.utils.formatEther(String(price))} $PEARL</h2>

                <button onClick={()=>{
                    setTicketModal(true);
                }} className="bg-black/50 hover:bg-black/80 cursor-pointer w-full text-white p-4 rounded-lg mt-2">Buy Tickets</button>
                
                
            </div> : 
            loading ? <div className="bg-gradient-to-br from-red-800  opacity-10 flex items-center justify-center animate-pulse via-pearl-red to-red-900 border-2 p-2 border-black w-80 rounded-xl">
                {/* <Image width={1920} height={1080} src={noraffle} className="w-full border-2 border-black bg-white rounded-lg"/> */}
                    <div className="w-fit h-fit relative right-6">
                    <InfinitySpin
                        visible={true}
                        height="100"
                        width="100"
                        color="white"
                        radius="12.5"
                        wrapperStyle={{}}
                        wrapperClass=""
                        />
                    </div>
                </div> : 
                <div className="bg-gradient-to-br from-red-800  opacity-20 flex items-center justify-center via-pearl-red to-red-900 border-2 p-2 border-black w-80 rounded-xl">
                    <h3 className="text-white text-center">No Item Here</h3>
                </div>}

                {ticketModal && <div className="bg-yellow-400 z-20 border-2 border-black rounded-2xl w-[300px] px-0 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2xl shadow-black">
                    <div className="relative flex flex-col items-center justify-center w-full h-full p-5 pt-10">
                        <h2 onClick={() => { setTicketModal(false) }} className="absolute top-0 right-0 cursor-pointer m-2 mx-4 text-black hover:text-red-600 transform hover:scale-125 transition-all duration-200 ease-in-out">x</h2>
                        {/* <input placeholder="0" type="number" onKeyDown={(e) => { e.preventDefault() }} step={1} min={0} onChange={handleamountChange} value={amount} className="text-black border-2 border-black p-5 py-4 text-center text-3xl block h-fit w-full rounded-xl">
                        </input> */}
                        <div className="grid grid-flow-col grid-cols-3 items-center gap-5">
                            <button onClick={()=>{changeAmount(-1)}} className="p-3">
                                <Image width={1920} height={1080} src={arrowright} className="w-[3rem] rotate-180"/>
                            </button>
                            <div className="text-[2.5rem] text-center text-black">{amount}</div>
                            <button onClick={()=>{changeAmount(1)}} className="p-3">
                                <Image width={1920} height={1080} src={arrowright} className="w-[3rem]"/>
                            </button>
                        </div>
                        
                        {!loading ? <button onClick={approve} className={` group py-4 px-8 text-white rounded-xl border-2 border-black text-3xl bg-blue-400`}>
                        Buy
                        </button>:
                         
                        <InfinitySpin
                        visible={true}
                        height="100"
                        width="100"
                        color="#a855f7"
                        secondaryColor="#fff"
                        radius="12.5"
                        wrapperStyle={{}}
                        wrapperClass=""
                        />
                        }
                        
                    </div>
                </div>}
        </div>
    )
}