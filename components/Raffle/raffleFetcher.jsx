import { contractAdds } from "../../utils/contractAdds"
import raffleabi from "../../utils/newAbis/raffleabi"
import erc721abi from "../../utils/newAbis/erc721abi"
import erc20abi from "../../utils/newAbis/erc20abi"
import { useState, useEffect } from "react"
import Image from "next/image"
import {useAccount} from "wagmi"

import {ethers} from "ethers"
import { MutatingDots } from "react-loader-spinner"

export default function RaffleFetcher({number}){

    const [name, setName] = useState("");
    const [amount, setAmount] = useState(1);
    const [image, setImage] = useState("");
    const [ticketsSold, setTicketsSold] = useState(0);
    const [entrants, setEntrants] = useState(0);
    const [winner, setWinner] = useState("");
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
            console.log("WALLET", address);
            const contract = await setRaffle();
            const add = await contract?.raffleContract(number);
            const tokenId = Number(await contract?.raffleTokenId(number));

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
                    const newimage = `https://ipfs.io/ipfs/${image.substr(7)}`
    
                    console.log(newimage);
        
                    setWinner(await contract.winningAddress(number));
                    setTicketsSold(Number(await contract?.ticketsSold(number)));
                    setEntrants(Number(await contract?.totalEntrants(number)));
                    setName(name);
                    setImage(newimage);

                }

                else{
                    const metadata = `https://ipfs.io/ipfs/${tokenURI.substr(7)}`;
                    
                    const meta = await fetch(metadata);
                    const json = await meta.json();
                    const name = json["name"];
                    const image = json["image"];
                    const newimage = `https://ipfs.io/ipfs/${image.substr(7)}`
    
                    console.log(newimage);
        
                    setWinner(await contract.winningAddress(number));
                    setTicketsSold(Number(await contract?.ticketsSold(number)));
                    setEntrants(Number(await contract?.totalEntrants(number)));
                    setName(name);
                    setImage(newimage);
                }
                    

            }
        }

        catch(err){
            console.log(err);
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
            {itemExists ? <div className="bg-gradient-to-b from-purple-500 shadow-xl shadow-black/40 to-lime-400 py-2 px-2 rounded-2xl border-2 border-black w-full p-2 mx-auto">
                <Image width={1920} height={1080} className="w-full bg-white min-[1500px]:w-[90%] mx-auto rounded-2xl border-2 border-black" src={image}/>
                <h2 className="text-2xl bg-white w-fit mx-auto px-4 rounded-full my-2 border-2 border-black">{name}</h2>
                <div className="grid grid-cols-2 gap-2">
                    <h2 className="bg-yellow-400 border-2 border-black text-black rounded-xl p-2">Participants: <br /> {entrants}</h2>
                    <h2 className="bg-yellow-400 border-2 border-black text-black rounded-xl p-2">Tickets Sold: <br /> {ticketsSold}/{limit}</h2>
                    <h2 className="bg-purple-400 col-span-2 text-white border-2 border-black rounded-xl py-2 w-full mx-auto">Your Tickets: {holding}/{limitPerWallet}</h2>
                </div>
                <h2 className="text-black bg-white w-fit rounded-t-none rounded-xl py-2 px-4 mx-auto text-[1.2rem] border-x-2 border-black border-b-2">Price: {ethers.utils.formatEther(String(price))} $GUAC</h2>
                {winner.toUpperCase() != "0X0000000000000000000000000000000000000000" ? <h2>Winner: {winner}</h2>:
                <button onClick={()=>{
                    setTicketModal(true);
                }} className="text-3xl bg-red-500 hover:bg-red-600 text-white px-5 py-3 mt-4 rounded-xl border-2 border-black ">Buy Tickets</button>
                }
                
            </div> : 
            <div className="bg-gradient-to-b from-purple-500 to-lime-400 shadow-xl shadow-black/40 h-fit rounded-2xl border-2 border-black w-full p-5 mx-auto flex items-center justify-center">
                {/* <Image width={1920} height={1080} src={noraffle} className="w-full border-2 border-black bg-white rounded-lg"/> */}
                    <h3 className="text-xl text-black">No raffle Image</h3>
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
                        }
                        
                    </div>
                </div>}
        </div>
    )
}