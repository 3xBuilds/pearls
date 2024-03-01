import { Inter } from "next/font/google";
import "./globals.css";
import candybeans from "next/font/local"
import Providers from "@/utils/Providers";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import image from "../assets/images/taco-truck-day-inside.png"
const font = candybeans({ src: "../assets/fonts/candy-beans.otf" })


export const metadata = {
  title: "Pearls NFT",
  description: "Pearls NFT collection",

  og: {
    url: 'https://oysterbar.tacotribe.shop',
    type: 'website',
    title: 'Pearls NFT',
    description: 'Pearls NFT collection',
    image: 'https://opengraph.b-cdn.net/production/documents/a498cf9b-b83c-4f78-8368-80e0c1bc99d5.png?token=wkFq5kPFTJ-VRDyLvF7OVkb4zQKsamCWXrfFHX_DexA&height=636&width=1200&expires=33245315563',
  },
  twitter: {
    card: 'summary_large_image',
    domain: 'oysterbar.tacotribe.shop',
    url: 'https://oysterbar.tacotribe.shop',
    title: 'Pearls NFT',
    description: 'Pearls NFT collection',
    image: 'https://opengraph.b-cdn.net/production/documents/a498cf9b-b83c-4f78-8368-80e0c1bc99d5.png?token=wkFq5kPFTJ-VRDyLvF7OVkb4zQKsamCWXrfFHX_DexA&height=636&width=1200&expires=33245315563',
  },

};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
         
      </head>
      <body className={font.className + ""}>
        <Providers>
          <ToastContainer />
          {children}
        </Providers>
      </body>
    </html>
  );
}
