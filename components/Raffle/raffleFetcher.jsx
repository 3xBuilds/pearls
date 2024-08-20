import { contractAdds } from "@/utils/contractAdds"
import raffleabi from "@/utils/newAbis/raffleabi"
import erc721abi from "@/utils/newAbis/erc721abi"
import erc20abi from "@/utils/newAbis/erc20abi"
import { useState, useEffect } from "react"
import Image from "next/image"
import {useAccount} from "wagmi"
import {ethers} from "ethers"
import { InfinitySpin, MutatingDots } from "react-loader-spinner"

export default function RaffleFetcher({data, number}){

    const [name, setName] = useState("");
    const[contractAdd, setContractAdd] = useState("");
    const[tokenId, setTokenId] = useState(null);
    const [amount, setAmount] = useState(1);
    const [image, setImage] = useState("");
    const [ticketsSold, setTicketsSold] = useState(0);
    const [entrants, setEntrants] = useState(0);
    const [winner, setWinner] = useState("");
    const [itemExists, setItemExists] = useState(false);
    const [limitPerWallet, setLimitPerWallet] = useState(0);
    const [limit, setLimit] = useState(0);
    const [holding, setHolding] = useState(0);
    const [link, setLink] = useState("");

    useEffect(()=>{
        setContractAdd(data[0]);
        setERC721(data[0])
        setTokenId(Number(data[1]));
        setEntrants(Number(data[2]));
        setTicketsSold(Number(data[3]));
        setLimit(Number(data[4]));
        setHolding(Number(data[5]));
        setLimitPerWallet(Number(data[6]));
        setPrice(String(ethers.utils.formatEther(String(data[7]))))
        setLink(data[8])
        setImage(data[10]);
    
        // setId(data[11]);
        // setImage(data[9])
      },[])

    const [loadingNFTs, setLoadingNFTs] = useState(false);

    const [loading, setLoading]  = useState(false);

    const [price, setPrice] = useState("");

    const arrowright = "https://d19rxn9gjbwl25.cloudfront.net/projectImages/arrowright.png"

    const[ticketModal, setTicketModal] = useState(false);
    
    const{ address } = useAccount();

    async function setRaffle(){
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = provider.getSigner();

        try {
        const contract = new ethers.Contract(contractAdds.raffle, raffleabi, signer);
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
    
            const contract1 = new ethers.Contract(contractAdd, erc721abi, signer);
            setName(await contract1.name());
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

    async function approve(){
        try{
            setLoading(true);
            
            const erc20contract = await setERC20();

            const allowance = await erc20contract.allowance(address, contractAdds.raffle);
            console.log(Number(allowance));
            if(Number(ethers.utils.formatEther(String(allowance))) < amount*price){
                console.log("HELLLLO")
                const txn = await erc20contract?.approve(contractAdds.raffle, ethers.utils.parseEther(String(amount*price)));
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
            
            const txn = await contract?.enterPearlRaffle(number, amount);
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

    return(
        <div className="flex">
            <div className="bg-gradient-to-b from-red-500 shadow-xl shadow-black/40 to-red-800 py-2 px-2 rounded-2xl border-2 border-black w-full p-2 mx-auto">
            {loadingNFTs && <div className="mx-auto flex items-center justify-center"> <InfinitySpin className="translate-x-10" visible={true} width="200" color="#ffffff" ariaLabel="infinity-spin-loading" /><h1>Fetching data...</h1></div>}
                {console.log("IMAGE IS HEREEEEE", name,  image)}
                <Image width={1920} height={1080} className="w-80 bg-white  mx-auto rounded-2xl border-2 border-black" src={image}/>
                <h2 className="text-2xl bg-white w-fit mx-auto px-4 rounded-full my-2 border-2 border-black">{name} #{tokenId}</h2>
                <a target="_blank" className="text-white underline" href={link}>Check Item</a>

                <div className="grid grid-cols-2 gap-2">
                    <h2 className="bg-red-800 w-full border-2 border-black text-white rounded-xl p-2">Participants: <br /> <span className="px-16 bg-white text-black border-[2px] border-black rounded-full" >{entrants}</span></h2>
                    <h2 className="bg-red-800 w-full border-2 border-black text-white rounded-xl p-2">Tickets: <br /> <span className="px-12 bg-white text-black border-[2px] border-black rounded-full" >{ticketsSold}/{limit}</span></h2>
                    <h2 className="bg-yellow-500 col-span-2 text-black border-2 border-black rounded-xl py-2 w-full mx-auto">Your Tickets: {holding}/{limitPerWallet}</h2>
                </div>
                <h2 className="text-black bg-white w-fit rounded-t-none rounded-xl py-2 px-4 mx-auto text-[1.2rem] border-x-2 truncate border-black border-b-2">Price: {price} $PEARL</h2>
                
                <button onClick={()=>{
                    setTicketModal(true);
                }} className="text-3xl bg-red-500 hover:bg-red-600 duration-200 text-white px-5 py-3 mt-4 rounded-xl border-2 border-black ">Buy Tickets</button>
                
                
            </div> 
            

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