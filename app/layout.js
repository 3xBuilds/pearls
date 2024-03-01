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

};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
          <meta property="og:url" content="https://oysterbar.tacotribe.shop"/>
          <meta property="og:type" content="website"/>
          <meta property="og:title" content="Pearls NFT"/>
          <meta property="og:description" content="Pearls NFT collection"/>
          <meta property="og:image" content="https://opengraph.b-cdn.net/production/documents/a498cf9b-b83c-4f78-8368-80e0c1bc99d5.png?token=wkFq5kPFTJ-VRDyLvF7OVkb4zQKsamCWXrfFHX_DexA&height=636&width=1200&expires=33245315563"/>


          <meta name="twitter:card" content="summary_large_image"/>
          <meta property="twitter:domain" content="oysterbar.tacotribe.shop"/>
          <meta property="twitter:url" content="https://oysterbar.tacotribe.shop"/>
          <meta name="twitter:title" content="Pearls NFT"/>
          <meta name="twitter:description" content="Pearls NFT collection"/>
          <meta name="twitter:image" content="https://opengraph.b-cdn.net/production/documents/a498cf9b-b83c-4f78-8368-80e0c1bc99d5.png?token=wkFq5kPFTJ-VRDyLvF7OVkb4zQKsamCWXrfFHX_DexA&height=636&width=1200&expires=33245315563"/>

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
