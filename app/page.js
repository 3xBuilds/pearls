import Staking from "@/components/Staking";
import Navbar from "../components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <main className="">
      <Navbar/>
      <Staking/>
    </main>
  );
}
